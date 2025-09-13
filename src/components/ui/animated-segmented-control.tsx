import React from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import Animated, {
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';

export type SegmentedControlProps = {
    options: string[];
    selectedOption: string;
    height?: number;
    onOptionPress?: (option: string) => void;
};

const SegmentedControl: React.FC<SegmentedControlProps> = React.memo(
    ({ options, selectedOption, onOptionPress, height = 40 }) => {
        const { width: windowWidth } = useWindowDimensions();

        const internalPadding = 10;
        const segmentedControlWidth = windowWidth - 33;

        const itemWidth =
            (segmentedControlWidth - internalPadding) / options.length;

        const rStyle = useAnimatedStyle(() => {
            return {
                left: withTiming(
                    itemWidth * options.indexOf(selectedOption) + internalPadding / 2
                ),
            };
        }, [selectedOption, options, itemWidth]);

        return (
            <View
                className="flex-row bg-muted-foreground/15 rounded-lg"
                style={{
                    height: height,
                    width: segmentedControlWidth,
                    paddingLeft: internalPadding / 2,
                }}
            >
                <Animated.View
                    className="absolute rounded-md h-[80%] top-[10%] bg-background"
                    style={[
                        {
                            width: itemWidth,
                            shadowColor: 'black',
                            shadowOffset: {
                                width: 0,
                                height: 0,
                            },
                            shadowOpacity: 0.1,
                            elevation: 3,
                        },
                        rStyle,
                    ]}
                />
                {options.map((option) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                onOptionPress?.(option);
                            }}
                            key={option}
                            className="justify-center items-center"
                            style={{
                                width: itemWidth,
                            }}
                        >
                            <Text>{option}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }
);

export { SegmentedControl };
