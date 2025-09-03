import { View } from 'react-native'
import { useRef } from 'react'
import LottieView from 'lottie-react-native';
import Animated, {
    ZoomOut,
} from 'react-native-reanimated';

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

interface SplashScreenProps {
    onAnimationFinish: () => void;
}

const SplashScreen = ({
    onAnimationFinish
}: SplashScreenProps) => {
    const animation = useRef<LottieView>(null);
    return (
        <View
            className='flex-1 items-center justify-center bg-background'
        >
            <AnimatedLottieView
                exiting={ZoomOut}
                autoPlay
                ref={animation}
                loop={false}
                onAnimationFinish={onAnimationFinish}
                style={{
                    flex: 1,
                    height: '100%',
                    width: '100%',
                }}
                source={require('~/assets/lottie/logo.json')}
            />
        </View>
    )
}

export default SplashScreen
