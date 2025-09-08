import * as Haptics from 'expo-haptics';
import { TouchableOpacity, Pressable } from 'react-native';

type HapticButtonProps = React.ComponentProps<typeof TouchableOpacity> & {
    hapticType?: 'light' | 'medium' | 'heavy' | 'selection' | 'impact' | 'notification' | 'none';
    hapticEnabled?: boolean;
};

function HapticButton({
    hapticType = 'light',
    hapticEnabled = true,
    onPress,
    ...props
}: HapticButtonProps) {
    const handlePress = (event: any) => {
        // Trigger haptic feedback if enabled
        if (hapticEnabled && hapticType !== 'none') {
            switch (hapticType) {
                case 'light':
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    break;
                case 'medium':
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    break;
                case 'heavy':
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    break;
                case 'selection':
                    Haptics.selectionAsync();
                    break;
                case 'impact':
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    break;
                case 'notification':
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    break;
                default:
                    break;
            }
        }

        // Call the original onPress handler
        onPress?.(event);
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            {...props}
        />
    );
}

export { HapticButton };
export type { HapticButtonProps };
