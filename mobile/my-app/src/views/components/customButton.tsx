import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  DimensionValue,
  ViewStyle,
  StyleProp,
} from "react-native";

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
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          width,
          height,
          borderRadius,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.buttonText,
          {
            color: textColor,
            fontSize,
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
});