import { View } from 'react-native';
import { Text } from './ui/text';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { THEME } from '@/lib/theme';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Ionicons } from '@expo/vector-icons';
import { HapticButton } from './ui/haptic-button';
import { cn } from '@/lib/utils';
import { useAppPreferences, useTemplates } from '@/hooks';
import { Template } from '@/types/template';
import AllTemplates from './AllTemplates';
import { generateTemplate } from '@/services/templates.service';
import { useRouter } from 'expo-router';

export default function NoteBottom({ noteId }: { noteId: string }) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { loadTemplates, templates } = useTemplates();
  const router = useRouter();

  const { preferences } = useAppPreferences();
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  const TemplateItem = memo(({ template }: { template: Template }) => {
    return (
      <HapticButton
        onPress={() => handleTemplatePress(template)}
        key={template.id}
        className={cn(' rounded-lg bg-background p-3 shadow-sm shadow-black/5 ')}>
        <View className="flex-row items-center gap-3">
          <View className={cn('h-10 w-10 items-center justify-center rounded-lg bg-muted')}>
            <Text>{template.icon}</Text>
          </View>
          <View className="flex-1 flex-col gap-1">
            <Text
              variant="small"
              className="text-start font-semibold text-foreground"
              numberOfLines={1}>
              {template.name}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text numberOfLines={1} className="text-xs text-muted-foreground">
                {template.prompt}
              </Text>
            </View>
          </View>
        </View>
      </HapticButton>
    );
  });

  useEffect(() => {
    if (templates?.length === 0) {
      const fetchTemplates = async () => {
        await loadTemplates(preferences.language);
      };
      fetchTemplates();
    }
  }, [loadTemplates, preferences.language, templates?.length]);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const snapPoints = useMemo(() => ['65%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const renderItem = useCallback(
    ({ item: template }: { item: Template }) => {
      return <TemplateItem template={template} />;
    },
    [TemplateItem]
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    []
  );

  const handleTemplatePress = useCallback(async (template: Template) => {
    bottomSheetModalRef.current?.close();

    try {
      const response = await generateTemplate(template.id, noteId);

      router.push({
        pathname: '/(main)/template-result',
        params: {
          response: JSON.stringify(response),
          templateName: template.name,
          templateIcon: template.icon,
        },
      });
    } catch (error) {
      console.error('Error generating template:', error);
    }
  }, []);

  const handleMore = useCallback(() => {
    bottomSheetModalRef.current?.close();
    setShowTemplatesModal(true);
  }, []);

  return (
    <>
      <View className="absolute bottom-0 left-0 right-0  w-full rounded-t-xl bg-white px-4 pb-10">
        <View className="flex-row items-center justify-between gap-2 pt-2">
          <Button
            className="rounded-full bg-foreground active:bg-foreground/80"
            onPress={handlePresentModalPress}>
            <Text>AI Templates</Text>
            <Ionicons name="chevron-up-outline" size={20} color={THEME.light.background} />
          </Button>
          <View className="relative flex-1">
            <Input
              placeholder="Chat with AI..."
              editable={false}
              className="rounded-full border border-black/15 bg-muted placeholder:text-foreground/80"
            />
            <Ionicons
              name="mic-outline"
              size={20}
              className="absolute right-3 top-2.5"
              color={THEME.light.mutedForeground}
            />
          </View>
        </View>
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        enableContentPanningGesture={false}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backgroundStyle={{
          backgroundColor: THEME.light.muted,
        }}>
        <BottomSheetFlatList
          data={templates?.slice(0, 9) || []}
          renderItem={renderItem}
          keyExtractor={(item: Template) => item.id}
          showsVerticalScrollIndicator={false}
          style={{ paddingTop: 10 }}
          contentContainerClassName="pb-safe-offset-3 gap-2 px-2"
          ListFooterComponent={() => (
            <HapticButton
              onPress={handleMore}
              className={cn(' rounded-lg bg-background p-3 shadow-sm shadow-black/5 ')}>
              <View className="flex-row items-center gap-3">
                <View className={cn('h-10 w-10 items-center justify-center rounded-lg bg-muted')}>
                  {/* <Text>{template.icon}</Text> */}
                </View>
                <View className="flex-1 flex-col gap-1">
                  <Text
                    variant="small"
                    className="text-start font-semibold text-foreground"
                    numberOfLines={1}>
                    More Templates
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <Text numberOfLines={1} className="text-xs text-muted-foreground">
                      View all templates
                    </Text>
                  </View>
                </View>
              </View>
            </HapticButton>
          )}
        />
      </BottomSheetModal>

      <AllTemplates
        showTemplatesModal={showTemplatesModal}
        setShowTemplatesModal={setShowTemplatesModal}
        handleTemplatePress={handleTemplatePress}
      />
    </>
  );
}
