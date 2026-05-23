import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  themeIcon:{
    width: 29,
    height: 29,
    
  },

  titleConfig:{
    flexDirection: "row",
    alignItems: "center",
    marginTop: 19,
    width: '100%',
    justifyContent: "center"
  },

  backButton: {
    position: "absolute",
    left: 20,
  },

  title:{
    fontSize: 20,
  },

  image:{
    width:20,
    height:20,
    
  },

  line:{
    height: 1,
    marginVertical: 20,
    width: "50%",
    alignSelf: "center",
    borderRadius: 100,
  },

  createContainer:{
    width: "90%",
    marginTop: 4
  },

  createName:{
    fontSize: 15,
    width: "65%",
    
  },

  input: {
    fontSize: 16,
    width: "100%"
  },

  inputContainer: {
    width: "100%",
    height: 55,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginVertical: 15,
  },

  cardsContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },

  card: {
    width: "42%",
    height: 180,
    borderRadius: 20,
    marginBottom: 20,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 16,
    textAlign: "center",
  },

  value: {
    fontSize: 38,
    fontWeight: "bold",
  },

  buttonsContainer: {
    flexDirection: "row",
    gap: 15,
  },

  button: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
  },

});
