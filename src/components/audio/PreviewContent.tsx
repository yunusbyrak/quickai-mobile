import React from 'react';
import { View } from 'react-native';

export const PreviewContent = React.memo(() => {
  return (
    <View className="bg-card rounded-2xl p-4 border border-border min-h-[200px]">
      {/* Placeholder content blocks */}
      <View className="space-y-3">
        <View className="h-4 bg-gray-200 rounded-lg w-full" />
        <View className="flex-row gap-2">
          <View className="h-16 w-20 bg-gray-200 rounded-lg" />
          <View className="flex-1 space-y-2">
            <View className="h-3 bg-gray-200 rounded w-3/4" />
            <View className="h-3 bg-gray-200 rounded w-full" />
            <View className="h-3 bg-gray-200 rounded w-1/2" />
            <View className="h-3 bg-gray-200 rounded w-5/6" />
          </View>
          <View className="w-8 h-8 bg-gray-300 rounded-full" />
        </View>
        <View className="h-3 bg-gray-200 rounded w-full" />
        <View className="h-3 bg-gray-200 rounded w-4/5" />
        <View className="h-3 bg-gray-200 rounded w-3/5" />
        <View className="h-3 bg-gray-200 rounded w-full" />
        <View className="h-3 bg-gray-200 rounded w-2/3" />
      </View>
    </View>
  );
});

PreviewContent.displayName = 'PreviewContent';
