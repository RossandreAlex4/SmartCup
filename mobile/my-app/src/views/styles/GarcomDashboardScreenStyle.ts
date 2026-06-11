import { StyleSheet } from "react-native";
import { scale, verticalScale, scaleFont } from "../../themes/responsive";

export const styles = StyleSheet.create({

  container: {
      flex: 1,
      alignItems: "center",
    },
  
    titleConfig: {
      marginTop: verticalScale(20),
      width: "100%",
      alignItems: "center",
    },
  
    title: {
      fontSize: scaleFont(22),
      fontWeight: "700",
    },
  
    subtitle: {
      marginTop: verticalScale(6),
      fontSize: scaleFont(15),
    },
  
    headerActions: {
      position: "absolute",
      top: verticalScale(20),
      right: scale(20),
      flexDirection: "row",
      gap: scale(12),
      alignItems: "center",
    },
  
    themeButton: {
      justifyContent: "center",
      alignItems: "center",
    },
  
    logoutButton: {
      padding: scale(8),
      borderRadius: scale(10),
      borderWidth: 1,
    },
  
    line: {
      height: verticalScale(1),
      width: "50%",
      marginVertical: verticalScale(18),
      borderRadius: scale(100),
    },
  
    statsContainer: {
      width: "92%",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: verticalScale(20),
      gap: scale(8),
    },
  
    statsCard: {
      flex: 1,
      minHeight: verticalScale(80),
      borderRadius: scale(16),
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      padding: scale(6),
    },
  
    value: {
      fontSize: scaleFont(18),
      fontWeight: "700",
    },
  
    label: {
      marginTop: verticalScale(4),
      fontSize: scaleFont(11),
      textAlign: "center",
    },
  
    overview: {
      width: "90%",
      fontSize: scaleFont(16),
      marginBottom: verticalScale(15),
    },
  
    alertCard: {
      width: "100%",
      borderWidth: 1,
      borderRadius: scale(14),
      padding: scale(16),
      marginBottom: verticalScale(10),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  
    alertLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: scale(12),
      flex: 1,
    },
  
    alertDot: {
      width: scale(10),
      height: scale(10),
      borderRadius: scale(5),
    },
  
    alertTitle: {
      fontSize: scaleFont(15),
      fontWeight: "600",
    },
  
    alertSub: {
      fontSize: scaleFont(13),
      marginTop: verticalScale(2),
    },
  
    emptyContainer: {
      alignItems: "center",
      marginTop: verticalScale(50),
    },
  
    emptyText: {
      marginTop: verticalScale(10),
      fontSize: scaleFont(16),
    },
  
});