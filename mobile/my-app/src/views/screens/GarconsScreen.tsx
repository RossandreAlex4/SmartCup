import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
  Clipboard,
} from "react-native";
import { router } from "expo-router";
import { api } from "../../services/api";

interface Garcom {
  id: number;
  nome: string;
  token: string;
  criado_em: string;
}

export default function GarconsScreen() {
  const [garcons, setGarcons] = useState<Garcom[]>([]);
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [selectedGarcom, setSelectedGarcom] = useState<Garcom | null>(null);

  const buscarGarcons = useCallback(async () => {
    try {
      const response = await api.get("/usuarios/garcons");
      if (response.data.sucesso) {
        setGarcons(response.data.garcons);
      }
    } catch (error: any) {
      Alert.alert("Erro", "Nao foi possivel carregar os garcons.");
    }
  }, []);

  useEffect(() => {
    buscarGarcons();
  }, [buscarGarcons]);

  async function criarGarcom() {
    if (!nome.trim()) {
      Alert.alert("Erro", "Digite o nome do garcom.");
      return;
    }
    try {
      setLoading(true);
      await api.post("/usuarios/garcons", { nome: nome.trim() });
      setNome("");
      await buscarGarcons();
    } catch (error: any) {
      Alert.alert("Erro", "Nao foi possivel criar o garcom.");
    } finally {
      setLoading(false);
    }
  }

  async function removerGarcom(id: number, nomeGarcom: string) {
    Alert.alert(
      "Remover acesso",
      `Remover acesso de ${nomeGarcom}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/usuarios/garcons/${id}`);
              await buscarGarcons();
            } catch {
              Alert.alert("Erro", "Nao foi possivel remover o garcom.");
            }
          },
        },
      ]
    );
  }

  async function verQrCode(garcom: Garcom) {
    try {
      setSelectedGarcom(garcom);
      const response = await api.get(`/usuarios/garcons/${garcom.id}/qrcode`);
      if (response.data.sucesso) {
        setQrCodeImage(response.data.qrcode);
        setQrCodeVisible(true);
      }
    } catch {
      Alert.alert("Erro", "Nao foi possivel carregar o QR Code.");
    }
  }

  function copiarLink(garcom: Garcom) {
    const baseUrl = api.defaults.baseURL;
    const link = `${baseUrl}/usuarios/garcons/acesso/${garcom.token}`;
    Clipboard.setString(link);
    Alert.alert("Link copiado!", `Link de acesso de ${garcom.nome} copiado para a area de transferencia.`);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image
            source={require("../../../assets/images/back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Garcons</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.addContainer}>
        <Text style={styles.sectionTitle}>Adicionar Garcom</Text>
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Nome do garcom"
            placeholderTextColor="#666"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />
          <TouchableOpacity style={styles.addButton} onPress={criarGarcom} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.addButtonText}>+</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Acessos Ativos</Text>

      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 30 }}>
        {garcons.length === 0 && (
          <Text style={styles.emptyText}>Nenhum garcom cadastrado ainda.</Text>
        )}
        {garcons.map((garcom) => (
          <View key={garcom.id} style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{garcom.nome}</Text>
              <Text style={styles.cardDate}>
                {new Date(garcom.criado_em).toLocaleDateString("pt-BR")}
              </Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => verQrCode(garcom)}
              >
                <Text style={styles.actionButtonText}>QR Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.linkButton]}
                onPress={() => copiarLink(garcom)}
              >
                <Text style={styles.actionButtonText}>Copiar Link</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.removeButton]}
                onPress={() => removerGarcom(garcom.id, garcom.nome)}
              >
                <Text style={styles.removeButtonText}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={qrCodeVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedGarcom?.nome}</Text>
            <Text style={styles.modalSubtitle}>
              Mostre este QR Code ao garcom para que ele possa acessar o app.
            </Text>
            {qrCodeImage ? (
              <Image
                source={{ uri: qrCodeImage }}
                style={styles.qrImage}
                resizeMode="contain"
              />
            ) : (
              <ActivityIndicator size="large" color="#0fce52" style={{ margin: 40 }} />
            )}
            {selectedGarcom && (
              <TouchableOpacity
                style={styles.copyLinkButton}
                onPress={() => {
                  copiarLink(selectedGarcom);
                }}
              >
                <Text style={styles.copyLinkText}>Copiar Link de Acesso</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setQrCodeVisible(false);
                setQrCodeImage("");
                setSelectedGarcom(null);
              }}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: "#0eb348",
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#0eb348",
    marginVertical: 14,
    width: "50%",
    alignSelf: "center",
    borderRadius: 100,
  },
  addContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "white",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#2e2e2e",
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: "#0fce52",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
  },
  list: {
    flex: 1,
    marginTop: 4,
  },
  emptyText: {
    color: "#555",
    fontSize: 15,
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2e2e2e",
  },
  cardInfo: {
    marginBottom: 12,
  },
  cardName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cardDate: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  actionButton: {
    backgroundColor: "#0fce52",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  linkButton: {
    backgroundColor: "#1a5c3a",
    borderWidth: 1,
    borderColor: "#0fce52",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  removeButton: {
    backgroundColor: "#3a1a1a",
    borderWidth: 1,
    borderColor: "#ce2a0f",
  },
  removeButtonText: {
    color: "#ce2a0f",
    fontSize: 12,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#2e2e2e",
  },
  modalTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  modalSubtitle: {
    color: "#888",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  qrImage: {
    width: 240,
    height: 240,
    borderRadius: 12,
    backgroundColor: "white",
    padding: 8,
  },
  copyLinkButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#0fce52",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  copyLinkText: {
    color: "#0fce52",
    fontSize: 14,
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    color: "#666",
    fontSize: 14,
  },
});
