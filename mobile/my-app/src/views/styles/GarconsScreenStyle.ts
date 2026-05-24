import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  themeIcon:{
    width: 29,
    height: 29,
    
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    position: "relative",
  },
  
  backButton: {
    position: "absolute",
    left: 0,
  },
  
  backIcon: {
    width: 20,
    height: 20,
  },
  
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  
  divider: {
    height: 1,
    marginVertical: 14,
    width: "50%",
    alignSelf: "center",
    borderRadius: 100,
  },
  
  addContainer: {
    marginBottom: 20,
  },
  
  sectionTitle: {
    fontSize: 13,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  
  inputRow: {
    flexDirection: "row",
    gap: 10,
  },
  
  input: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    
  },
  
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  
  addButtonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  
  list: {
    flex: 1,
    marginTop: 4,
  },
  
  emptyText: {
    color: "#555",
    fontSize: 15,
    textAlign: "center",
    marginTop: 40,
  },
  
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2e2e2e",
  },
  
  cardInfo: {
    marginBottom: 12,
  },
  
  cardName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  
  cardDate: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },
  
  cardActions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  
  actionButton: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  
  linkButton: {
    backgroundColor: "#1a5c3a",
    borderWidth: 1,
    borderColor: "#0fce52",
  },
  
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  
  removeButton: {
    backgroundColor: "#3a1a1a",
    borderWidth: 1,
    borderColor: "#ce2a0f",
  },
  
  removeButtonText: {
    color: "#ce2a0f",
    fontSize: 12,
    fontWeight: "600",
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  
  modalContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#2e2e2e",
  },
  
  modalTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  
  modalSubtitle: {
    color: "#888",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  
  qrImage: {
    width: 240,
    height: 240,
    borderRadius: 12,
    backgroundColor: "white",
    padding: 8,
  },
  
  copyLinkButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#0fce52",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  
  copyLinkText: {
    fontSize: 14,
    fontWeight: "600",
  },
  
  closeButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  
  closeButtonText: {
    color: "#666",
    fontSize: 14,
  },
});
