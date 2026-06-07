import { StyleSheet } from "react-native";
import { scale, verticalScale, scaleFont } from "../../themes/responsive";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },

  header: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginTop: verticalScale(20),
  },

  greeting: {
    fontSize: scaleFont(20),

    fontWeight: "700",
  },

  role: {
    fontSize: scaleFont(13),

    marginTop: verticalScale(2),
  },

  logoutButton: {
    padding: scale(8),

    borderRadius: scale(10),

    borderWidth: 1,
  },

  divider: {
    height: verticalScale(1),

    marginVertical: verticalScale(14),

    width: "50%",

    alignSelf: "center",

    borderRadius: scale(100),
  },

  sectionTitle: {
    fontSize: scaleFont(13),

    marginBottom: verticalScale(14),

    textTransform:
      "uppercase",

    letterSpacing: scale(1),
  },

  card: {
    borderRadius: scale(14),

    padding: scale(16),

    marginBottom: verticalScale(10),

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    borderWidth: 1,
  },

  cardLeft: {
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

  cardTitle: {
    fontSize: scaleFont(15),

    fontWeight: "600",

    textTransform:
      "capitalize",
  },

  cardSub: {
    fontSize: scaleFont(13),

    marginTop: verticalScale(2),
  },

  checkButton: {
    padding: scale(4),
  },

  emptyContainer: {
    alignItems: "center",

    marginTop: verticalScale(60),
  },

  emptyText: {
    fontSize: scaleFont(16),

    marginTop: verticalScale(14),
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },

  themeButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: "center",
    alignItems: "center",
  },

  themeIcon: {
    width: scale(29),
    height: scale(29),
  },

  titleConfig: {
    alignItems: "center",
    marginTop: verticalScale(19),
    width: "100%",
    justifyContent: "center",
  },

  backButton: {
    position: "absolute",
    left: scale(20),
  },

  image: {
    width: scale(20),
    height: scale(20),
  },

  title: {
    fontSize: scaleFont(20),
    fontWeight: "700",
  },

  subtitle: {
    fontSize: scaleFont(15),
    width: "65%",
    textAlign: "center",
    marginTop: verticalScale(5),
  },

  line: {
    height: verticalScale(1),
    marginVertical: verticalScale(10),
    width: "50%",
    alignSelf: "center",
    borderRadius: scale(100),
  },

  statsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: verticalScale(15),
    gap: scale(8),
  },

  statsCard: {
    flex: 1,
    height: verticalScale(80),
    borderRadius: scale(16),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
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

  createContainer: {
    width: "100%",
    marginBottom: verticalScale(15),
  },

  overview: {
    fontSize: scaleFont(15),
    fontWeight: "600",
  },

  cardsContainer: {
    width: "100%",
    gap: scale(10),
  },
});