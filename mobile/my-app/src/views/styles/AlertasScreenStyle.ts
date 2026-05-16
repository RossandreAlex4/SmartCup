import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',

  },

  titleConfig:{
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

  subtitle:{
    color: "#0eb348",
    fontSize: 15,
    width: "65%",
    justifyContent: "center",
    textAlign: "center",
    marginTop: 5
  },

  image:{
    width:20,
    height:20,
    tintColor: "#0eb348",
    
  },

  line:{
    backgroundColor: "#0eb348",
    height: 1,
    marginVertical: 10,
    width: "50%",
    alignSelf: "center",
    borderRadius: 100,
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
    marginTop: 15,
  },

  createContainer:{
    width: "90%",
  },

  cardsContainer: {
    width: "95%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    margin:20,
   
  },

  card: {
    width: "90%",
    height: 100,
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    marginBottom: 10,
    padding: 20,
    justifyContent: "space-evenly",
    
  },

  cardTitle: {
    color: "white",
    fontSize: 16,

  },

  cardEdit:{
    width: 20,
    height: 20,
    tintColor: "#0eb348",
    alignSelf: "flex-end"
  },

  cardStatusLine:{
    flexDirection: "row",
    gap: 20,
    marginTop: 10
  },

  cardStatus: {
    color: "#0fe159",
    fontSize: 14,
    
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
