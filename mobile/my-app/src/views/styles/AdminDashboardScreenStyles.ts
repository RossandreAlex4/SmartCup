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

  createContainer:{
    width: "90%",
    marginTop: 4
  },

  overview:{
    color: "white",
    fontSize: 15,
    width: "85%",
    marginTop: 4
    
    
  },

  statsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: 10
    
  },
  
  statsCard: {
    width: 70,
    height: 70,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  
  value: {
    color: "#0fe159",
    fontSize: 24,
    fontWeight: "bold",
  },
  
  label: {
    color: "white",
    fontSize: 11,
    marginTop: 4,
  },

  cardsContainer: {
    width: "95%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    margin:20,
   
  },

  card: {
    width: "47%",
    height: 180,
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    marginBottom: 10,
    padding: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  cardTitle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },

  cardStatus: {
    color: "#0fe159",
    fontSize: 14,
    marginTop: 10,
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
