import { StyleSheet } from "react-native";
import { scale, verticalScale, scaleFont } from "../../themes/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },

  themeIcon:{
    width: scale(29),
    height: scale(29),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(20),
    position: "relative",
  },
  
  backButton: {
    position: "absolute",
    left: 0,
  },
  
  backIcon: {
    width: scale(20),
    height: scale(20),
  },
  
  title: {
    fontSize: scaleFont(20),
    fontWeight: "600",
  },
  
  divider: {
    height: verticalScale(1),
    marginVertical: verticalScale(14),
    width: "50%",
    alignSelf: "center",
    borderRadius: scale(100),
  },
  
  addContainer: {
    marginBottom: verticalScale(20),
  },
  
  sectionTitle: {
    fontSize: scaleFont(13),
    marginBottom: verticalScale(10),
    textTransform: "uppercase",
    letterSpacing: scale(1),
  },
  
  inputRow: {
    flexDirection: "row",
    gap: scale(10),
  },
  
  input: {
    flex: 1,
    borderRadius: scale(10),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
    fontSize: scaleFont(15),
    borderWidth: 1,
  },
  
  addButton: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(10),
    justifyContent: "center",
    alignItems: "center",
  },
  
  addButtonText: {
    fontSize: scaleFont(24),
    fontWeight: "bold",
  },
  
  list: {
    flex: 1,
    marginTop: verticalScale(4),
  },
  
  emptyText: {
    color: "#555",
    fontSize: scaleFont(15),
    textAlign: "center",
    marginTop: verticalScale(40),
  },
  
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: scale(14),
    padding: scale(16),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: "#2e2e2e",
  },
  
  cardInfo: {
    marginBottom: verticalScale(12),
  },
  
  cardName: {
    color: "white",
    fontSize: scaleFont(16),
    fontWeight: "600",
  },
  
  cardDate: {
    color: "#666",
    fontSize: scaleFont(12),
    marginTop: verticalScale(4),
  },
  
  cardActions: {
    flexDirection: "row",
    gap: scale(8),
    flexWrap: "wrap",
  },
  
  actionButton: {
    paddingVertical: verticalScale(7),
    paddingHorizontal: scale(12),
    borderRadius: scale(8),
  },
  
  linkButton: {
    backgroundColor: "#1a5c3a",
    borderWidth: 1,
    borderColor: "#0fce52",
  },
  
  actionButtonText: {
    color: "#fff",
    fontSize: scaleFont(12),
    fontWeight: "600",
  },
  
  removeButton: {
    backgroundColor: "#3a1a1a",
    borderWidth: 1,
    borderColor: "#ce2a0f",
  },
  
  removeButtonText: {
    color: "#ce2a0f",
    fontSize: scaleFont(12),
    fontWeight: "600",
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: scale(24),
  },
  
  modalContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: scale(20),
    padding: scale(28),
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#2e2e2e",
  },
  
  modalTitle: {
    color: "white",
    fontSize: scaleFont(20),
    fontWeight: "700",
    marginBottom: verticalScale(6),
  },
  
  modalSubtitle: {
    color: "#888",
    fontSize: scaleFont(13),
    textAlign: "center",
    marginBottom: verticalScale(20),
    lineHeight: scaleFont(20),
  },
  
  qrImage: {
    width: scale(240),
    height: scale(240),
    borderRadius: scale(12),
    backgroundColor: "white",
    padding: scale(8),
  },
  
  copyLinkButton: {
    marginTop: verticalScale(20),
    borderWidth: 1,
    borderColor: "#0fce52",
    borderRadius: scale(10),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(24),
  },
  
  copyLinkText: {
    fontSize: scaleFont(14),
    fontWeight: "600",
  },
  
  closeButton: {
    marginTop: verticalScale(12),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(24),
  },
  
  closeButtonText: {
    color: "#666",
    fontSize: scaleFont(14),
  },
});
