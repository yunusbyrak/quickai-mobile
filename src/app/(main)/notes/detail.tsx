import { HapticButton, NoteCard, NoteDetailCard } from '@/components';
import { Text } from '@/components/ui/text';
import { useNotes } from '@/hooks/useNotes';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image, View, Alert, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ContextMenu, type ContextMenuAction } from '@/components/ui/context-menu';
import { useState } from 'react';
import Markdown from '@/components/Markdown';
import { dateFormat } from '@/utils/functions';

import NoteDetailYoutube from '@/screens/note-detail/youtube-detail';
import NoteDetailAudio from '@/screens/note-detail/audio-detail';
import NoteDetailPdf from '@/screens/note-detail/pdf-detail';
import NoteDetailText from '@/screens/note-detail/text-detail';
import NoteDetailImage from '@/screens/note-detail/image-detail';
import NoteBottom from '@/components/NoteBottom';

export default function NoteDetail() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark } = useTheme();
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const { getNoteById, deleteNote, updateNoteFavorite } = useNotes();
  const note = getNoteById(noteId as string);

  if (!note) {
    return <Text>Note not found</Text>;
  }

  // Context menu actions for the note
  const actions: ContextMenuAction[] = [
    {
      id: 'edit',
      title: 'Edit Note',
      systemIcon: 'pencil',
    },
    {
      id: 'favorite',
      title: note.favorite ? 'Remove from Favorites' : 'Add to Favorites',
      systemIcon: note.favorite ? 'heart.fill' : 'heart',
    },
    {
      id: 'share',
      title: 'Share',
      systemIcon: 'square.and.arrow.up',
    },
    {
      id: 'delete',
      title: 'Delete',
      systemIcon: 'trash',
      destructive: true,
    },
  ];

  const onContextMenuActionPress = async (actionId: string, action: ContextMenuAction) => {
    switch (actionId) {
      case 'edit':
        // TODO: Implement note edit screen
        console.log('Edit note:', note.title);
        break;
      case 'favorite':
        try {
          await updateNoteFavorite(noteId as string, !note.favorite);
        } catch (error) {
          console.error('Failed to update favorite status:', error);
        }
        break;
      case 'share':
        // TODO: Implement share functionality
        console.log('Share note:', note.title);
        break;
      case 'delete':
        Alert.alert(
          'Delete Note',
          'Are you sure you want to delete this note? This action cannot be undone.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                try {
                  await deleteNote(noteId as string);
                  router.back();
                } catch (error) {
                  console.error('Failed to delete note:', error);
                }
              },
            },
          ],
          { cancelable: true }
        );
        break;
    }
  };

  // console.log(note);

  return (
    <>
      <Stack.Screen
        options={{
          headerBackButtonDisplayMode: 'minimal',
          title: '',
          headerTransparent: true,
          headerShown: true,
          headerTintColor: isDark ? 'white' : 'black',
          headerRight: () => (
            <>
              <View className="flex-row items-center gap-4">
                <HapticButton
                  hapticType="medium"
                  className="items-center justify-center rounded-full"
                  accessibilityRole="button"
                  accessibilityLabel="Note options">
                  <Ionicons name="share-outline" size={26} color={isDark ? 'white' : 'black'} />
                </HapticButton>

                <ContextMenu
                  dropdownMenuMode
                  previewBackgroundColor="transparent"
                  actions={actions}
                  onActionPress={onContextMenuActionPress}>
                  <HapticButton
                    hapticType="medium"
                    className="items-center justify-center rounded-full"
                    accessibilityRole="button"
                    accessibilityLabel="Note options">
                    <Ionicons
                      name="ellipsis-horizontal-circle"
                      size={26}
                      color={isDark ? 'white' : 'black'}
                    />
                  </HapticButton>
                </ContextMenu>
              </View>
            </>
          ),
        }}
      />
      <View
        className="flex-1 gap-2 bg-muted"
        style={{
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 16),
        }}>
        {/* Centered title */}
        <View className="px-4 pt-10">
          <Text variant="h3" className="font-medium text-foreground">
            {note.title || 'Untitled Note'}
          </Text>
        </View>

        {/* Content Area */}
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {note.type === 'youtube' && <NoteDetailYoutube note={note} />}
          {note.type === 'audio' && <NoteDetailAudio note={note} />}
          {note.type === 'pdf' && <NoteDetailPdf note={note} />}
          {note.type === 'text' && <NoteDetailText note={note} />}
          {note.type === 'image' && <NoteDetailImage note={note} />}
          {/* <NoteDetailCard
                        title="Summary"
                        defaultCollapsed={false}
                        onViewMore={() => router.push(`/(main)/notes/summary?slug=test&noteId=${noteId}`)}
                    >
                        <View className="px-4 pb-4">
                            <Markdown>{note.summary}</Markdown>
                        </View>
                    </NoteDetailCard> */}
        </ScrollView>

        <Text className="text-center text-xs text-foreground/50">
          {dateFormat(note.created_at || '', 'short')}
        </Text>
      </View>
      <NoteBottom noteId={noteId} />
    </>
  );
}
