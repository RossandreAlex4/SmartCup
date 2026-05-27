import { useState, useEffect, useCallback, useContext } from "react";

import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Modal, Image, Platform, FlatList } from "react-native";

import { styles } from "../styles/GarconsScreenStyle";

import { router } from "expo-router";

import { api } from "../../services/api";

import { ThemeContext } from "../../context/ThemeContext";

import {
  darkTheme,
  lightTheme,
} from "../../themes/colors";

import {
  fetchGarcons,
  createGarcom,
  deleteGarcom,
  fetchQrCodeForGarcom,
} from "../../services/smartcupService";

interface Garcom {
  id: number;
  nome: string;
  token: string;
  criado_em: string;
}

export default function GarconsScreen() {

  const {
    theme,
    toggleTheme,
  } = useContext(ThemeContext);

  const colors =
    theme === "dark"
      ? darkTheme
      : lightTheme;

  const [garcons, setGarcons] =
    useState<Garcom[]>([]);

  const [nome, setNome] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [qrCodeVisible, setQrCodeVisible] =
    useState(false);

  const [qrCodeImage, setQrCodeImage] =
    useState("");

  const [selectedGarcom, setSelectedGarcom] =
    useState<Garcom | null>(null);

  const buscarGarcons =
    useCallback(async () => {

      try {

        const garconsData =
          await fetchGarcons();

        setGarcons(garconsData);

      } catch {

        Alert.alert(
          "Erro",
          "Não foi possível carregar os garçons."
        );

      }

    }, []);

  useEffect(() => {

    buscarGarcons();

  }, [buscarGarcons]);

  async function criarGarcom() {

    if (!nome.trim()) {

      Alert.alert(
        "Erro",
        "Digite o nome do garçom."
      );

      return;
    }

    try {

      setLoading(true);

      await createGarcom(
        nome.trim()
      );

      setNome("");

      await buscarGarcons();

    } catch (error: any) {

      Alert.alert(
        "Erro",
        error.message ||
          "Não foi possível criar o garçom."
      );

    } finally {

      setLoading(false);

    }
  }

  async function removerGarcom(id: number,nomeGarcom: string) {
    const acaoRemover = async () => {
      try {
        await deleteGarcom(id);
        await buscarGarcons();
      } catch {
        if (Platform.OS === "web") alert("Não foi possível remover o garçom.");
        else Alert.alert("Erro", "Não foi possível remover o garçom.");
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm(`Remover acesso de ${nomeGarcom}?`)) {
        await acaoRemover();
      }
    } else {
      Alert.alert("Remover acesso", `Remover acesso de ${nomeGarcom}?`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", style: "destructive", onPress: acaoRemover },
      ]);
    }
  }

  async function verQrCode(garcom: Garcom){
   try {
      setSelectedGarcom(garcom);
      
      let qrcode = await fetchQrCodeForGarcom(garcom.id);
      
      if (Platform.OS !== "web" && qrcode.includes("localhost")) {
        const baseUrl = api.defaults.baseURL;
        qrcode = qrcode.replace("http://localhost:3000", baseUrl);
      }

      setQrCodeImage(qrcode);
      setQrCodeVisible(true);
    } catch {
      if (Platform.OS === "web") alert("Não foi possível carregar o QR Code.");
      else Alert.alert("Erro", "Não foi possível carregar o QR Code.");
    }
  }
 async function copiarLink(garcom: Garcom) {
    const baseUrl = api.defaults.baseURL;
    const link = `${baseUrl}/usuarios/garcons/acesso/${garcom.token}`;

    if (Platform.OS === "web") {
      try {
        await navigator.clipboard.writeText(link);
        alert(`Link de acesso de ${garcom.nome} copiado para a área de transferência.`);
      } catch {
        alert("Erro ao copiar o link.");
      }
    } else {
      Alert.alert("Token de Acesso", `Copie este código para o garçom:\n\n${garcom.token}`
      );
    }
  }
  return (

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
          zIndex: 10,
          justifyContent: "center",
          alignItems: "center",
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

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
        >

          <Image
            source={require("../../../assets/images/back.png")}
            style={[
              styles.backIcon,
              {
                tintColor:
                  colors.primary,
              },
            ]}
          />

        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            {
              color:
                colors.text,
            },
          ]}
        >
          Garçons
        </Text>

      </View>

      <View
        style={[
          styles.divider,
          {
            backgroundColor:
              colors.primary,
          },
        ]}
      />

      <View style={styles.addContainer}>

        <Text
          style={[
            styles.sectionTitle,
            {
              color:
                colors.text,
            },
          ]}
        >
          Adicionar Garçom
        </Text>

        <View
          style={[
            styles.inputRow,
            {
              borderColor:
                colors.primary,
            },
          ]}
        >

          <TextInput
            placeholder="Nome do garçom"
            placeholderTextColor="#999"
            style={[
              styles.input,
              {
                color:
                  colors.text,
                borderColor:
                  colors.primary,
                backgroundColor:
                  colors.card,
              },
            ]}
            value={nome}
            onChangeText={setNome}
          />

          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor:
                  colors.primary,
              },
            ]}
            onPress={criarGarcom}
            disabled={loading}
          >

            {loading ? (

              <ActivityIndicator
                size="small"
              />

            ) : (

              <Text
                style={
                  styles.addButtonText
                }
              >
                +
              </Text>

            )}

          </TouchableOpacity>

        </View>

      </View>

      <Text
        style={[
          styles.sectionTitle,
          {
            color:
              colors.text,

            marginLeft: 20,
          },
        ]}
      >
        Acessos Ativos
      </Text>

      <FlatList
        data={garcons}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            Nenhum garçom cadastrado ainda.
          </Text>
        }
        renderItem={({ item: garcom }: { item: Garcom }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.primary }]}>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardName, { color: colors.text }]}>{garcom.nome}</Text>
              <Text style={[styles.cardDate, { color: colors.secondaryText }]}>
                {new Date(garcom.criado_em).toLocaleDateString("pt-BR")}
              </Text>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]} onPress={() => verQrCode(garcom)}>
                <Text style={styles.actionButtonText}>QR Code</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, styles.linkButton]} onPress={() => copiarLink(garcom)}>
                <Text style={styles.actionButtonText}>Copiar Link</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, styles.removeButton]} onPress={() => removerGarcom(garcom.id, garcom.nome)}>
                <Text style={styles.removeButtonText}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal
        visible={qrCodeVisible}
        transparent
        animationType="fade"
      >

        <View
          style={styles.modalOverlay}
        >

          <View
            style={[
              styles.modalContainer,
              {
                backgroundColor:
                  colors.card,

                borderColor:
                  colors.primary,
              },
            ]}
          >

            <Text
              style={[
                styles.modalTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              {selectedGarcom?.nome}
            </Text>

            <Text
              style={[
                styles.modalSubtitle,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Mostre este QR Code ao garcom para que ele possa acessar o app.
            </Text>

            {qrCodeImage ? (

              <Image
                source={{
                  uri: qrCodeImage,
                }}
                style={styles.qrImage}
                resizeMode="contain"
              />

            ) : (

              <ActivityIndicator
                size="large"
                style={{
                  margin: 40,
                }}
              />

            )}

            {selectedGarcom && (

              <TouchableOpacity
                style={[
                  styles.copyLinkButton,
                  {
                    backgroundColor:
                      colors.primary,
                  },
                ]}
                onPress={() => {

                  copiarLink(
                    selectedGarcom
                  );

                }}
              >

                <Text
                  style={
                    styles.copyLinkText
                  }
                >
                  Copiar Link de Acesso
                </Text>

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

              <Text
                style={[
                  styles.closeButtonText,
                  {
                    color:
                      colors.primary,
                  },
                ]}
              >
                Fechar
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </Modal>

    </View>
  );
}