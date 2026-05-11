import { useState } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import CustomButton from "../components/customButton";
import { styles } from "../styles/LoginScreenStyle";

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false)  
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.image}
      />

      <Text style={styles.title}>Bem vindo!</Text>

      <Text style={styles.subtitle}>Faça login para continuar</Text>

      <View style={styles.line}/>

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
        onPress={() => console.log("Clicked")}
        style={{
          alignSelf: "center",
        }}
      />
      
      <TouchableOpacity onPress={() => console.log("Forgot password")}>
        <Text style={styles.forgot}>Esqueci minha senha</Text>
      </TouchableOpacity>

    </View>
  );
}
