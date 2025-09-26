import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '@/lib/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEffect, useState } from 'react';
import Markdown from '@/components/Markdown';

export default function TemplateResult() {
  const { response, templateName, templateIcon } = useLocalSearchParams<{
    response: string;
    templateName: string;
    templateIcon: string;
  }>();

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [parsedResponse, setParsedResponse] = useState<string>('');

  useEffect(() => {
    if (response) {
      try {
        // If response is a JSON string, parse it
        const parsed = JSON.parse(response);
        setParsedResponse(parsed.content || parsed.result || JSON.stringify(parsed, null, 2));
      } catch {
        // If not JSON, use as is
        setParsedResponse(response);
      }
    }
  }, [response]);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          onPress={handleGoBack}
          className="flex-row items-center gap-2">
          <Ionicons name="arrow-back" size={20} color={THEME.light.foreground} />
          <Text className="text-foreground">Back</Text>
        </Button>

        <View className="flex-row items-center gap-2">
          {templateIcon && <Text className="text-lg">{templateIcon}</Text>}
          <Text className="font-semibold text-foreground">{templateName || 'Template Result'}</Text>
        </View>

        <View className="w-16" />
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}>
        {parsedResponse ? (
          <View className="rounded-lg bg-card p-4 shadow-sm shadow-black/5">
            <Markdown>{parsedResponse}</Markdown>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-center text-muted-foreground">No content available</Text>
          </View>
        )}
      </ScrollView>

      {/* Actions */}
      <View className="border-t border-border px-4 pb-4 pt-2">
        <View className="flex-row gap-3">
          <Button variant="outline" className="flex-1">
            <Ionicons name="share-outline" size={18} color={THEME.light.foreground} />
            <Text>Share</Text>
          </Button>

          <Button variant="outline" className="flex-1">
            <Ionicons name="copy-outline" size={18} color={THEME.light.foreground} />
            <Text>Copy</Text>
          </Button>

          <Button variant="outline" className="flex-1">
            <Ionicons name="bookmark-outline" size={18} color={THEME.light.foreground} />
            <Text>Save</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
