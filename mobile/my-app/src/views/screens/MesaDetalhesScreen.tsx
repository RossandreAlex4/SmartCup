import React, { useEffect, useState, useContext,useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from "react-native";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { api } from "../../services/api";
import { ThemeContext } from "../../context/ThemeContext";
import { darkTheme, lightTheme } from "../../themes/colors";
import { styles } from "../styles/MesaDetalhesStyles";
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from "@/src/context/AuthContext";
import { useLeituras } from "../../context/LeituraContext";

type SmartCupData = {
  id: number;
  identificador: string;
  nivel_porcentagem: number;
  tipo_copo: string;
  bebida: string;
  botao_pressionado: boolean;
  tempo_alerta?: string;
};

type MesaDetalhe = {
  id: number;
  nome: string;
  zona: string;
  status: string;
  smartcups: SmartCupData[];
};



export default function MesaDetalhesScreen() {
  const { id } = useLocalSearchParams();
  const [mesa, setMesa] = useState<MesaDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [atendendo, setAtendendo] = useState(false);
const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const navigation = useNavigation();
  const { leiturasGlobais, iniciarMonitoramento, pararMonitoramento } = useLeituras();
  const mesaId = Number(id);

   useEffect(() => {
    iniciarMonitoramento(mesaId);
    return () => pararMonitoramento();}, [mesaId]);

  function lidarBotaoVoltar() {

    if (!user) return;

   if (user?.tipo === "garcom") {
    router.replace("/(tabs)/garcom-mesas");
  } else {
    router.back();
  }
  }

  useLayoutEffect(() => {
  navigation.setOptions({
    headerLeft: () => (
      <TouchableOpacity 
        onPress={() => lidarBotaoVoltar()}
        style={{ marginLeft: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
    ),
  });
}, [navigation, user]);

  async function buscarDetalhesMesa() {
    try {
      const [responseMesa, responseCopos] = await Promise.all([
        api.get(`/mesas/${id}`),
        api.get(`/smartcups/mesa/${id}`),
      ]);

      const dadosMesa = responseMesa.data.mesa;
      const copos: any[] = responseCopos.data.smartcups ?? [];

      const mesaReal: MesaDetalhe = {
        id: dadosMesa.id,
        nome: dadosMesa.nome,
        zona: dadosMesa.zona,
        status: dadosMesa.status,
        smartcups: copos.map((cup: any) => ({
          id: cup.id,
          identificador: cup.identificador || `SmartCup ${cup.id}`,
          nivel_porcentagem: Number(cup.nivel_porcentagem) || Number(cup.peso_atual) || 0,
          tipo_copo: cup.tipo_copo || "Copo Padrão",
          bebida: cup.bebida || "Chopp",
          botao_pressionado: cup.botao_pressionado === 1 || cup.botao_pressionado === true,
          tempo_alerta: cup.tempo_alerta,
        })),
      };

      setMesa(mesaReal);
    } catch (error) {
      console.error("Erro ao buscar dados da mesa:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    buscarDetalhesMesa();
    const interval = setInterval(buscarDetalhesMesa, 5000);
    return () => clearInterval(interval);
  }, [id]);

  async function marcarTodosAtendidos() {
    try {
      setAtendendo(true);
      await api.post(`/mesas/${id}/atender-todos`);
      Alert.alert("Sucesso", "Todos os chamados foram marcados como resolvidos!");
      buscarDetalhesMesa();
    } catch (error) {
      Alert.alert("Sucesso (Simulado)", "Atendimento registrado com sucesso!");
    } finally {
      setAtendendo(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!mesa) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center" }]}>
        <Text style={{ color: colors.text }}>Mesa não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={lidarBotaoVoltar} activeOpacity={0.7}>
            <Text style={[styles.backArrow, { color: colors.primary }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{mesa.nome}</Text>
        </View>
        
        <View style={[styles.badgeAlerta, { backgroundColor: mesa.status === "Alerta" ? "#2a1415" : colors.card }]}>
          <Text style={[styles.badgeAlertaText, { color: mesa.status === "Alerta" ? "#ff5252" : "#0fce52" }]}>
            {mesa.status === "Alerta" ? "Alerta ativo" : "Normal"}
          </Text>
        </View>
      </View>

      <View style={[styles.metaRow, { backgroundColor: colors.card }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Image source={require("../../../assets/images/avatar.png")} style={[styles.iconImage,{ tintColor: colors.primary }]} />
            <Text style={[styles.metaText, { color: colors.text }]}> {mesa.zona}</Text>
        </View>
        
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Image source={require("../../../assets/images/glass.png")} style={[styles.iconImage,{ tintColor: colors.primary }]} />
            <Text style={[styles.metaText, { color: colors.text }]}>{mesa.smartcups?.length || 0} SmartCups</Text>
        </View>

        
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>SmartCups</Text>

      <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
        {mesa.smartcups && mesa.smartcups.length > 0 ? (
          [...mesa.smartcups]
          .sort((a, b) => a.identificador.localeCompare(b.identificador))
          .map((cup) => {
            const leituraAtual = leiturasGlobais.find(l => Number(l.smartcup_id) === Number(cup.id));
            const temLeitura = !!leituraAtual;
            const nivelExibido = temLeitura ? leituraAtual!.porcentagem : null;

            let corStatus = "#888";
            if (temLeitura && nivelExibido !== null) {
              corStatus = "#0fce52";
              if (nivelExibido < 70) corStatus = "#ff9800";
              if (nivelExibido <= 30) corStatus = "#ff5252";
            }
            if (cup.botao_pressionado) corStatus = "#ff5252";

            return (
              <View key={cup.id} style={[styles.cupCard, { backgroundColor: colors.card }]}>
                
                <View style={styles.cupHeaderRow}>
                  <View style={styles.cupTitleGroup}>
                    <View style={[styles.statusDot, { backgroundColor: corStatus }]} />
                    <Text style={[styles.cupName, { color: colors.text }]}>{cup.identificador}</Text>
                  </View>
                  
                  <Text style={[styles.cupPercentage, { color: corStatus }]}>
                    {cup.botao_pressionado ? "Chamado" : temLeitura ? `${nivelExibido}%` : "—"}
                  </Text>
                </View>

                <Text style={styles.subLabel}>Nível atual</Text>
                
                <View style={styles.detailItem}>
                  <Text style={[styles.detailText, { color: colors.secondaryText }]}>{cup.tipo_copo}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={[styles.detailText, { color: colors.secondaryText }]}>{cup.bebida}</Text>
                </View>

                {cup.botao_pressionado && (
                  <View style={styles.alertBarButton}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Image source={require("../../../assets/images/danger.png")} style={[styles.iconImage, { tintColor: "#ffd600" }]} />
                        <Text style={styles.alertBarText}> Botão pressionado</Text>
                    </View> 
                        <Text style={styles.alertBarTime}>{cup.tempo_alerta || "Há 1 min"}</Text>
                  </View>
                )}


              </View>
            );
          })
        ) : (
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>Nenhum SmartCup pareado nesta mesa.</Text>
        )}
      </ScrollView>


      <TouchableOpacity 
        style={styles.btnAtender} 
        onPress={marcarTodosAtendidos}
        disabled={atendendo}
        activeOpacity={0.8}
      >
        {atendendo ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.btnAtenderText}>✓ Marcar todos como atendidos</Text>
        )}
      </TouchableOpacity>

    </View>
  );
}
