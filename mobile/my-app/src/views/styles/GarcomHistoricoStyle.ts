import { StyleSheet } from "react-native";
import { scale, verticalScale, scaleFont } from "../../themes/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: verticalScale(60),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(25),
    marginBottom: verticalScale(30),
  },
  logoContainer: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(22.5),
    borderWidth: 2,
    borderColor: '#00FF00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: scale(10),
    elevation: 5,
  },
  logoInner: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    borderWidth: 1,
    borderColor: '#00FF00',
    opacity: 0.5,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: scaleFont(22),
    fontWeight: '600',
    letterSpacing: scale(0.5),
  },
  listContent: {
    paddingBottom: verticalScale(100),
  },
  card: {
    backgroundColor: 'rgba(0, 255, 0, 0.03)',
    borderRadius: scale(20),
    marginHorizontal: scale(20),
    marginBottom: verticalScale(15),
    padding: scale(18),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 0, 0.15)',
  },
  indexCircle: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(15),
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  indexText: {
    color: '#FFFFFF',
    fontSize: scaleFont(16),
    fontWeight: '500',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: scaleFont(18),
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: scaleFont(14),
    marginTop: verticalScale(2),
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButton: {
    padding: scale(5),
    marginLeft: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  }
});
