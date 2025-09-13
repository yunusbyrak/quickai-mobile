import { ScrollView, View, Pressable } from "react-native"
import { Text } from "@/components/ui/text"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { HapticButton } from "@/components"
import { useTheme } from "@/context/ThemeContext"

const exampleTranscript = [
    {
        "lang": "en",
        "text": "What if you could hack almost any\ncompany through its AI and not just silly",
        "offset": 120,
        "duration": 3870
    },
    {
        "lang": "en",
        "text": "things like making it say bad words,\nbut stealing its most sensitive data,",
        "offset": 3990,
        "duration": 4020
    },
    {
        "lang": "en",
        "text": "customer list, trade secrets, everything.",
        "offset": 8160,
        "duration": 2190
    },
    {
        "lang": "en",
        "text": "I sat down with the world's\ntop AI hacker, Jason Haddock,",
        "offset": 10410,
        "duration": 3270
    },
    {
        "lang": "en",
        "text": "who showed me the exact mind blowing\ntechniques attackers are using,",
        "offset": 14130,
        "duration": 3390
    },
    {
        "lang": "en",
        "text": "including attacks. The CEO of\nOpenAI said might be unsolvable.",
        "offset": 17670,
        "duration": 3810
    },
    {
        "lang": "en",
        "text": "If you're building with ai, you're\nprobably vulnerable to all of this.",
        "offset": 21870,
        "duration": 3240
    },
    {
        "lang": "en",
        "text": "And if you're looking to learn\nhow to hack ai, now is the time.",
        "offset": 25290,
        "duration": 3150
    },
    {
        "lang": "en",
        "text": "It's a gold rush.",
        "offset": 28440,
        "duration": 990
    },
    {
        "lang": "en",
        "text": "It feels like the early days of\nweb hacking where SQL injection",
        "offset": 29490,
        "duration": 4830
    },
    {
        "lang": "en",
        "text": "was everywhere and you could get shell\non almost any enterprise based internet",
        "offset": 34320,
        "duration": 4080
    },
    {
        "lang": "en",
        "text": "accessible website.",
        "offset": 38400,
        "duration": 1170
    },
    {
        "lang": "en",
        "text": "By the end of this video,",
        "offset": 39630,
        "duration": 1050
    },
    {
        "lang": "en",
        "text": "you will understand the\nblueprint attackers are using\nand you'll learn how to do",
        "offset": 40680,
        "duration": 3270
    },
    {
        "lang": "en",
        "text": "some of these attacks yourself. I'll\neven show you a demo. You can try, oh,",
        "offset": 43950,
        "duration": 3090
    },
    {
        "lang": "en",
        "text": "it's addicting,",
        "offset": 47070,
        "duration": 780
    },
    {
        "lang": "en",
        "text": "and then at the end I'll show you how\nyou can actually defend yourself against",
        "offset": 47850,
        "duration": 2970
    },
    {
        "lang": "en",
        "text": "these AI attacks. Get your\ncoffee ready. Let's go.",
        "offset": 50820,
        "duration": 3270
    },
    {
        "lang": "en",
        "text": "Now hold up. When we say we're hacking\nai, what are we talking about? Exactly.",
        "offset": 57825,
        "duration": 3615
    },
    {
        "lang": "en",
        "text": "What does it mean to hack ai?\nIt's actually more than you think.",
        "offset": 61590,
        "duration": 3570
    },
    {
        "lang": "en",
        "text": "So this could be a chat bot that a\ncompany is hosting for customer service.",
        "offset": 65250,
        "duration": 4230
    },
    {
        "lang": "en",
        "text": "It could be an API that you don't even\nknow is AI enabled on the backend?",
        "offset": 69510,
        "duration": 3990
    },
    {
        "lang": "en",
        "text": "It's doing analysis on the backend. It\ncould be an internal app for employees,",
        "offset": 73830,
        "duration": 4140
    },
    {
        "lang": "en",
        "text": "could be exposed to the internet.\nWe've seen kind of all kinds of things.",
        "offset": 78240,
        "duration": 3690
    },
    {
        "lang": "en",
        "text": "So it's not just getting to a prompt\nwindow and trying to hack chat chip t.",
        "offset": 82080,
        "duration": 3150
    },
    {
        "lang": "en",
        "text": "That happens,",
        "offset": 85530,
        "duration": 810
    },
    {
        "lang": "en",
        "text": "but many of the apps you're seeing now\nare using AI in obvious and sometimes not",
        "offset": 86340,
        "duration": 4140
    },
    {
        "lang": "en",
        "text": "so obvious ways. And\nthere are vulnerabilities.",
        "offset": 90480,
        "duration": 2820
    },
    {
        "lang": "en",
        "text": "Vulnerabilities that go beyond simple\njailbreaking or just tricking the model to",
        "offset": 93390,
        "duration": 3450
    },
    {
        "lang": "en",
        "text": "say something it shouldn't say, which\nby the way, that's a fun part of it.",
        "offset": 96840,
        "duration": 2610
    },
    {
        "lang": "en",
        "text": "Definitely part of the process.\nWe'll cover more on that later,",
        "offset": 99480,
        "duration": 2520
    },
    {
        "lang": "en",
        "text": "but there's more to it.",
        "offset": 102270,
        "duration": 870
    },
    {
        "lang": "en",
        "text": "We call 'em AI pen test\nversus AI red teamings,",
        "offset": 103230,
        "duration": 2280
    },
    {
        "lang": "en",
        "text": "because AI red teaming is a term that's\nbeen around for quite a while and it",
        "offset": 105510,
        "duration": 4620
    }
]

// Helper function to format time in HH:MM:SS format
const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}


export default function TranscriptScreen({
    onClose
}: {
    onClose: () => void;
}) {
    const insets = useSafeAreaInsets();
    const { isDark } = useTheme();
    return (
        <View className="flex-1 bg-muted gap-3" style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <View className="px-4">
                <HapticButton
                    onPress={() => onClose()}
                    className="rounded-full justify-center w-10 h-10 bg-white items-center border border-gray-200"
                >
                    <Ionicons
                        className="-ml-0.5"
                        name="chevron-back-outline"
                        size={24}
                        color={isDark ? 'white' : 'black'}
                    />
                </HapticButton>
            </View>
            <View
                className="flex-1 bg-white rounded-2xl shadow-sm border border-foreground/5 mx-4"
            >
                <View className="border-b border-gray-100 mx-4 pb-4 pt-4 ">
                    <Text className="text-gray-900 font-semibold">
                        Transcription
                    </Text>
                </View>
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <View className="px-4 py-4 gap-4">
                        {exampleTranscript.map((segment, index) =>
                            <View key={index}>
                                <View className="flex-col items-start">
                                    <View className="rounded">
                                        <Text className="text-orange-500 text-xs font-medium">
                                            [{formatTime(segment.offset)} - {formatTime(segment.offset + segment.duration)}]
                                        </Text>
                                    </View>
                                    <Text className="text-gray-900 text-sm w-full">
                                        {segment.text.replace(/\n/g, ' ')}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}
