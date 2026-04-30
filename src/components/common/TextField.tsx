import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { useAppTheme } from '@/src/hooks/useAppTheme';
import { useScreenScrollToFocusedInput } from '@/src/components/common/ScreenContainer';

interface TextFieldProps extends TextInputProps {
  label: string;
  hint?: string;
}

export const TextField = ({ label, hint, style, onFocus, ...props }: TextFieldProps) => {
  const theme = useAppTheme();
  const scrollToFocusedInput = useScreenScrollToFocusedInput();

  const handleFocus: NonNullable<TextInputProps['onFocus']> = (event) => {
    scrollToFocusedInput?.(typeof event.target === 'number' ? event.target : null);
    onFocus?.(event);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <TextInput
        onFocus={handleFocus}
        placeholderTextColor={theme.colors.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          },
          style,
        ]}
        {...props}
      />
      {hint ? <Text style={[styles.hint, { color: theme.colors.textMuted }]}>{hint}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  hint: {
    fontSize: 12,
  },
});
