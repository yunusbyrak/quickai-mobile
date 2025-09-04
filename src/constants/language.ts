export const languages = [
    {
        code: "en",
        language: "English",
        flag: "🇬🇧",
        name: "English"
    },
    {
        code: "es",
        language: "Español",
        flag: "🇪🇸",
        name: "Spanish"
    },
    {
        code: "pl",
        language: "Polski",
        flag: "🇵🇱",
        name: "Polish"
    },
    {
        code: "pt",
        language: "Português",
        flag: "🇵🇹",
        name: "Portuguese"
    },
    {
        code: "fr",
        language: "Français",
        flag: "🇫🇷",
        name: "French"
    },
    {
        code: "de",
        language: "Deutsch",
        flag: "🇩🇪",
        name: "German"
    },
    {
        code: "tr",
        language: "Türkçe",
        flag: "🇹🇷",
        name: "Turkish"
    },
    {
        code: "el",
        language: "Ελληνικά",
        flag: "🇬🇷",
        name: "Greek"
    },
    {
        code: "id",
        language: "Bahasa Indonesia",
        flag: "🇮🇩",
        name: "Indonesian"
    },
    {
        code: "it",
        language: "Italiano",
        flag: "🇮🇹",
        name: "Italian"
    },
    {
        code: "ja",
        language: "日本語",
        flag: "🇯🇵",
        name: "Japanese"
    },
    {
        code: "ko",
        language: "한국어",
        flag: "🇰🇷",
        name: "Korean"
    },
    {
        code: "ro",
        language: "Română",
        flag: "🇷🇴",
        name: "Romanian"
    },
    {
        code: "ru",
        language: "Русский",
        flag: "🇷🇺",
        name: "Russian"
    },
    {
        code: "nl",
        language: "Nederlands",
        flag: "🇳🇱",
        name: "Dutch"
    },
    {
        code: "zh",
        language: "中文",
        flag: "🇨🇳",
        name: "Chinese (Simplified)"
    },
    {
        code: "sv",
        language: "Svenska",
        flag: "🇸🇪",
        name: "Swedish"
    },
    {
        code: "zh-tw",
        language: "繁體中文",
        flag: "🇹🇼",
        name: "Chinese (Traditional)"
    },
    {
        code: "uk",
        language: "Українська",
        flag: "🇺🇦",
        name: "Ukrainian"
    }
];

export const getLanguageCodes = () => {
    return languages.map((language) => language.code);
}

export const getLanguageWithCode = (code: string) => {
    return languages.find((language) => language.code === code);
}

