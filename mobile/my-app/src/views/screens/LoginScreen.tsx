import { useState } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import CustomButton from "../components/customButton";
import { styles } from "../styles/LoginScreenStyle";
import { router } from 'expo-router';
import { api } from "../../services/api";

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function fazerLogin() {
    try {
      const response = await api.post("/usuarios/login", {
        email,
        senha
      });

      console.log(response.data);

      router.push("/evento-config");
    } catch (error) {
      alert("Email ou senha inválidos");
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}>
      <View style={styles.container}>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.image}
        />

        <Text style={styles.title}>Bem vindo!</Text>

        <Text style={styles.subtitle}>Faça login para continuar</Text>

        <View style={styles.line} />

        <View style={styles.login}>
          <Text style={styles.titleLogin}>Login</Text>

          <View style={styles.inputContainer}>
            <Image
              source={require("../../../assets/images/mail.png")}
              style={styles.icon}
            />

            <TextInput
              placeholder='Email'
              placeholderTextColor="#999"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Image
              source={require("../../../assets/images/lock.png")}
              style={styles.icon}
            />

            <TextInput
              placeholder='Senha'
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
            <View
              style={[
                styles.checkbox,
                rememberMe && styles.checkboxActive,
              ]}
            >
              {rememberMe && (
                <Image
                  source={require("../../../assets/images/check.png")}
                  style={styles.checkboxImage}
                />
              )}
            </View>

            <Text style={styles.checkboxText}>
              Lembrar meus dados
            </Text>
          </TouchableOpacity>

        </View>

        <CustomButton
          title="Entrar"
          width="70%"
          backgroundColor="#0db347"
          onPress={fazerLogin}
          style={{
            alignSelf: "center",
          }}
        />

        <TouchableOpacity onPress={() => console.log("Forgot password")}>
          <Text style={styles.forgot}>Esqueci minha senha</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
