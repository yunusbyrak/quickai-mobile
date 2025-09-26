import { FlatList, Modal, Pressable, View } from 'react-native';
import { Text } from './ui/text';
import { THEME } from '@/lib/theme';
import { useCallback, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTemplates } from '@/hooks';
import { Template, TemplateGroup } from '@/types/template';
import { HapticButton } from './ui/haptic-button';
import { cn } from '@/lib/utils';

interface AllTemplatesProps {
  showTemplatesModal: boolean;
  setShowTemplatesModal: (show: boolean) => void;
  handleTemplatePress: (template: Template) => Promise<void>;
}

export default function AllTemplates({
  showTemplatesModal,
  setShowTemplatesModal,
  handleTemplatePress,
}: AllTemplatesProps) {
  const { templateGroups: templateG, templates } = useTemplates();
  const [selectedGroup, setSelectedGroup] = useState<string | null>('all');
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(templates);
  const [templateGroups, setTemplateGroups] = useState<TemplateGroup[]>([]);

  const mergeTemplateGroups = useCallback(() => {
    setTemplateGroups([
      {
        id: 'all',
        name: 'All',
        slug: 'all',
        color: null,
        icon: null,
        language: null,
      },
      ...templateG,
    ]);
  }, []);

  useEffect(() => {
    mergeTemplateGroups();
  }, []);

  const handleGroupPress = useCallback((groupId: string) => {
    setSelectedGroup(groupId);
    if (groupId === 'all') {
      setFilteredTemplates(templates);
    } else {
      setFilteredTemplates(templates.filter((template) => template.group_id === groupId));
    }
  }, []);

  const renderGroupItem = useCallback(
    ({ item: group }: { item: TemplateGroup }) => {
      return (
        <HapticButton onPress={() => handleGroupPress(group.id)}>
          <View
            className={cn(
              'items-center justify-center rounded-md bg-muted p-2 px-4',
              selectedGroup === group.id && 'bg-foreground'
            )}>
            <Text variant="medium" className={cn(selectedGroup === group.id && 'text-background')}>
              {group.name}
            </Text>
          </View>
        </HapticButton>
      );
    },
    [selectedGroup]
  );

  const renderTemplateItem = useCallback(({ item: template }: { item: Template }) => {
    return (
      <Pressable
        className="w-1/2 px-1"
        onPress={() => {
          setShowTemplatesModal(false);
          handleTemplatePress(template);
        }}>
        <View className="w-full justify-center gap-2 rounded-md bg-muted p-2 pb-4">
          <View className="flex-row gap-2">
            <View className="items-center justify-center">
              <Text variant="medium">{template.icon}</Text>
            </View>
          </View>
          <Text variant="medium">{template.name}</Text>
          <Text numberOfLines={2} variant="small">
            {template.prompt}
          </Text>
        </View>
      </Pressable>
    );
  }, []);

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={showTemplatesModal}
      onRequestClose={() => setShowTemplatesModal(false)}>
      <View className="pb-safe-offset-4 flex-1 gap-2 bg-background p-4">
        <View className="flex-row items-center gap-2">
          <Ionicons name="chevron-back" size={24} color={THEME.light.ring} />
          <Text variant="h3">Choose a Template</Text>
        </View>
        <View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={templateGroups}
            contentContainerClassName="gap-2"
            renderItem={renderGroupItem}
            keyExtractor={(item) => item.id}
            className="grow-0"
          />
        </View>
        <View className="flex-1">
          <FlatList
            data={filteredTemplates}
            contentContainerClassName="gap-2"
            numColumns={2}
            renderItem={renderTemplateItem}
            keyExtractor={(item) => item.id}
            className="grow-0"
          />
        </View>
      </View>
    </Modal>
  );
}
