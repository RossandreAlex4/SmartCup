import { useState, useCallback, useContext, useRef } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

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
  zona?: string;
  online?: number;
  ultimo_acesso?: string;
  avatar?: string | null;
}

function statusGarcom(garcom: Garcom): { label: string; cor: string } {
  if (garcom.online === 1) return { label: "Online", cor: "#0fce52" };
  if (!garcom.ultimo_acesso) return { label: "Nunca entrou", cor: "#888" };
  const diffMin = Math.floor((Date.now() - new Date(garcom.ultimo_acesso).getTime()) / 60000);
  let label: string;
  if (diffMin < 1) label = "Visto agora";
  else if (diffMin < 60) label = `Visto há ${diffMin} min`;
  else if (diffMin < 1440) label = `Visto há ${Math.floor(diffMin / 60)}h`;
  else label = `Visto há ${Math.floor(diffMin / 1440)}d`;
  return { label, cor: "#888" };
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

  const [avatar, setAvatar] =
    useState<string | null>(null);

  async function escolherFoto() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  }

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

  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useFocusEffect(
    useCallback(() => {
      buscarGarcons();
      intervaloRef.current = setInterval(buscarGarcons, 8000);
      return () => {
        if (intervaloRef.current) clearInterval(intervaloRef.current);
      };
    }, [buscarGarcons])
  );

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
        nome.trim(),
        avatar
      );

      setNome("");
      setAvatar(null);

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

          <TouchableOpacity onPress={escolherFoto} style={{width: 44, height: 44, borderRadius: 22, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginRight: 10}}>
             {avatar ? <Image source={{uri: avatar}} style={{width: 44, height: 44}} /> : <Ionicons name="camera" size={24} color={colors.primary} />}
          </TouchableOpacity>

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
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: statusGarcom(garcom).cor }} />
                {garcom.avatar ? (
                  <Image source={{uri: garcom.avatar}} style={{width: 24, height: 24, borderRadius: 12}} />
                ) : (
                  <Ionicons name="person-circle-outline" size={24} color={colors.primary} />
                )}
                <Text style={[styles.cardName, { color: colors.text }]}>{garcom.nome}</Text>
              </View>
              <Text style={[styles.cardDate, { color: statusGarcom(garcom).cor, fontSize: 11 }]}>
                {statusGarcom(garcom).label}
              </Text>
              <Text style={[styles.cardDate, { color: colors.secondaryText }]}>
                {new Date(garcom.criado_em).toLocaleDateString("pt-BR")} | Zona: {garcom.zona || "Nenhuma"}
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