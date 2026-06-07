import { Dimensions, PixelRatio, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const isLargeScreen = Platform.OS === "web" || SCREEN_WIDTH >= 768;

export const scale = (size: number): number => {
  if (isLargeScreen) {
    return PixelRatio.roundToNearestPixel(size);
  }
  const widthScale = SCREEN_WIDTH / BASE_WIDTH;
  const moderatedFactor = 1 + (widthScale - 1) * 0.5;
  return PixelRatio.roundToNearestPixel(size * moderatedFactor);
};

export const verticalScale = (size: number): number => {
  if (isLargeScreen) {
    return PixelRatio.roundToNearestPixel(size);
  }
  const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;
  const moderatedFactor = 1 + (heightScale - 1) * 0.5;
  return PixelRatio.roundToNearestPixel(size * moderatedFactor);
};

export const moderateScale = (size: number, factor: number = 0.5): number => {
  if (isLargeScreen) {
    return PixelRatio.roundToNearestPixel(size);
  }
  return PixelRatio.roundToNearestPixel(size + (scale(size) - size) * factor);
};

export const moderateVerticalScale = (size: number, factor: number = 0.5): number => {
  if (isLargeScreen) {
    return PixelRatio.roundToNearestPixel(size);
  }
  return PixelRatio.roundToNearestPixel(size + (verticalScale(size) - size) * factor);
};

export const scaleFont = (size: number): number => {
  if (isLargeScreen) {
    return PixelRatio.roundToNearestPixel(size);
  }
  const fontScale = PixelRatio.getFontScale();
  const widthScale = SCREEN_WIDTH / BASE_WIDTH;
  
  let moderatedFactor = 1 + (widthScale - 1) * 0.5;
  
  if (widthScale < 1) {
    if (size >= 24) {
      moderatedFactor = 1 + (widthScale - 1) * 0.85;
    } else if (size >= 16) {
      moderatedFactor = 1 + (widthScale - 1) * 0.7;
    }
  }
  
  const scaledSize = size * moderatedFactor;
  return PixelRatio.roundToNearestPixel(scaledSize * Math.min(fontScale, 1.15));
};
