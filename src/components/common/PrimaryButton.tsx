import { Pressable, StyleSheet, Text } from 'react-native';

import { useAppTheme } from '@/src/hooks/useAppTheme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
}

export const PrimaryButton = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}: PrimaryButtonProps) => {
  const theme = useAppTheme();

  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.primary,
      color: '#FFFFFF',
    },
    secondary: {
      backgroundColor: theme.colors.primarySoft,
      color: theme.colors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.text,
    },
    danger: {
      backgroundColor: theme.colors.danger,
      color: '#FFFFFF',
    },
  }[variant];

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variant === 'ghost' ? theme.colors.border : 'transparent',
          opacity: disabled ? 0.5 : 1,
        },
      ]}>
      <Text style={[styles.label, { color: variantStyles.color }]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderWidth: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
});
