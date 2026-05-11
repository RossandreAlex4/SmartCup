import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title:{
    color: "white",
    fontSize: 45
  },
  white:{
    color: "white"
  },
  green:{
    color: "#0fce52"
  },

  image:{
    width:300,
    height:200,
  },

  line:{
    backgroundColor: "#0eb348",
    height: 1,
    marginVertical: 20,
    width: "40%",
    alignSelf: "center",
    borderRadius: 100,
  },

  subtitle:{
    color: "white",
    fontSize: 20,
    width: "65%",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 10
  }
});
