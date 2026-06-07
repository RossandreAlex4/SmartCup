import { StyleSheet } from 'react-native';
import { scale, verticalScale, scaleFont, isLargeScreen } from "../../themes/responsive";

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

  createContainer:{
    width: "90%",
    marginTop: verticalScale(4)
  },

  overview:{
    fontSize: scaleFont(15),
    width: "85%",
    marginTop: verticalScale(4)    
  },

  statsContainer: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: verticalScale(10),
    gap: scale(8),
  },
  
  statsCard: {
    width: isLargeScreen ? "23%" : "48%",
    minHeight: verticalScale(80),
    borderRadius: scale(16),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    padding: scale(6),
  },
  
  value: {
    fontSize: scaleFont(22),
    fontWeight: "bold",
  },
  
  label: {
    fontSize: scaleFont(11),
    marginTop: verticalScale(4),
    textAlign: "center",
  },

  cardsContainer: {
    width: "95%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    margin: scale(20),
  },

  card: {
    width: isLargeScreen ? "22%" : "47%",
    minHeight: verticalScale(180),
    borderRadius: scale(20),
    marginBottom: verticalScale(10),
    padding: scale(20),
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: scaleFont(16),
    textAlign: "center",
  },

  cardStatus: {
    fontSize: scaleFont(14),
    marginTop: verticalScale(10),
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
