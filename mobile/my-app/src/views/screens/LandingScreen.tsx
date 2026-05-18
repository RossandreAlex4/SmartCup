import { Text, View, Image, ScrollView } from 'react-native';
import CustomButton from "../components/customButton";
import { styles } from "../styles/LandingScreenStyle";
import { router } from 'expo-router';

export default function TelaInicial() {
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

        <Text style={styles.title}>
          <Text style={styles.white}>Smart</Text>
          <Text style={styles.green}>Cup</Text>
        </Text>

        <View style={styles.line} />

        <Text style={styles.subtitle}>
          <Text style={styles.white}>Monitoramento inteligente para </Text>
          <Text style={styles.green}>festas e eventos</Text>
        </Text>

        <CustomButton
          title="Entrar"
          width="70%"
          backgroundColor="#0fce52"
          onPress={() => router.push('/login')}
          style={{
            position: "absolute",
            bottom: 90,
            alignSelf: "center",
          }}
        />

        <CustomButton
          title="Ver Histórico (Teste)"
          width="70%"
          backgroundColor="#333"
          onPress={() => router.push('/(tabs)/historico')}
          style={{
            position: "absolute",
            bottom: 25,
            alignSelf: "center",
          }}
        />

      </View>
    </ScrollView>
  );
}