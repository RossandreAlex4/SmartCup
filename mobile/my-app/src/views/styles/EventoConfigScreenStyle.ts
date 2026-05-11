import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
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
    color: "white",
    fontSize: 20,

  },

  image:{
    width:20,
    height:20,
    tintColor: "#0eb348",
    
  },

  line:{
    backgroundColor: "#0eb348",
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
    color: "white",
    fontSize: 15,
    width: "65%",
    
  },

  input: {
    color: "#fff",
    fontSize: 16,
    width: "100%"
  },

  inputContainer: {
    width: "100%",
    height: 55,
    backgroundColor: "#1E1E1E",
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
    marginBottom:20
  },

  card: {
    width: "42%",
    height: 180,
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    marginBottom: 20,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },

  value: {
    color: "#0eb348",
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
    backgroundColor: "#0fe159",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
  },

});
