import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  themeIcon:{
    width: 29,
    height: 29,
    
  },
  
  titleConfig: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 19,
    position: "relative",
  },

  backButton: {
    position: "absolute",
    left: 20,
  },

  backImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },

  title: {
    fontSize: 22,
  },

  line:{
    height: 1,
    marginVertical: 10,
    width: "50%",
    alignSelf: "center",
    borderRadius: 100,
  },

  listContent: {
    padding: 16,
    paddingBottom: 30,
  },

  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },

  indexCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  indexText: {
    fontWeight: "700",
    fontSize: 13,
  },

  cardTextContainer: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    textTransform:
      "capitalize",
  },

  cardSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },

  checkButton: {
    padding: 4,
  },
});