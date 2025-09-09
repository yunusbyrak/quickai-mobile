import { useState, useCallback } from "react";
import { View, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Text } from "@/components/ui/text";
import { useFolders } from "@/hooks/useFolders";
import { useTranslation } from "@/hooks/useTranslation";
import type { CreateFolderInput } from "@/types/folder";

interface FormData {
    title: string;
    description: string;
}

interface FormErrors {
    title?: string;
    description?: string;
}

export default function FolderCreate() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { createFolder } = useFolders();

    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: ""
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        // Title validation
        if (!formData.title.trim()) {
            newErrors.title = t("folder.titleRequired");
        } else if (formData.title.trim().length < 2) {
            newErrors.title = t("folder.titleTooShort");
        } else if (formData.title.trim().length > 50) {
            newErrors.title = t("folder.titleTooLong");
        }

        // Description validation (optional but if provided, should be reasonable length)
        if (formData.description.trim().length > 200) {
            newErrors.description = t("folder.descriptionTooLong");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, t]);

    const handleInputChange = useCallback((field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    }, [errors]);

    const handleSubmit = useCallback(async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const folderInput: CreateFolderInput = {
                title: formData.title.trim(),
                description: formData.description.trim() || undefined
            };

            await createFolder(folderInput);

            // Navigate back on success
            router.back();
        } catch (error) {
            console.error("Failed to create folder:", error);
            Alert.alert(
                t("common.error"),
                t("folder.createError")
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, validateForm, createFolder, t]);

    const handleCancel = useCallback(() => {
        router.back();
    }, []);

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-background"
            style={{
                paddingBottom: insets.bottom + 16
            }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View className="px-6 pt-8 items-center">
                    <Text className="text-2xl font-bold text-foreground">
                        {t("folder.createNew")}
                    </Text>
                    <Text className="text-muted-foreground mt-1">
                        {t("folder.createDescription")}
                    </Text>
                </View>

                {/* Form */}
                <View className="px-6 pt-6 gap-4">
                    {/* Title Input */}
                    <View className="gap-2">
                        <Text className="text-base font-medium text-foreground">
                            {t("folder.title")}
                        </Text>
                        <Input
                            value={formData.title}
                            onChangeText={(value) => handleInputChange("title", value)}
                            placeholder={t("folder.titlePlaceholder")}
                            maxLength={50}
                            autoFocus
                            returnKeyType="next"
                            className={errors.title ? "border-destructive" : ""}
                        />
                        {errors.title && (
                            <Text className="text-sm text-destructive">
                                {errors.title}
                            </Text>
                        )}
                    </View>

                    {/* Description Input */}
                    <View className="gap-2">
                        <Text className="text-base font-medium text-foreground">
                            {t("folder.description")}
                        </Text>
                        <Textarea
                            value={formData.description}
                            onChangeText={(value) => handleInputChange("description", value)}
                            placeholder={t("folder.descriptionPlaceholder")}
                            maxLength={200}
                            numberOfLines={3}
                            className={errors.description ? "border-destructive" : ""}
                        />
                        {errors.description && (
                            <Text className="text-sm text-destructive">
                                {errors.description}
                            </Text>
                        )}
                        <Text className="text-xs text-muted-foreground">
                            {formData.description.length}/200 {t("common.characters")}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View
                className="px-6 pt-4 border-t border-border bg-background"
                style={{ paddingBottom: insets.bottom + 16 }}
            >
                <View className="flex-row gap-3">
                    <Button
                        variant="outline"
                        onPress={handleCancel}
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        <Text>{t("common.cancel")}</Text>
                    </Button>
                    <Button
                        onPress={handleSubmit}
                        disabled={isSubmitting || !formData.title.trim()}
                        className="flex-1"
                    >
                        <Text>
                            {isSubmitting ? t("common.creating") : t("common.create")}
                        </Text>
                    </Button>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
