  import { Redirect } from "expo-router";
  import LoginScreen from '../src/views/screens/LoginScreen';
  import { useContext } from "react";
  import { View, ActivityIndicator } from "react-native";
  import { AuthContext } from "../src/context/AuthContext";

  export default function Login() {

    const { user, loading } = useContext(AuthContext);

    if (loading) {
      return (
        <View style={{ flex: 1, backgroundColor: "#121212", justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#FF9000" />
        </View>
      );
    }

    if (user) {
      if (user.tipo === "garcom") {
        return <Redirect href="/(tabs)/garcom-dash" />;
      } else {
        return <Redirect href="/(tabs)/adm-dash" />; 
      }
    }

    return <LoginScreen />;
  }
