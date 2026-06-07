import { StyleSheet } from 'react-native';
import { scale, verticalScale, scaleFont } from "../../themes/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  themeIcon:{
    width: scale(29),
    height: scale(29),
  },
  
  titleConfig:{
    alignItems: "center",
    marginTop: verticalScale(19),
    width: '100%',
    justifyContent: "center"
  },

  backButton: {
    position: "absolute",
    left: scale(20),
  },

  title:{
    fontSize: scaleFont(20),
  },

  subtitle:{
    fontSize: scaleFont(15),
    width: "65%",
    justifyContent: "center",
    textAlign: "center",
    marginTop: verticalScale(5)
  },

  image:{
    width: scale(20),
    height: scale(20),
  },

  line:{
    height: verticalScale(1),
    marginVertical: verticalScale(10),
    width: "50%",
    alignSelf: "center",
    borderRadius: scale(100),
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
    marginTop: verticalScale(15),
  },

  createContainer:{
    width: "90%",
  },

  cardsContainer: {
    width: "95%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    margin: scale(20),
  },

  card: {
    width: "90%",
    minHeight: verticalScale(100),
    borderRadius: scale(20),
    marginBottom: verticalScale(10),
    padding: scale(20),
    justifyContent: "space-evenly",
  },

  cardTitle: {
    color: "white",
    fontSize: scaleFont(16),
  },

  cardEdit:{
    width: scale(20),
    height: scale(20),
    alignSelf: "flex-end"
  },

  cardStatusLine:{
    flexDirection: "row",
    gap: scale(20),
    marginTop: verticalScale(10)
  },

  cardStatus: {
    fontSize: scaleFont(14),
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
