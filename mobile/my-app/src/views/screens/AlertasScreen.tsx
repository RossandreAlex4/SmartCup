import { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { fetchAlertas, resolveAlerta } from "../../services/smartcupService";

interface Alerta {
  id: number;
  tipo: string;
  mesa_nome: string;
  mesa_id: number;
  data: string;
}

export default function AlertasScreen() {
  const { user } = useContext(AuthContext);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregarAlertas() {
    try {
      const alertasData = await fetchAlertas();
      setAlertas(alertasData);
    } catch {
      Alert.alert("Erro", "Nao foi possivel carregar os alertas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarAlertas();
    const interval = setInterval(carregarAlertas, 10000);
    return () => clearInterval(interval);
  }, []);

  async function atenderAlerta(id: number) {
    try {
      await resolveAlerta(id);
      setAlertas((prev) => prev.filter((a) => a.id !== id));
    } catch {
      Alert.alert("Erro", "Nao foi possivel resolver este alerta.");
    }
  }

  const renderItem = ({ item }: { item: Alerta }) => (
    <View style={styles.card}>
      <View style={styles.indexCircle}>
        <Text style={styles.indexText}>{item.id}</Text>
      </View>
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.tipo}</Text>
        <Text style={styles.cardSubtitle}>{item.mesa_nome || `Mesa ${item.mesa_id}`}</Text>
      </View>
      <TouchableOpacity style={styles.checkButton} onPress={() => atenderAlerta(item.id)}>
        <Ionicons name="checkmark-circle-outline" size={32} color="#00FF00" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={{ width: 45, height: 45, resizeMode: "contain" }}
        />
        <Text style={styles.headerTitle}>Alertas</Text>
        <View style={{ width: 45 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0fce52" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={alertas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={carregarAlertas}
          refreshing={loading}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Ionicons name="checkmark-circle-outline" size={60} color="#0fce52" />
              <Text style={{ color: "#555", fontSize: 16, marginTop: 14 }}>
                Sem alertas pendentes
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#0fce52",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2e2e2e",
  },
  indexCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0fce52",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  indexText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 13,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  cardSubtitle: {
    color: "#888",
    fontSize: 13,
    marginTop: 2,
  },
  checkButton: {
    padding: 4,
  },
});