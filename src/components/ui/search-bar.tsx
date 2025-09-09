import React, { forwardRef } from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const searchBarVariants = cva(
  'flex-row items-center bg-background border border-border rounded-full px-3 py-3 gap-3',
  {
    variants: {
      size: {
        default: 'py-3',
        sm: 'py-2',
        lg: 'py-4'
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
)

export interface SearchBarProps extends VariantProps<typeof searchBarVariants> {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  onClear?: () => void
  showClearButton?: boolean
  className?: string
  inputClassName?: string
  iconColor?: string
  placeholderTextColor?: string
  autoFocus?: boolean
  returnKeyType?: 'search' | 'done' | 'go' | 'next' | 'send'
  onSubmitEditing?: () => void
}

export const SearchBar = forwardRef<TextInput, SearchBarProps>(
  (
    {
      value,
      onChangeText,
      placeholder = 'Search...',
      onClear,
      showClearButton = true,
      className,
      inputClassName,
      iconColor = '#9CA3AF',
      placeholderTextColor = '#9CA3AF',
      autoFocus = false,
      returnKeyType = 'search',
      onSubmitEditing,
      size,
      ...props
    },
    ref
  ) => {
    const handleClear = () => {
      onChangeText('')
      onClear?.()
    }

    return (
      <View className={cn(searchBarVariants({ size }), className)}>
        <Ionicons name="search" size={20} color={iconColor} />
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          className={cn('flex-1 text-foreground', inputClassName)}
          placeholderTextColor={placeholderTextColor}
          autoFocus={autoFocus}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="never" // We handle clear button ourselves
          {...props}
        />
        {showClearButton && value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            className="w-6 h-6 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={18} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>
    )
  }
)

SearchBar.displayName = 'SearchBar'
