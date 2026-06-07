import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  DimensionValue,
  ViewStyle,
  StyleProp,
} from "react-native";
import { scale, verticalScale, scaleFont } from "../../themes/responsive";

type CustomButtonProps = {
  title?: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  width?: DimensionValue;
  height?: number;
  fontSize?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export default function CustomButton({
  title = "Button",
  onPress,
  backgroundColor = "#00C853",
  textColor = "#fff",
  width = "80%",
  height = 55,
  fontSize = 18,
  borderRadius = 12,
  style,
  disabled = false,
}: CustomButtonProps) {
  const scaledWidth = typeof width === "number" ? scale(width) : width;
  const scaledHeight = verticalScale(height);
  const scaledBorderRadius = scale(borderRadius);
  const scaledFontSize = scaleFont(fontSize);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          width: scaledWidth,
          height: scaledHeight,
          borderRadius: scaledBorderRadius,
        },
        style,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text
        style={[
          styles.buttonText,
          {
            color: textColor,
            fontSize: scaledFontSize,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  buttonText: {
    fontWeight: "bold",
  },

  disabled: {
    opacity: 0.7,
  },
});
