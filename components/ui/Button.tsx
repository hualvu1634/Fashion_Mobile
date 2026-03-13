import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import Colors from '../../constants/colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  fullWidth = false,
  style,
  ...rest
}) => {
  const getButtonStyle = (): StyleProp<ViewStyle> => {
    const base: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 24,
      flexDirection: 'row',
    };

    const variantStyle: { [key: string]: ViewStyle } = {
      primary: { backgroundColor: Colors.primary },
      secondary: { backgroundColor: Colors.secondary },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.primary,
      },
      text: { backgroundColor: 'transparent' },
    };

    const disabledStyle: ViewStyle = loading
      ? { backgroundColor: Colors.gray[300] }
      : {};

    return [
      base,
      variantStyle[variant],
      disabledStyle,
      fullWidth ? { width: '100%' } : {},
      style,
    ];
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    const variantText: { [key: string]: TextStyle } = {
      primary: { color: Colors.white },
      secondary: { color: Colors.white },
      outline: { color: Colors.primary },
      text: { color: Colors.primary },
    };

    const disabledText: TextStyle = loading ? { color: Colors.gray[500] } : {};

    return [
      { fontWeight: '600' as TextStyle['fontWeight'], fontSize: 16 },
      variantText[variant],
      disabledText,
    ];
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={getButtonStyle()}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? Colors.primary : Colors.white}
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
const styles = StyleSheet.create({ button: { backgroundColor: Colors.primary, borderRadius: 8, padding: 12 },
  text: { color: Colors.white, fontWeight: '600', fontSize: 16 },});


