import { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, BackHandler } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { api } from "../../services/api";
import { ThemeContext } from "../../context/ThemeContext";
import { darkTheme, lightTheme } from "../../themes/colors";
import { styles } from "../styles/MesasGarçomScreenStyles";

export default function GarcomMesas() {
  const { theme } = useContext(ThemeContext);
  const colors = theme === "dark" ? darkTheme : lightTheme;
  
  const [mesas, setMesas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace("/(tabs)/garcom-dash");
        return true; 
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const response = await api.get("/mesas");
        
        if (response.data && response.data.mesas) {
          setMesas(response.data.mesas);
        } else if (Array.isArray(response.data)) {
          setMesas(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar mesas para o garçom:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Mesas Abertas</Text>
          <Text style={{ color: colors.secondaryText }}>Selecione uma mesa para ver detalhes</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.cardsContainer}>
            {mesas.map((table) => (
              <TouchableOpacity 
                key={table.id} 
                activeOpacity={0.7}
                onPress={() => {
                  router.push({
                    pathname: "/mesaDetalhes",
                    params: { id: table.id }
                  });
                }}
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.primary }]}
              >
                <Text style={[styles.cardTitle, { color: colors.text }]}>{table.nome}</Text>
                <Text style={{ color: colors.secondaryText, marginTop: 4 }}>Toque para abrir</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </View>
    </ScrollView>
  );
}