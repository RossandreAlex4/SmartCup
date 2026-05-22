import { useState, useContext, useEffect } from "react";
import { Text, View, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import CustomButton from "../components/customButton";
import { styles } from "../styles/LoginScreenStyle";
import { router } from "expo-router";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const { loginAdmin, user, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (user.tipo === "admin") {
        router.replace("/evento-config");
      } else {
        router.replace("/(tabs)/mesas-screen");
      }
    }
  }, [user, loading]);

  async function fazerLogin() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha email e senha.");
      return;
    }
    try {
      setIsLogging(true);
      await loginAdmin(email, senha);
      router.replace("/evento-config");
    } catch (error: any) {
      Alert.alert("Erro de Login", error.message || "Email ou senha invalidos.");
    } finally {
      setIsLogging(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#121212", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0fce52" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.image}
        />

        <Text style={styles.title}>Bem vindo!</Text>
        <Text style={styles.subtitle}>Faca login para continuar</Text>

        <View style={styles.line} />

        <View style={styles.login}>
          <Text style={styles.titleLogin}>Login</Text>

          <View style={styles.inputContainer}>
            <Image
              source={require("../../../assets/images/mail.png")}
              style={styles.icon}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Image
              source={require("../../../assets/images/lock.png")}
              style={styles.icon}
            />
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#999"
              secureTextEntry
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
              {rememberMe && (
                <Image
                  source={require("../../../assets/images/check.png")}
                  style={styles.checkboxImage}
                />
              )}
            </View>
            <Text style={styles.checkboxText}>Lembrar meus dados</Text>
          </TouchableOpacity>
        </View>

        <CustomButton
          title={isLogging ? "Entrando..." : "Entrar"}
          width="70%"
          backgroundColor="#0db347"
          onPress={fazerLogin}
          style={{ alignSelf: "center" }}
        />

        <TouchableOpacity
          onPress={() => router.push("/qrcode-scanner")}
          style={{
            marginTop: 16,
            borderWidth: 1,
            borderColor: "#0fce52",
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 32,
            alignSelf: "center",
          }}
        >
          <Text style={{ color: "#0fce52", fontWeight: "600", fontSize: 14 }}>
            Acesso Garcom (QR Code)
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
