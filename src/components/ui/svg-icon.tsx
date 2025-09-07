import React from 'react'
import { View } from 'react-native'
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg'

interface SvgIconProps {
    name: 'youtube' | 'image' | 'pdf'
    size?: number
    color?: string
    className?: string
}

export const SvgIcon: React.FC<SvgIconProps> = ({
    name,
    size = 20,
    color = '#000000',
    className
}) => {
    const renderSvg = () => {
        switch (name) {
            case 'youtube':
                return (
                    <Svg width={size} height={size} viewBox="0 0 461.001 461.001">
                        <G>
                            <Path
                                fill={color}
                                d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728
                                c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137
                                C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607
                                c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"
                            />
                        </G>
                    </Svg>
                )
            case 'image':
                return (
                    <Svg width={size} height={size} viewBox="0 0 25 24">
                        <Path
                            fill={color}
                            d="M9.145 6.935a1.625 1.625 0 0 0 0 3.25h.01a1.625 1.625 0 0 0 0-3.25z"
                        />
                        <Path
                            fill={color}
                            d="M3.75 5.5A2.25 2.25 0 0 1 6 3.25h13a2.25 2.25 0 0 1 2.25 2.25v13A2.25 2.25 0 0 1 19 20.75H6a2.25 2.25 0 0 1-2.25-2.25zM6 4.75a.75.75 0 0 0-.75.75v10.08l1.451-1.9a2.25 2.25 0 0 1 3.584.01L11.5 15.3a.75.75 0 0 0 1.293-.168l1.978-4.847c.667-1.635 2.872-1.9 3.906-.468l1.073 1.484V5.5a.75.75 0 0 0-.75-.75zM5.25 18.5c0 .414.336.75.75.75h13a.75.75 0 0 0 .75-.75v-4.64l-2.288-3.164a.75.75 0 0 0-1.302.156l-1.978 4.846c-.66 1.616-2.827 1.899-3.879.506l-1.215-1.61a.75.75 0 0 0-1.195-.003l-2.492 3.264a.8.8 0 0 1-.151.148z"
                        />
                    </Svg>
                )
            case 'pdf':
                return (
                    <Svg
                        width={size}
                        height={size}
                        viewBox="0 0 32 32"
                        fill="none"
                    >
                        <G clipPath="url(#clip0_4018_3078)">
                            <Path
                                d="M27 19H23V26"
                                stroke={color}
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <Path
                                d="M26 23H23"
                                stroke={color}
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <Path
                                d="M6 24H8C8.66304 24 9.29893 23.7366 9.76777 23.2678C10.2366 22.7989 10.5 22.163 10.5 21.5C10.5 20.837 10.2366 20.2011 9.76777 19.7322C9.29893 19.2634 8.66304 19 8 19H6V26"
                                stroke={color}
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <Path
                                d="M14 19V26H16C16.9283 26 17.8185 25.6313 18.4749 24.9749C19.1313 24.3185 19.5 23.4283 19.5 22.5C19.5 21.5717 19.1313 20.6815 18.4749 20.0251C17.8185 19.3687 16.9283 19 16 19H14Z"
                                stroke={color}
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <Path
                                d="M6 14V5C6 4.73478 6.10536 4.48043 6.29289 4.29289C6.48043 4.10536 6.73478 4 7 4H19L26 11V14"
                                stroke={color}
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <Path
                                d="M19 4V11H26"
                                stroke={color}
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </G>
                        <Defs>
                            <ClipPath id="clip0_4018_3078">
                                <Rect width={32} height={32} fill="white" />
                            </ClipPath>
                        </Defs>
                    </Svg>

                )
            default:
                return null
        }
    }

    return (
        <View className={className}>
            {renderSvg()}
        </View>
    )
}
