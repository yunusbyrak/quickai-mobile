import { View, Text, TouchableOpacity } from 'react-native'
import CountryFlag from "react-native-country-flag";
import { languages } from '@/constants/language';
import { getCountryFlag } from '@/utils/functions';
import { useTranslation } from '@/hooks/useTranslation';

const Language = () => {
    const { t, changeLanguage } = useTranslation();

    return (
        <View className='items-center justify-center flex-col gap-4'>
            <Text>{t('welcome')}</Text>
            <View className='flex-row gap-2'>
                {
                    languages.map((language) => (
                        <TouchableOpacity key={language} onPress={() => {
                            changeLanguage(language);
                        }}>
                            <CountryFlag isoCode={getCountryFlag(language)} size={20} />
                        </TouchableOpacity>
                    ))
                }
            </View>
        </View>
    )
}

export default Language
