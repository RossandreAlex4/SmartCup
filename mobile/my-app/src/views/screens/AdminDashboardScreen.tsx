import { Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { styles } from "../styles/AdminDashboardScreenStyles";
import { router } from "expo-router";
import { useContext,useState, useEffect } from "react";
import { EventContext } from "../../context/EventContext";
import { ThemeContext } from "../../context/ThemeContext";
import {
  darkTheme,
  lightTheme,
} from "../../themes/colors";
import { api } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Mesa = {
  id: number;
  nome: string;
  zona: string;
  status: string;
};

export default function AdmDash() {

const [mesas, setMesas] = useState<Mesa[]>([]);
const [loading, setLoading] = useState(true);
const { eventData, setEventData } = useContext(EventContext);


  const {
    theme,
    toggleTheme,
  } = useContext(ThemeContext);

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

        if (!eventData.eventName) {
          const nomeSalvo = await AsyncStorage.getItem("@nome_evento");
          if (nomeSalvo) {
            setEventData((prev) => ({
              ...prev,
              eventName: nomeSalvo,
            }));
          }
        }
      } catch (error) {
        console.error("Erro ao buscar mesas:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const colors =
    theme === "dark"
      ? darkTheme
      : lightTheme;

  const stats = [
    {
      label: "Mesas",
      value: mesas.length,
    },
    {
      label: "SmartCups",
      value: eventData.smartCups,
    },
    {
      label: "Zonas",
      value: eventData.zones,
    },
    {
      label: "Garçons",
      value: eventData.waiters,
    },
  ];
async function encerrarEvento() {
  Alert.alert(
    "Encerrar Evento",
    "Deseja realmente encerrar este evento? Isso apagará as mesas atuais.",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim, Encerrar",
        style: "destructive",
        onPress: async () => {
          try { 
            setLoading(true); 

            await AsyncStorage.setItem("@evento_encerrado", "true");

            await api.post("/mesas/configurar-evento", {
              qtd_mesas: 0,
              qtd_zonas: 0
            }).catch(() => console.log("Apenas limpando o banco local"));

            await AsyncStorage.removeItem("@nome_evento");
            
            router.replace("/evento-config");
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        }
      }
    ]
  );
}

  return (

    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      style={{
        backgroundColor:
          colors.background,
      }}
    >

      <View
        style={[
          styles.container,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >

        <View style={styles.titleConfig}>

          <TouchableOpacity
            style={styles.backButton}onPress={encerrarEvento}>

            <Image
              source={require("../../../assets/images/back.png")}
              style={[
                styles.image,
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
            Dashboard
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Evento: {eventData.eventName || "Carregando..."}
          </Text>

        </View>

        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <Image
            source={require("../../../assets/images/themes.png")}
            style={[
              styles.themeIcon,
              {
                tintColor: colors.primary,
              },
            ]}
          />
        </TouchableOpacity>

        <View
          style={[
            styles.line,
            {
              backgroundColor:
                colors.primary,
            },
          ]}
        />

        <View style={styles.statsContainer}>

          {stats.map((item) => (

            <View
              key={item.label}
              style={[
                styles.statsCard,
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
                  styles.value,
                  {
                    color:
                      colors.primary,
                  },
                ]}
              >
                {item.value}
              </Text>

              <Text
                style={[
                  styles.label,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {item.label}
              </Text>

            </View>

          ))}

        </View>

        <View style={styles.createContainer}>

          <Text
            style={[
              styles.overview,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Visão geral das mesas
          </Text>

        </View>

       {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.cardsContainer}>
            {mesas.map((table) => (
              <View key={table.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.primary }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{table.nome}</Text>
                <Text style={[styles.cardStatus, { color: table.status === "Livre" || table.status === "Ativa" ? "#0fce52" : "#ff5252" }]}>
                  {table.status}
                </Text>
              </View>
            ))}
          </View>
        )}

      </View>
    </ScrollView>
  );
}