export const translationLanguages = [
    {
        "code": "en",
        "language": "English",
        "flag": "🇬🇧",
        "name": "English"
    },
    {
        "code": "de",
        "language": "Deutsch",
        "flag": "🇩🇪",
        "name": "German"
    },
    {
        "code": "ru",
        "language": "Русский",
        "flag": "🇷🇺",
        "name": "Russian"
    },
    {
        "code": "fr",
        "language": "Français",
        "flag": "🇫🇷",
        "name": "French"
    },
    {
        "code": "es",
        "language": "Español",
        "flag": "🇪🇸",
        "name": "Spanish"
    },
    {
        "code": "tr",
        "language": "Türkçe",
        "flag": "🇹🇷",
        "name": "Turkish"
    },
    {
        "code": "zh",
        "language": "中文",
        "flag": "🇨🇳",
        "name": "Chinese"
    },
    {
        "code": "ja",
        "language": "日本語",
        "flag": "🇯🇵",
        "name": "Japanese"
    },
    {
        "code": "pt",
        "language": "Português",
        "flag": "🇵🇹",
        "name": "Portuguese"
    },
    {
        "code": "ar",
        "language": "العربية",
        "flag": "🇸🇦",
        "name": "Arabic"
    },
    {
        "code": "af",
        "language": "Afrikaans",
        "flag": "🇿🇦",
        "name": "Afrikaans"
    },
    {
        "code": "sq",
        "language": "Shqip",
        "flag": "🇦🇱",
        "name": "Albanian"
    },
    {
        "code": "am",
        "language": "አማርኛ",
        "flag": "🇪🇹",
        "name": "Amharic"
    },
    {
        "code": "hy",
        "language": "Հայերեն",
        "flag": "🇦🇲",
        "name": "Armenian"
    },
    {
        "code": "as",
        "language": "অসমীয়া",
        "flag": "🇮🇳",
        "name": "Assamese"
    },
    {
        "code": "az",
        "language": "Azərbaycan dili",
        "flag": "🇦🇿",
        "name": "Azerbaijani"
    },
    {
        "code": "ba",
        "language": "Башҡортса",
        "flag": "🇷🇺",
        "name": "Bashkir"
    },
    {
        "code": "eu",
        "language": "Euskara",
        "flag": "🇪🇸",
        "name": "Basque"
    },
    {
        "code": "be",
        "language": "Беларуская",
        "flag": "🇧🇾",
        "name": "Belarusian"
    },
    {
        "code": "bn",
        "language": "বাংলা",
        "flag": "🇧🇩",
        "name": "Bengali"
    },
    {
        "code": "bs",
        "language": "Bosanski",
        "flag": "🇧🇦",
        "name": "Bosnian"
    },
    {
        "code": "br",
        "language": "Brezhoneg",
        "flag": "🇫🇷",
        "name": "Breton"
    },
    {
        "code": "bg",
        "language": "Български",
        "flag": "🇧🇬",
        "name": "Bulgarian"
    },
    {
        "code": "my",
        "language": "မြန်မာစာ",
        "flag": "🇲🇲",
        "name": "Burmese"
    },
    {
        "code": "ca",
        "language": "Català",
        "flag": "🇪🇸",
        "name": "Catalan"
    },
    {
        "code": "hr",
        "language": "Hrvatski",
        "flag": "🇭🇷",
        "name": "Croatian"
    },
    {
        "code": "cs",
        "language": "Čeština",
        "flag": "🇨🇿",
        "name": "Czech"
    },
    {
        "code": "da",
        "language": "Dansk",
        "flag": "🇩🇰",
        "name": "Danish"
    },
    {
        "code": "nl",
        "language": "Nederlands",
        "flag": "🇳🇱",
        "name": "Dutch"
    },
    {
        "code": "et",
        "language": "Eesti",
        "flag": "🇪🇪",
        "name": "Estonian"
    },
    {
        "code": "fo",
        "language": "Føroyskt",
        "flag": "🇫🇴",
        "name": "Faroese"
    },
    {
        "code": "fi",
        "language": "Suomi",
        "flag": "🇫🇮",
        "name": "Finnish"
    },
    {
        "code": "gl",
        "language": "Galego",
        "flag": "🇪🇸",
        "name": "Galician"
    },
    {
        "code": "ka",
        "language": "ქართული",
        "flag": "🇬🇪",
        "name": "Georgian"
    },
    {
        "code": "el",
        "language": "Ελληνικά",
        "flag": "🇬🇷",
        "name": "Greek"
    },
    {
        "code": "gu",
        "language": "ગુજરાતી",
        "flag": "🇮🇳",
        "name": "Gujarati"
    },
    {
        "code": "ht",
        "language": "Kreyòl ayisyen",
        "flag": "🇭🇹",
        "name": "Haitian Creole"
    },
    {
        "code": "ha",
        "language": "Hausa",
        "flag": "🇳🇬",
        "name": "Hausa"
    },
    {
        "code": "haw",
        "language": "ʻŌlelo Hawaiʻi",
        "flag": "🇺🇸",
        "name": "Hawaiian"
    },
    {
        "code": "he",
        "language": "עברית",
        "flag": "🇮🇱",
        "name": "Hebrew"
    },
    {
        "code": "hi",
        "language": "हिन्दी",
        "flag": "🇮🇳",
        "name": "Hindi"
    },
    {
        "code": "hu",
        "language": "Magyar",
        "flag": "🇭🇺",
        "name": "Hungarian"
    },
    {
        "code": "is",
        "language": "Íslenska",
        "flag": "🇮🇸",
        "name": "Icelandic"
    },
    {
        "code": "id",
        "language": "Bahasa Indonesia",
        "flag": "🇮🇩",
        "name": "Indonesian"
    },
    {
        "code": "it",
        "language": "Italiano",
        "flag": "🇮🇹",
        "name": "Italian"
    },
    {
        "code": "jv",
        "language": "Basa Jawa",
        "flag": "🇮🇩",
        "name": "Javanese"
    },
    {
        "code": "kn",
        "language": "ಕನ್ನಡ",
        "flag": "🇮🇳",
        "name": "Kannada"
    },
    {
        "code": "kk",
        "language": "Қазақ тілі",
        "flag": "🇰🇿",
        "name": "Kazakh"
    },
    {
        "code": "km",
        "language": "ភាសាខ្មែរ",
        "flag": "🇰🇭",
        "name": "Khmer"
    },
    {
        "code": "ko",
        "language": "한국어",
        "flag": "🇰🇷",
        "name": "Korean"
    },
    {
        "code": "lo",
        "language": "ລາວ",
        "flag": "🇱🇦",
        "name": "Lao"
    },
    {
        "code": "la",
        "language": "Latina",
        "flag": "🇻🇦",
        "name": "Latin"
    },
    {
        "code": "lv",
        "language": "Latviešu",
        "flag": "🇱🇻",
        "name": "Latvian"
    },
    {
        "code": "lt",
        "language": "Lietuvių",
        "flag": "🇱🇹",
        "name": "Lithuanian"
    },
    {
        "code": "lb",
        "language": "Lëtzebuergesch",
        "flag": "🇱🇺",
        "name": "Luxembourgish"
    },
    {
        "code": "mk",
        "language": "Македонски",
        "flag": "🇲🇰",
        "name": "Macedonian"
    },
    {
        "code": "mg",
        "language": "Malagasy",
        "flag": "🇲🇬",
        "name": "Malagasy"
    },
    {
        "code": "ms",
        "language": "Bahasa Melayu",
        "flag": "🇲🇾",
        "name": "Malay"
    },
    {
        "code": "ml",
        "language": "മലയാളം",
        "flag": "🇮🇳",
        "name": "Malayalam"
    },
    {
        "code": "mt",
        "language": "Malti",
        "flag": "🇲🇹",
        "name": "Maltese"
    },
    {
        "code": "mr",
        "language": "मराठी",
        "flag": "🇮🇳",
        "name": "Marathi"
    },
    {
        "code": "mn",
        "language": "Монгол",
        "flag": "🇲🇳",
        "name": "Mongolian"
    },
    {
        "code": "mi",
        "language": "Māori",
        "flag": "🇳🇿",
        "name": "Māori"
    },
    {
        "code": "ne",
        "language": "नेपाली",
        "flag": "🇳🇵",
        "name": "Nepali"
    },
    {
        "code": "no",
        "language": "Norsk",
        "flag": "🇳🇴",
        "name": "Norwegian"
    },
    {
        "code": "nn",
        "language": "Norsk nynorsk",
        "flag": "🇳🇴",
        "name": "Norwegian Nynorsk"
    },
    {
        "code": "oc",
        "language": "Occitan",
        "flag": "🇫🇷",
        "name": "Occitan"
    },
    {
        "code": "ps",
        "language": "پښتو",
        "flag": "🇦🇫",
        "name": "Pashto"
    },
    {
        "code": "fa",
        "language": "فارسی",
        "flag": "🇮🇷",
        "name": "Persian"
    },
    {
        "code": "pl",
        "language": "Polski",
        "flag": "🇵🇱",
        "name": "Polish"
    },
    {
        "code": "pa",
        "language": "ਪੰਜਾਬੀ",
        "flag": "🇮🇳",
        "name": "Punjabi"
    },
    {
        "code": "ro",
        "language": "Română",
        "flag": "🇷🇴",
        "name": "Romanian"
    },
    {
        "code": "sa",
        "language": "संस्कृतम्",
        "flag": "🇮🇳",
        "name": "Sanskrit"
    },
    {
        "code": "sr",
        "language": "Српски",
        "flag": "🇷🇸",
        "name": "Serbian"
    },
    {
        "code": "sn",
        "language": "ChiShona",
        "flag": "🇿🇼",
        "name": "Shona"
    },
    {
        "code": "sd",
        "language": "سنڌي",
        "flag": "🇵🇰",
        "name": "Sindhi"
    },
    {
        "code": "si",
        "language": "සිංහල",
        "flag": "🇱🇰",
        "name": "Sinhala"
    },
    {
        "code": "sk",
        "language": "Slovenčina",
        "flag": "🇸🇰",
        "name": "Slovak"
    },
    {
        "code": "sl",
        "language": "Slovenščina",
        "flag": "🇸🇮",
        "name": "Slovenian"
    },
    {
        "code": "so",
        "language": "Soomaali",
        "flag": "🇸🇴",
        "name": "Somali"
    },
    {
        "code": "su",
        "language": "Basa Sunda",
        "flag": "🇮🇩",
        "name": "Sundanese"
    },
    {
        "code": "sw",
        "language": "Kiswahili",
        "flag": "🇹🇿",
        "name": "Swahili"
    },
    {
        "code": "sv",
        "language": "Svenska",
        "flag": "🇸🇪",
        "name": "Swedish"
    },
    {
        "code": "tl",
        "language": "Tagalog",
        "flag": "🇵🇭",
        "name": "Tagalog"
    },
    {
        "code": "tg",
        "language": "Тоҷикӣ",
        "flag": "🇹🇯",
        "name": "Tajik"
    },
    {
        "code": "ta",
        "language": "தமிழ்",
        "flag": "🇮🇳",
        "name": "Tamil"
    },
    {
        "code": "tt",
        "language": "Татар теле",
        "flag": "🇷🇺",
        "name": "Tatar"
    },
    {
        "code": "te",
        "language": "తెలుగు",
        "flag": "🇮🇳",
        "name": "Telugu"
    },
    {
        "code": "th",
        "language": "ไทย",
        "flag": "🇹🇭",
        "name": "Thai"
    },
    {
        "code": "bo",
        "language": "བོད་ཡིག",
        "flag": "🇨🇳",
        "name": "Tibetan"
    },
    {
        "code": "tk",
        "language": "Türkmençe",
        "flag": "🇹🇲",
        "name": "Turkmen"
    },
    {
        "code": "uk",
        "language": "Українська",
        "flag": "🇺🇦",
        "name": "Ukrainian"
    },
    {
        "code": "ur",
        "language": "اردو",
        "flag": "🇵🇰",
        "name": "Urdu"
    },
    {
        "code": "uz",
        "language": "Oʻzbekcha",
        "flag": "🇺🇿",
        "name": "Uzbek"
    },
    {
        "code": "vi",
        "language": "Tiếng Việt",
        "flag": "🇻🇳",
        "name": "Vietnamese"
    },
    {
        "code": "cy",
        "language": "Cymraeg",
        "flag": "🏴",
        "name": "Welsh"
    },
    {
        "code": "xh",
        "language": "isiXhosa",
        "flag": "🇿🇦",
        "name": "Xhosa"
    },
    {
        "code": "yi",
        "language": "ייִדיש",
        "flag": "🇮🇱",
        "name": "Yiddish"
    },
    {
        "code": "yo",
        "language": "Yorùbá",
        "flag": "🇳🇬",
        "name": "Yoruba"
    },
    {
        "code": "zu",
        "language": "isiZulu",
        "flag": "🇿🇦",
        "name": "Zulu"
    }
]
