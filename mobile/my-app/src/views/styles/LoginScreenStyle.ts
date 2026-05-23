import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  themeIcon:{
    width: 35,
    height: 35,
    
  },

  title:{
    fontSize: 25,
  },

  image:{
    width:100,
    height:120,
  },

  line:{
    height: 1,
    marginVertical: 20,
    width: "40%",
    alignSelf: "center",
  },

  subtitle:{
    fontSize: 15,
    width: "65%",
    justifyContent: "center",
    textAlign: "center",
  },

  login:{
    width: "80%",
    alignItems: 'center',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30
  },

  titleLogin:{
    fontSize: 35,
    marginBottom: 10,
    textAlign: "center"
  },

  inputContainer: {
    width: "85%",
    height: 55,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginVertical: 15,
  },

  icon: {
    width: 22,
    height: 22,
  },

  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10 
       
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
    borderRadius: 6,
    marginRight: 10,
  },

  checkboxActive: {
    backgroundColor: "#0fe159",
  },

  checkboxText: {
    fontSize: 16,
  },

  checkboxImage:{
    width:20,
    height:20
  },

  forgot:{
    fontSize:14,
    margin:15
  }
});
