import { View, Text, TouchableOpacity } from 'react-native'
import CountryFlag from "react-native-country-flag";
import { languages } from '@/constants/language';
import { getCountryFlag } from '@/utils/functions';
import { useTranslation } from '@/hooks/useTranslation';

const Language = () => {
    const { t, changeLanguage, currentLanguage } = useTranslation();

    return (
        <View className='justify-center flex-col'>
            <Text className='text-lg font-bold'>Languages</Text>
            <View className='flex-row w-full justify-between gap-2 items-center'>
                <Text>{t('welcome')}</Text>
                <View className='flex-row gap-2'>
                    {
                        languages.map((language) => (
                            <TouchableOpacity
                                key={language}
                                onPress={() => changeLanguage(language)}
                                className={`${currentLanguage === language ? 'border-2 border-primary' : ''}`}
                            >
                                <CountryFlag isoCode={getCountryFlag(language)} size={20} />
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </View>
        </View>
    )
}

export default Language
