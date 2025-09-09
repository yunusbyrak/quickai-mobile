import { KeyboardAvoidingView, Platform, Modal as RNModal, type ModalProps as RNModalProps } from 'react-native';

interface ModalProps extends RNModalProps {
    visible: boolean;
    withInput?: boolean;
}

export default function Modal({ children, visible, withInput = false, ...props }: ModalProps) {

    const content = withInput ? (
        <KeyboardAvoidingView
            className="flex-1 bg-background"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            {children}
        </KeyboardAvoidingView>
    ) : <>{children}</>;

    return (
        <RNModal
            visible={visible}
            transparent={true}
            animationType='fade'
            statusBarTranslucent={true}
            {...props}
        >
            {content}
        </RNModal>
    );
}
