import { StyleSheet } from 'react-native';
import { scale, verticalScale, scaleFont } from "../../themes/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    position: "relative",
  },

  themeIcon:{
    width: scale(29),
    height: scale(29),
  },

  titleConfig:{
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(19),
    width: '100%',
    minHeight: verticalScale(44),
    paddingHorizontal: scale(16),
  },

  backButton: {
    width: scale(44),
    height: verticalScale(44),
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },

  title:{
    fontSize: scaleFont(20),
    flex: 1,
    textAlign: "center",
  },

  titleSpacer: {
    width: scale(44),
    height: verticalScale(44),
  },

  image:{
    width: scale(20),
    height: scale(20),
  },

  line:{
    height: verticalScale(1),
    marginVertical: verticalScale(20),
    width: "50%",
    alignSelf: "center",
    borderRadius: scale(100),
  },

  createContainer:{
    width: "90%",
    marginTop: verticalScale(4)
  },

  createName:{
    fontSize: scaleFont(15),
    width: "65%",
  },

  input: {
    fontSize: scaleFont(16),
    width: "100%"
  },

  inputContainer: {
    width: "100%",
    height: verticalScale(55),
    borderRadius: scale(12),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(15),
    marginVertical: verticalScale(15),
  },

  errorText: {
    color: "#ff5252",
    fontSize: scaleFont(14),
    fontWeight: "600",
    marginTop: verticalScale(-8),
    marginBottom: verticalScale(12),
  },

  cardsContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },

  card: {
    width: "42%",
    minHeight: verticalScale(180),
    borderRadius: scale(20),
    marginBottom: verticalScale(20),
    padding: scale(20),
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: scaleFont(16),
    textAlign: "center",
  },

  value: {
    fontSize: scaleFont(35),
    fontWeight: "bold",
  },

  buttonsContainer: {
    flexDirection: "row",
    gap: scale(15),
  },

  button: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontSize: scaleFont(24),
    fontWeight: "bold",
  },
});
