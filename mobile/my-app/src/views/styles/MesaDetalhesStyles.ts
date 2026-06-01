import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 26,
    marginRight: 15,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  badgeAlerta: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeAlertaText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 14,
    borderRadius: 12,
    marginBottom: 25,
  },
  metaText: {
    fontSize: 14,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    paddingLeft: 4,
  },
  scrollList: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  cupCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.05)",
  },
  cupHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cupTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  cupName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cupPercentage: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subLabel: {
    fontSize: 11,
    color: "#7d7d7d",
    marginLeft: 24,
    marginBottom: 12,
  },
  detailItem: {
    marginLeft: 24,
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
  },
  alertBarButton: {
    backgroundColor: "rgba(255,152,0,0.12)",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 0.5,
    borderColor: "rgba(255,152,0,0.2)",
  },
  alertBarLow: {
    backgroundColor: "rgba(255,82,82,0.12)",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 0.5,
    borderColor: "rgba(255,82,82,0.2)",
  },
  alertBarText: {
    color: "#ff5252",
    fontSize: 13,
    fontWeight: "500",
  },
  alertBarTime: {
    color: "#7d7d7d",
    fontSize: 12,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 14,
  },
  btnAtender: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#0fce52",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  btnAtenderText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
  iconImage: {
    width: 20,
    height: 20,
    margin: 0,
    
  },
});