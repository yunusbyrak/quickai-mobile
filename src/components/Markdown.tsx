import MarkdownView from 'react-native-markdown-display';

const style = {
    body: {
        lineHeight: 20,
        gap: 4,
        paddingTop: 10,
    },
    // Headings
    heading1: {
        fontWeight: 'bold',
        fontSize: 24,
        lineHeight: 32,
    },
    heading2: {
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 32,
    },
    heading3: {
        fontSize: 18,
    },
    heading4: {
        fontSize: 16,
    },
    heading5: {
        fontSize: 13,
    },
    heading6: {
        fontSize: 11,
    },
    bullet_list: {
        gap: 10
    },
    bullet_list_icon: {
        fontSize: 20,
    },
    ordered_list: {
        gap: 10,
    }
}

export default function Markdown({ children }: { children: React.ReactNode }) {
    return (
        <MarkdownView style={style as any}>
            {children}
        </MarkdownView>
    )
}
