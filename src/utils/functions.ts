export const getCountryFlag = (language: string) => {
    if(language === 'en') {
        return 'us';
    }
    return language;
}
