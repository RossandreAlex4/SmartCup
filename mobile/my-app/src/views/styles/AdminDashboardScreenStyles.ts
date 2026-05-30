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

  subtitle:{
    fontSize: 15,
    width: "65%",
    justifyContent: "center",
    textAlign: "center",
    marginTop: 5
  },

  image:{
    width:20,
    height:20,
    
  },

  line:{
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
    width: 95,
    height: 80,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4
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
    borderRadius: 20,
    marginBottom: 10,
    padding: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 16,
    textAlign: "center",
  },

  cardStatus: {
    fontSize: 14,
    marginTop: 10,
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
