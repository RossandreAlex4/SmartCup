import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  themeIcon:{
    width: 35,
    height: 35,
    
  },

  title:{
    fontSize: 45
  },

  image:{
    width:300,
    height:200,
  },

  line:{
    height: 1,
    marginVertical: 20,
    width: "40%",
    alignSelf: "center",
    borderRadius: 100,
  },

  subtitle:{
    fontSize: 20,
    width: "65%",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 10
  }
});
