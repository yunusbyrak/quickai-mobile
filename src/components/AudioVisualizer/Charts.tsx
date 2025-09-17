import React, { useMemo } from 'react';
import {
  Points,
  vec,
  Line,
  Circle,
  Skia,
  PaintStyle,
  SkPoint,
} from '@shopify/react-native-skia';

import { useCanvas } from './Canvas';
import { getPointCX, getPointCY, getAngle } from '@/utils/skiUtils';

const INNER_RADIUS = 90;
const OUTER_RADIUS = 150;

interface Point {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

function sampleExp(value: number) {
  return Math.exp(2.5 * value) / 4 - 0.2;
}

function weightWithIndex(value: number, index: number, indexMax: number) {
  if (index < indexMax / 2) {
    return value * Math.max(index / (indexMax / 2), 0.5);
  }

  return value;
}

interface ChartProps {
  data: Uint8Array;
  fftSize: number;
  frequencyBinCount: number;
}

const TimeChart: React.FC<ChartProps> = (props) => {
  const { size } = useCanvas();
  const { data, fftSize } = props;

  const circlePaint = useMemo(() => {
    const paint = Skia.Paint();
    paint.setAntiAlias(true);
    paint.setColor(Skia.Color('#FFD700'));
    paint.setStyle(PaintStyle.Stroke);
    paint.setStrokeWidth(6);
    return paint;
  }, []);

  const points = useMemo(() => {
    const maxHeight = size.height;
    const maxWidth = size.width;

    const startWidth = (maxWidth - 2 * INNER_RADIUS) / 2;
    const startHight = maxHeight - (maxHeight - 2 * INNER_RADIUS) / 2;

    const p: SkPoint[] = [];

    data.forEach((value, index) => {
      const x = startWidth + (index * 2 * INNER_RADIUS) / fftSize;
      const y = startHight - (value / 255) * 2 * INNER_RADIUS;

      p.push(vec(x, y));
    });

    return p;
  }, [size, data, fftSize]);

  return (
    <>
      <Circle
        cx={size.width / 2}
        cy={size.height / 2}
        r={140}
        paint={circlePaint}
      />
      <Points points={points} mode="polygon" color="#B5E1F1" strokeWidth={2} />
    </>
  );
};

const FrequencyChart: React.FC<ChartProps> = (props) => {
  const { size } = useCanvas();
  const { data, frequencyBinCount } = props;

  const { points, barWidth } = useMemo(() => {
    const maxHeight = size.height;
    const maxWidth = size.width;
    const bw = (Math.PI * 150) / (frequencyBinCount - 64);

    const p: Point[] = [];

    function getPoint(
      index: number,
      value: number,
      color: string,
      ogIndex: number
    ) {
      const angle = getAngle(index - 32, 2 * (frequencyBinCount - 64));
      const x1 = getPointCX(angle, OUTER_RADIUS, maxWidth / 2);
      const y1 = getPointCY(angle, OUTER_RADIUS, maxHeight / 2);

      const x2 = getPointCX(
        angle,
        OUTER_RADIUS +
          sampleExp(
            weightWithIndex(value / 255.0, ogIndex, frequencyBinCount)
          ) *
            40,
        maxWidth / 2
      );

      const y2 = getPointCY(
        angle,
        OUTER_RADIUS +
          sampleExp(
            weightWithIndex(value / 255.0, ogIndex, frequencyBinCount)
          ) *
            40,
        maxHeight / 2
      );

      return { color, x1, y1, x2, y2 };
    }

    data.forEach((value, index) => {
      if (index < 32 || index >= frequencyBinCount - 32) {
        return;
      }

      const hue = 180 + 20 * (index / frequencyBinCount);
      const color = `hsla(${hue}, 100%, 50%, 80%)`;

      p.push(getPoint(index, value, color, index));
      p.push(getPoint(2 * frequencyBinCount - 65 - index, value, color, index));
    });

    return { points: p, barWidth: bw };
  }, [size, data, frequencyBinCount]);

  return (
    <>
      {points.map((point, index) => (
        <Line
          key={index}
          p1={vec(point.x1, point.y1)}
          p2={vec(point.x2, point.y2)}
          style="stroke"
          color={point.color}
          strokeWidth={barWidth}
        />
      ))}
    </>
  );
};

export default {
  TimeChart,
  FrequencyChart,
};
