import { Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from "react-native";
import { styles } from "../styles/AdminDashboardScreenStyles";
import { router } from "expo-router";
import { useContext,useState, useEffect } from "react";
import { EventContext } from "../../context/EventContext";
import { ThemeContext } from "../../context/ThemeContext";
import {darkTheme,lightTheme,} from "../../themes/colors";
import { api } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConfirmLogoutModal from "../components/ConfirmLogoutModal";
import { useBackHandlerModal } from "../../hooks/useBackHandlerModal";


type Mesa = {
  id: number;
  nome: string;
  zona: string;
  status: string;

  totalCopos?: number;
  totalAlertas?: number;
  percentualMedio?: number;
};

export default function AdmDash() {

const [mesas, setMesas] = useState<Mesa[]>([]);
const [loading, setLoading] = useState(true);
const { eventData, setEventData } = useContext(EventContext);
const [modalVisivel, setModalVisivel] = useState(false);
const {theme,toggleTheme,} = useContext(ThemeContext);
const { user, loading: authLoading, logout } = useContext(AuthContext);
useBackHandlerModal(() => {setModalVisivel(true);});


 useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        
        const response = await api.get("/mesas");
        let mesasApi = [];
   
        if (response.data && response.data.mesas) {
          mesasApi = response.data.mesas;
        } else if (Array.isArray(response.data)) {
          mesasApi = response.data;
        }
        
        try {
          const responseCopos = await api.get("/smartcups");
        
          const smartcups = Array.isArray(responseCopos.data)
            ? responseCopos.data
            : responseCopos.data?.smartcups || [];
        
          const mesasComResumo = mesasApi.map((mesa: any) => {
        
            const coposMesa = smartcups.filter(
              (cup: any) => Number(cup.mesa_id) === Number(mesa.id)
            );
        
            const alertas = coposMesa.filter((cup: any) => {
        
              const nivel =
                Number(cup.nivel_porcentagem) ||
                Number(cup.peso_atual) ||
                0;
        
              return (
                cup.botao_pressionado === true ||
                cup.botao_pressionado === 1 ||
                nivel <= 25
              );
            });

            const somaPercentuais = coposMesa.reduce(
              (acc: number, cup: any) =>
                acc +
                (
                  Number(cup.nivel_porcentagem) ||
                  Number(cup.peso_atual) ||
                  0
                ),
              0
            );
          
            const percentualMedio =
              coposMesa.length > 0
                ? Math.round(
                    somaPercentuais / coposMesa.length
                  )
                : 0;
        
            return {
              ...mesa,
              totalCopos: coposMesa.length,
              totalAlertas: alertas.length,
              percentualMedio,
            };
          });
        
          setMesas(mesasComResumo);
        
        } catch {
          setMesas(mesasApi);
        }

        const nomeSalvo = await AsyncStorage.getItem("@nome_evento");

        if (!nomeSalvo) {
          router.replace("/evento-config");
          return;
        }

        const volumeSalvo = await AsyncStorage.getItem("@volume_copo");
        const pesoCopoVazioSalvo = await AsyncStorage.getItem("@peso_copo_vazio");
        const zonasSalvas = await AsyncStorage.getItem("@qtd_zonas");

        

        if (nomeSalvo) {
          setEventData({
            eventName: nomeSalvo,
            tables: [],
            volumeCopo: volumeSalvo ? Number(volumeSalvo) : 0,
            pesoCopoVazio: pesoCopoVazioSalvo ? Number(pesoCopoVazioSalvo) : 0,
            zones: zonasSalvas ? Number(zonasSalvas) : 0,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar mesas:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  useEffect(() => {
    console.log("Estado atual do usuário:", user);
    if (!authLoading && user?.tipo === "garcom") {
      router.replace("/garcom-dash");
    }
  }, [user, authLoading]);

  if (authLoading || user?.tipo === "garcom") {
    return (
      <View style={{ flex: 1, backgroundColor: "#121212", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF9000" />
      </View>
    );
  }


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
      label: "Volume do copo",
      value: eventData.volumeCopo ? `${eventData.volumeCopo} ml` : "Não configurado"
    },
    {
      label: "Zonas",
      value: eventData.zones,
    },
    {
      label: "Peso do copo vazio",
      value: eventData.pesoCopoVazio ? `${eventData.pesoCopoVazio} g` : "Não configurado"
    },
  ];
async function encerrarEvento() {
  try {
      setModalVisivel(false);
      setLoading(true); 

      await AsyncStorage.setItem("@evento_encerrado", "true");
      await AsyncStorage.removeItem("@nome_evento");
      await AsyncStorage.removeItem("@volume_copo");
      await AsyncStorage.removeItem("@peso_copo_vazio");
      await AsyncStorage.removeItem("@qtd_zonas");

      await api.post("/mesas/configuracoes/reset");

      await logout();

      router.replace("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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
            style={styles.backButton}
            onPress={() => {
              if (Platform.OS === "web") {
      const confirmar = window.confirm("Deseja mesmo encerrar o evento?");
      if (confirmar) encerrarEvento();
    } else {
     setModalVisivel(true)
    }
  }}
>
            
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
                  <Text
                    style={[
                      styles.cardTitle,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {table.nome}
                  </Text>
                  
                  <View style={{ marginTop: 8 }}>
                  
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Image
                        source={require("../../../assets/images/danger.png")}
                        style={{
                          width: 16,
                          height: 16,
                          tintColor:
                            (table.totalAlertas || 0) > 0
                              ? "#ff5252"
                              : "#0fce52",
                        }}
                      />
                  
                      <Text
                        style={[
                          styles.cardStatus,
                          {
                            color:
                              (table.totalAlertas || 0) > 0
                                ? "#ff5252"
                                : "#0fce52",
                            marginTop: 0,
                          },
                        ]}
                      >
                        {(table.totalAlertas || 0) > 0
                          ? `${table.totalAlertas} alerta(s)`
                          : "Normal"}
                      </Text>
                    </View>
                  
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 6,
                      }}
                    >
                      <Image
                        source={require("../../../assets/images/glass.png")}
                        style={{
                          width: 16,
                          height: 16,
                          tintColor: colors.secondaryText,
                        }}
                      />
                  
                      <Text
                        style={{
                          color: colors.secondaryText,
                          fontSize: 12,
                        }}
                      >
                        {table.totalCopos || 0} SmartCup(s)
                      </Text>
                    </View>
                  
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 6,
                      }}
                    >
                      <Image
                        source={require("../../../assets/images/segmentation.png")}
                        style={{
                          width: 16,
                          height: 16,
                          tintColor:
                            (table.percentualMedio || 0) <= 25
                              ? "#ff5252"
                              : (table.percentualMedio || 0) <= 50
                              ? "#ffd600"
                              : "#0fce52",
                        }}
                      />
                  
                      <Text
                        style={{
                          color:
                            (table.percentualMedio || 0) <= 25
                              ? "#ff5252"
                              : (table.percentualMedio || 0) <= 50
                              ? "#ffd600"
                              : "#0fce52",
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        Média: {table.percentualMedio || 0}%
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

      </View>
    </ScrollView>
  {}
    <ConfirmLogoutModal 
      visible={modalVisivel}
      colors={colors}
      onCancel={() => setModalVisivel(false)}
       onConfirm={encerrarEvento}
    />
  </> 
  );
}
    

