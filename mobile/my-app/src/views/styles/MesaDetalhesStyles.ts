import { StyleSheet } from "react-native";
import { scale, verticalScale, scaleFont } from "../../themes/responsive";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(20),
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
    marginTop: verticalScale(10),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backArrow: {
    fontSize: scaleFont(26),
    marginRight: scale(15),
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: scaleFont(22),
    fontWeight: "bold",
  },
  badgeAlerta: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: scale(12),
  },
  badgeAlertaText: {
    fontSize: scaleFont(12),
    fontWeight: "bold",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: scale(14),
    borderRadius: scale(12),
    marginBottom: verticalScale(25),
  },
  metaText: {
    fontSize: scaleFont(14),
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: "600",
    marginBottom: verticalScale(15),
    paddingLeft: scale(4),
  },
  scrollList: {
    flexGrow: 1,
    paddingBottom: verticalScale(100),
  },
  cupCard: {
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: verticalScale(16),
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.05)",
  },
  cupHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(4),
  },
  cupTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: scale(14),
    height: scale(14),
    borderRadius: scale(7),
    marginRight: scale(10),
  },
  cupName: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
  },
  cupPercentage: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
  },
  subLabel: {
    fontSize: scaleFont(11),
    color: "#7d7d7d",
    marginLeft: scale(24),
    marginBottom: verticalScale(12),
  },
  detailItem: {
    marginLeft: scale(24),
    marginBottom: verticalScale(6),
  },
  detailText: {
    fontSize: scaleFont(13),
  },
  alertBarButton: {
    backgroundColor: "rgba(255,152,0,0.12)",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: scale(10),
    borderRadius: scale(8),
    marginTop: verticalScale(12),
    borderWidth: 0.5,
    borderColor: "rgba(255,152,0,0.2)",
  },
  alertBarLow: {
    backgroundColor: "rgba(255,82,82,0.12)",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: scale(10),
    borderRadius: scale(8),
    marginTop: verticalScale(12),
    borderWidth: 0.5,
    borderColor: "rgba(255,82,82,0.2)",
  },
  alertBarText: {
    color: "#ff5252",
    fontSize: scaleFont(13),
    fontWeight: "500",
  },
  alertBarTime: {
    color: "#7d7d7d",
    fontSize: scaleFont(12),
  },
  emptyText: {
    textAlign: "center",
    marginTop: verticalScale(30),
    fontSize: scaleFont(14),
  },
  btnAtender: {
    position: "absolute",
    bottom: verticalScale(20),
    left: scale(16),
    right: scale(16),
    backgroundColor: "#0fce52",
    padding: scale(16),
    borderRadius: scale(14),
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: scale(5),
  },
  btnAtenderText: {
    color: "#ffffff",
    fontSize: scaleFont(15),
    fontWeight: "bold",
  },
  iconImage: {
    width: scale(20),
    height: scale(20),
    margin: 0,
  },
});