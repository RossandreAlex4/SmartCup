import { useCallback } from "react";
import { BackHandler } from "react-native";
import { useFocusEffect } from "expo-router";

export function useBackHandlerModal(action: () => void) {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        action();
        return true;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => subscription.remove();
    }, [action])
  );
}