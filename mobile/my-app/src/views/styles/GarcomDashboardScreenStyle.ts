import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginTop: 20,
  },

  greeting: {
    fontSize: 20,

    fontWeight: "700",
  },

  role: {
    fontSize: 13,

    marginTop: 2,
  },

  logoutButton: {
    padding: 8,

    borderRadius: 10,

    borderWidth: 1,
  },

  divider: {
    height: 1,

    marginVertical: 14,

    width: "50%",

    alignSelf: "center",

    borderRadius: 100,
  },

  sectionTitle: {
    fontSize: 13,

    marginBottom: 14,

    textTransform:
      "uppercase",

    letterSpacing: 1,
  },

  card: {
    borderRadius: 14,

    padding: 16,

    marginBottom: 10,

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    borderWidth: 1,
  },

  cardLeft: {
    flexDirection: "row",

    alignItems: "center",

    gap: 12,

    flex: 1,
  },

  alertDot: {
    width: 10,

    height: 10,

    borderRadius: 5,
  },

  cardTitle: {
    fontSize: 15,

    fontWeight: "600",

    textTransform:
      "capitalize",
  },

  cardSub: {
    fontSize: 13,

    marginTop: 2,
  },

  checkButton: {
    padding: 4,
  },

  emptyContainer: {
    alignItems: "center",

    marginTop: 60,
  },

  emptyText: {
    fontSize: 16,

    marginTop: 14,
  },

  headerActions: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
},

themeButton: {
  width: 40,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
},

  themeIcon: {
    width: 29,
    height: 29,
  },

  titleConfig: {
    alignItems: "center",
    marginTop: 19,
    width: "100%",
    justifyContent: "center",
  },

  backButton: {
    position: "absolute",
    left: 20,
  },

  image: {
    width: 20,
    height: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 15,
    width: "65%",
    textAlign: "center",
    marginTop: 5,
  },

  line: {
    height: 1,
    marginVertical: 10,
    width: "50%",
    alignSelf: "center",
    borderRadius: 100,
  },

  statsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    gap: 8,
  },

  statsCard: {
    flex: 1,
    height: 80,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  value: {
    fontSize: 22,
    fontWeight: "bold",
  },

  label: {
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },

  createContainer: {
    width: "100%",
    marginBottom: 15,
  },

  overview: {
    fontSize: 15,
    fontWeight: "600",
  },

  cardsContainer: {
    width: "100%",
    gap: 10,
  },
});