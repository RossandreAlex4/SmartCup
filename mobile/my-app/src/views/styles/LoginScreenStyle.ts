import { StyleSheet } from 'react-native';
import { scale, verticalScale, scaleFont } from "../../themes/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  themeIcon:{
    width: scale(35),
    height: scale(35),
  },

  title:{
    fontSize: scaleFont(25),
  },

  image:{
    width: scale(100),
    height: verticalScale(120),
  },

  line:{
    height: verticalScale(1),
    marginVertical: verticalScale(20),
    width: "40%",
    alignSelf: "center",
  },

  subtitle:{
    fontSize: scaleFont(15),
    width: "65%",
    justifyContent: "center",
    textAlign: "center",
  },

  login:{
    width: "80%",
    alignItems: 'center',
    borderRadius: scale(12),
    padding: scale(20),
    marginBottom: verticalScale(30)
  },

  titleLogin:{
    fontSize: scaleFont(35),
    marginBottom: verticalScale(10),
    textAlign: "center"
  },

  inputContainer: {
    width: "85%",
    height: verticalScale(55),
    borderRadius: scale(12),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(15),
    marginVertical: verticalScale(15),
  },

  icon: {
    width: scale(22),
    height: scale(22),
  },

  input: {
    flex: 1,
    fontSize: scaleFont(16),
    marginLeft: scale(10),
    marginRight: scale(10) 
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(30)
  },

  checkbox: {
    width: scale(22),
    height: scale(22),
    borderWidth: 2,
    borderRadius: scale(6),
    marginRight: scale(10),
  },

  checkboxActive: {
    backgroundColor: "#0fe159",
  },

  checkboxText: {
    fontSize: scaleFont(16),
  },

  checkboxImage:{
    width: scale(20),
    height: scale(20)
  },

  errorText: {
    width: "85%",
    color: "#ff5252",
    fontSize: scaleFont(14),
    fontWeight: "600",
    textAlign: "center",
    marginTop: verticalScale(-12),
    marginBottom: verticalScale(18),
  },

  forgot:{
    fontSize: scaleFont(14),
    margin: scale(15)
  }
});
