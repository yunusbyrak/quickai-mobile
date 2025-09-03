import { View, Text, Button } from 'react-native'
import { useColorScheme } from 'nativewind';
import { useTheme } from '@/context/ThemeContext';

const ThemeSelector = () => {
    const { themeMode, toggleTheme, } = useTheme();

    return (
        <View className='justify-center flex-col gap-4'>
            <Text className='text-lg font-bold'>Theme Selector</Text>
            <View className='flex-row w-full justify-between gap-2 items-center'>
                <Button title='Toggle Theme' onPress={toggleTheme} />
                <View className='bg-black py-2 px-6 dark:bg-white'>
                    <Text className='text-white dark:text-black'>{themeMode}</Text>
                </View>
            </View>
        </View>
    )
}

export default ThemeSelector
