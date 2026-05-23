import { useState, useContext, useEffect } from "react";

import { Text, View, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";

import CustomButton from "../components/customButton";

import { styles } from "../styles/LoginScreenStyle";

import { router } from "expo-router";

import { AuthContext } from "../../context/AuthContext";

import { ThemeContext } from "../../context/ThemeContext";

import {
  darkTheme,
  lightTheme,
} from "../../themes/colors";

export default function Login() {

  const {
    loginAdmin,
    user,
    loading,
  } = useContext(AuthContext);

  const {
    theme,
    toggleTheme,
  } = useContext(ThemeContext);

  const colors =
    theme === "dark"
      ? darkTheme
      : lightTheme;

  const [rememberMe, setRememberMe] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLogging, setIsLogging] =
    useState(false);

  useEffect(() => {

    if (!loading && user) {

      if (user.tipo === "admin") {

        router.replace("/evento-config");

      } else {

        router.replace(
          "/(tabs)/mesas-screen"
        );

      }
    }

  }, [user, loading]);

  async function fazerLogin() {

    if (!email || !senha) {

      Alert.alert(
        "Erro",
        "Preencha email e senha."
      );

      return;
    }

    try {

      setIsLogging(true);

      await loginAdmin(
        email,
        senha
      );

      router.replace(
        "/evento-config"
      );

    } catch (error: any) {

      Alert.alert(
        "Erro de Login",
        error.message ||
          "Email ou senha inválidos."
      );

    } finally {

      setIsLogging(false);

    }
  }

  if (loading) {

    return (

      <View
        style={{
          flex: 1,
          backgroundColor:
            colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

      </View>
    );
  }

  return (

    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      style={{
        backgroundColor:
          colors.background,
      }}
    >

      <View
        style={[
          styles.container,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >

        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >

          <Image
            source={require("../../../assets/images/themes.png")}
            style={[
              styles.themeIcon,
              {
                tintColor:
                  colors.primary,
              },
            ]}
          />

        </TouchableOpacity>

        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.image}
        />

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Bem vindo!
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Faça login para continuar
        </Text>

        <View
          style={[
            styles.line,
            {
              backgroundColor:
                colors.primary,
            },
          ]}
        />

        <View
          style={[
            styles.login,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >

          <Text
            style={[
              styles.titleLogin,
              {
                color: colors.text,
              },
            ]}
          >
            Login
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor:
                  colors.background,
                borderColor:
                  colors.primary,
              },
            ]}
          >

            <Image
              source={require("../../../assets/images/mail.png")}
              style={[
                styles.icon,
                {
                  tintColor:
                    colors.primary,
                },
              ]}
            />

            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              style={[
                styles.input,
                {
                  color: colors.text,
                },
              ]}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

          </View>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor:
                  colors.background,
                borderColor:
                  colors.primary,
              },
            ]}
          >

            <Image
              source={require("../../../assets/images/lock.png")}
              style={[
                styles.icon,
                {
                  tintColor:
                    colors.primary,
                },
              ]}
            />

            <TextInput
              placeholder="Senha"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              style={[
                styles.input,
                {
                  color: colors.text,
                },
              ]}
              value={senha}
              onChangeText={setSenha}
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >

              <Image
                source={
                  showPassword
                    ? require("../../../assets/images/eye-off.png")
                    : require("../../../assets/images/eye.png")
                }
                style={{
                  width: 20,
                  height: 20,
                  tintColor:
                    colors.primary,
                }}
              />

            </TouchableOpacity>

          </View>

          <TouchableOpacity
            style={
              styles.checkboxContainer
            }
            onPress={() =>
              setRememberMe(
                !rememberMe
              )
            }
          >

            <View
              style={[
                styles.checkbox,
                {
                  borderColor:
                    colors.primary,
                },
                rememberMe &&
                  styles.checkboxActive,
              ]}
            >

              {rememberMe && (

                <Image
                  source={require("../../../assets/images/check.png")}
                  style={
                    styles.checkboxImage
                  }
                />

              )}

            </View>

            <Text
              style={[
                styles.checkboxText,
                {
                  color: colors.text,
                },
              ]}
            >
              Lembrar meus dados
            </Text>

          </TouchableOpacity>

        </View>

        <CustomButton
          title={
            isLogging
              ? "Entrando..."
              : "Entrar"
          }
          width="70%"
          backgroundColor={
            colors.primary
          }
          onPress={fazerLogin}
          style={{
            alignSelf: "center",
          }}
        />

        <TouchableOpacity
          onPress={() =>
            router.push(
              "//(tabs)/qrcode-scanner"
            )
          }
          style={{
            marginTop: 16,
            borderWidth: 1,
            borderColor:
              colors.primary,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 32,
            alignSelf: "center",
          }}
        >

          <Text
            style={{
              color:
                colors.primary,
              fontWeight: "600",
              fontSize: 14,
            }}
          >
            Acesso Garçom (QR Code)
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            console.log(
              "Forgot password"
            )
          }
        >

          <Text
            style={[
              styles.forgot,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Esqueci minha senha
          </Text>

        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}