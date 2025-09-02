import { View, Text, Button } from 'react-native'
import { useColorScheme } from 'nativewind';

const ThemeSelector = () => {
    const { colorScheme, toggleColorScheme } = useColorScheme();

    return (
        <View className='justify-center flex-col gap-4'>
            <Text className='text-lg font-bold'>Theme Selector</Text>
            <View className='flex-row w-full justify-between gap-2 items-center'>
                <Button title='Toggle Theme' onPress={toggleColorScheme} />
                <View className='bg-black py-2 px-6 dark:bg-white'>
                    <Text className='text-white dark:text-black'>{colorScheme}</Text>
                </View>
            </View>
        </View>
    )
}

export default ThemeSelector
