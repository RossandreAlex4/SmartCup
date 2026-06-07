import { StyleSheet } from 'react-native';
import { scale, verticalScale, scaleFont } from "../../themes/responsive";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  themeIcon:{
    width: scale(29),
    height: scale(29),
  },
  
  titleConfig: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(19),
    position: "relative",
  },

  backButton: {
    position: "absolute",
    left: scale(20),
  },

  backImage: {
    width: scale(20),
    height: scale(20),
    resizeMode: "contain",
  },

  title: {
    fontSize: scaleFont(22),
  },

  line:{
    height: verticalScale(1),
    marginVertical: verticalScale(10),
    width: "50%",
    alignSelf: "center",
    borderRadius: scale(100),
  },

  listContent: {
    padding: scale(16),
    paddingBottom: verticalScale(30),
  },

  card: {
    borderRadius: scale(14),
    padding: scale(16),
    marginBottom: verticalScale(10),
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },

  indexCircle: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(14),
  },

  indexText: {
    fontWeight: "700",
    fontSize: scaleFont(13),
  },

  cardTextContainer: {
    flex: 1,
  },

  cardTitle: {
    fontSize: scaleFont(15),
    fontWeight: "600",
    textTransform:
      "capitalize",
  },

  cardSubtitle: {
    fontSize: scaleFont(13),
    marginTop: verticalScale(2),
  },

  checkButton: {
    padding: scale(4),
  },
});