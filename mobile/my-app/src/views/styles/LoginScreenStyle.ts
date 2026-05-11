import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
  },

  title:{
     color: "#0fe159",
    fontSize: 25,
  },

  image:{
    width:100,
    height:120,
  },

  line:{
    backgroundColor: "#0eb348",
    height: 1,
    marginVertical: 20,
    width: "40%",
    alignSelf: "center",
  },

  subtitle:{
    color: "white",
    fontSize: 15,
    width: "65%",
    justifyContent: "center",
    textAlign: "center",
  },

  login:{
    width: "80%",
    alignItems: 'center'
  },

  titleLogin:{
    fontSize: 35,
    color: "white",
    marginBottom: 10,
    textAlign: "center"
  },

  inputContainer: {
    width: "85%",
    height: 55,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginVertical: 15,
  },

  icon: {
    width: 22,
    height: 22,
    tintColor: "#0fe159"
  },

  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    width:4
       
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom:30
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#0fe159",
    borderRadius: 6,
    marginRight: 10,
  },

  checkboxActive: {
    backgroundColor: "#0fe159",
  },

  checkboxText: {
    color: "white",
    fontSize: 16,
  },

  checkboxImage:{
    width:20,
    height:20
  },

  forgot:{
    fontSize:14,
    color: "white",
    margin:15
  }
});
