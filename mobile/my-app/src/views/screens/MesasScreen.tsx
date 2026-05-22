import { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from "react-native";
import { styles } from "../styles/MesasScreenStyle";
import { router } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Ionicons } from "@expo/vector-icons";

interface Mesa {
  id: number;
  nome: string;
  zona: string;
  status: string;
}

export default function MesasScreen() {
  const { user, logout } = useContext(AuthContext);
  const isGarcom = user?.tipo === "garcom";
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  async function carregarMesas() {
    try {
      const response = await api.get("/mesas");
      if (response.data.sucesso) {
        setMesas(response.data.mesas);
      }
    } catch {
      Alert.alert("Erro", "Nao foi possivel carregar as mesas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarMesas();
  }, []);

  async function handleLogout() {
    Alert.alert("Sair", "Deseja encerrar seu turno?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  }

  const mesasFiltradas = mesas.filter(
    (m) =>
      m.nome.toLowerCase().includes(busca.toLowerCase()) ||
      m.zona?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.titleConfig}>
          {!isGarcom && (
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Image
                source={require("../../../assets/images/back.png")}
                style={styles.image}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{isGarcom ? "Mesas" : "Configuracao das Mesas"}</Text>
          {isGarcom && (
            <TouchableOpacity
              style={{ position: "absolute", right: 0 }}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={22} color="#ce2a0f" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.line} />

        <View style={styles.createContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Buscar mesa..."
              placeholderTextColor="#999"
              style={styles.input}
              value={busca}
              onChangeText={setBusca}
            />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0fce52" style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.cardsContainer}>
            {mesasFiltradas.map((mesa) => (
              <View key={mesa.id} style={styles.card}>
                <Text style={styles.cardTitle}>{mesa.nome}</Text>
                {!isGarcom && (
                  <TouchableOpacity onPress={() => {}}>
                    <Image
                      source={require("../../../assets/images/edit.png")}
                      style={styles.cardEdit}
                    />
                  </TouchableOpacity>
                )}
                <View style={styles.cardStatusLine}>
                  <Text style={styles.cardStatus}>{mesa.status}</Text>
                  {mesa.zona ? <Text style={styles.cardStatus}>{mesa.zona}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        )}

        {!isGarcom && (
          <TouchableOpacity
            style={localStyles.addButton}
            onPress={() => router.push("/garcons" as any)}
          >
            <Text style={localStyles.addButtonText}>Gerenciar Garcons</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  addButton: {
    backgroundColor: "#0eb348",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 25,
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
});