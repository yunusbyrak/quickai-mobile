import React from 'react';
import { View } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type ProcessingStep = {
  id: string;
  title: string;
  status: 'completed' | 'processing' | 'pending';
};

interface ProcessingStatusProps {
  steps: ProcessingStep[];
  message?: string;
}

const StatusIcon = ({ status }: { status: ProcessingStep['status'] }) => {
  switch (status) {
    case 'completed':
      return (
        <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center">
          <Ionicons name="checkmark" size={16} color="white" />
        </View>
      );
    case 'processing':
      return (
        <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center">
          <MaterialIcons name="refresh" size={16} color="white" />
        </View>
      );
    case 'pending':
      return (
        <View className="w-6 h-6 bg-gray-300 rounded-full items-center justify-center">
          <View className="w-2 h-2 bg-gray-500 rounded-full" />
        </View>
      );
  }
};

export const ProcessingStatus = React.memo(({ steps, message }: ProcessingStatusProps) => {
  return (
    <View className="bg-gray-100 rounded-2xl p-4">
      {message && (
        <Text className="text-sm text-gray-600 mb-4 text-center">
          {message}
        </Text>
      )}

      <View className="gap-2">
        {steps.map((step) => (
          <View key={step.id} className="flex-row items-center gap-3">
            <StatusIcon status={step.status} />
            <Text className={cn(
              "flex-1 text-base",
              step.status === 'completed' ? "text-gray-900 font-medium" :
              step.status === 'processing' ? "text-blue-600 font-medium" :
              "text-gray-500"
            )}>
              {step.title}
            </Text>
            {step.status === 'processing' && (
              <MaterialIcons name="refresh" size={20} color="#3B82F6" />
            )}
          </View>
        ))}
      </View>
    </View>
  );
});

ProcessingStatus.displayName = 'ProcessingStatus';
