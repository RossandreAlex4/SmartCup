import React, { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { api } from "../../services/api";
import { ThemeContext } from "../../context/ThemeContext";
import { darkTheme, lightTheme } from "../../themes/colors";
import { styles } from "../styles/MesaDetalhesStyles";

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

  const { theme } = useContext(ThemeContext);
  const colors = theme === "dark" ? darkTheme : lightTheme;

  function lidarBotaoVoltar() {
    router.push("/adm-dash");
  }

  async function buscarDetalhesMesa() {
    try {
      const response = await api.get(`/mesas/${id}`);
      if (response.data) {
        const dadosDaMesa = response.data;

        const mesaSimulada: MesaDetalhe = {
          id: dadosDaMesa.id,
          nome: dadosDaMesa.nome,
          zona: dadosDaMesa.zona || "A",
          status: dadosDaMesa.status,
          smartcups: [
            {
              id: 1,
              identificador: "SmartCup 01",
              nivel_porcentagem: 75,
              tipo_copo: "Copo Padrão",
              bebida: "Chopp",
              botao_pressionado: false,
            },
            {
              id: 2,
              identificador: "SmartCup 02",
              nivel_porcentagem: 20,
              tipo_copo: "Copo Padrão",
              bebida: "Chopp",
              botao_pressionado: false,
            },
            {
              id: 3,
              identificador: "SmartCup 03",
              nivel_porcentagem: 90,
              tipo_copo: "Copo Padrão",
              bebida: "Chopp",
              botao_pressionado: true,
            },
            {
              id: 4,
              identificador: "SmartCup 04",
              nivel_porcentagem: 50,
              tipo_copo: "Copo Padrão",
              bebida: "Chopp",
              botao_pressionado: false,
            },
          ],
        };

        setMesa(mesaSimulada);
      }
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
        
        <View style={[styles.badgeAlerta, { backgroundColor: mesa.status === "Alerta" ? "#2a1415" : "#142a15" }]}>
          <Text style={[styles.badgeAlertaText, { color: mesa.status === "Alerta" ? "#ff5252" : "#0fce52" }]}>
            {mesa.status === "Alerta" ? "Alerta ativo" : "Normal"}
          </Text>
        </View>
      </View>

      <View style={[styles.metaRow, { backgroundColor: colors.card }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Image source={require("../../../assets/images/avatar.png")} style={[styles.iconImage,{ tintColor: colors.primary }]} />
            <Text style={[styles.metaText, { color: colors.text }]}> Zona {mesa.zona}</Text>
        </View>
        
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Image source={require("../../../assets/images/glass.png")} style={[styles.iconImage,{ tintColor: colors.primary }]} />
            <Text style={[styles.metaText, { color: colors.text }]}>{mesa.smartcups?.length || 0} SmartCups</Text>
        </View>

        
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>SmartCups</Text>

      <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
        {mesa.smartcups && mesa.smartcups.length > 0 ? (
          mesa.smartcups.map((cup) => {
            let corStatus = "#0fce52";
            if (cup.nivel_porcentagem <= 25) corStatus = "#ffd600";
            if (cup.botao_pressionado) corStatus = "#ff5252";

            return (
              <View key={cup.id} style={[styles.cupCard, { backgroundColor: colors.card }]}>
                
                <View style={styles.cupHeaderRow}>
                  <View style={styles.cupTitleGroup}>
                    <View style={[styles.statusDot, { backgroundColor: corStatus }]} />
                    <Text style={[styles.cupName, { color: colors.text }]}>{cup.identificador}</Text>
                  </View>
                  
                  <Text style={[styles.cupPercentage, { color: corStatus }]}>
                    {cup.botao_pressionado ? "Chamado" : `${cup.nivel_porcentagem}%`}
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

                {!cup.botao_pressionado && cup.nivel_porcentagem <= 25 && (
                  <View style={styles.alertBarLow}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Image source={require("../../../assets/images/danger.png")} style={[styles.iconImage, { tintColor: "#ffd600" }]} />
                        <Text style={styles.alertBarText}> Bebida baixa</Text>
                    </View>                    
                    <Text style={styles.alertBarTime}>{cup.tempo_alerta || "Há 2 min"}</Text>
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