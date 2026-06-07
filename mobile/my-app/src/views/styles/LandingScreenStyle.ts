import { StyleSheet } from "react-native";
import { scale, verticalScale, scaleFont } from "../../themes/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  themeIcon:{
    width: scale(35),
    height: scale(35),
  },

  title:{
    fontSize: scaleFont(45)
  },

  image:{
    width: scale(300),
    height: verticalScale(200),
  },

  line:{
    height: verticalScale(1),
    marginVertical: verticalScale(20),
    width: "40%",
    alignSelf: "center",
    borderRadius: scale(100),
  },

  subtitle:{
    fontSize: scaleFont(20),
    width: "65%",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: verticalScale(10)
  }
});
