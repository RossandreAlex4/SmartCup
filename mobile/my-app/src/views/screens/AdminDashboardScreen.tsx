import { Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from "react-native";
import { styles } from "../styles/AdminDashboardScreenStyles";
import { router } from "expo-router";
import { useContext, useState, useEffect, useRef, useCallback } from "react";
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
  percentualMedio?: number | null;
};

export default function AdmDash() {

const [mesas, setMesas] = useState<Mesa[]>([]);
const [loading, setLoading] = useState(true);
const { eventData, setEventData } = useContext(EventContext);
const [modalVisivel, setModalVisivel] = useState(false);
const {theme,toggleTheme,} = useContext(ThemeContext);
const { user, loading: authLoading, logout } = useContext(AuthContext);
useBackHandlerModal(() => {setModalVisivel(true);});

const mesasBaseRef = useRef<any[]>([]);
const smartcupsRef = useRef<any[]>([]);

const atualizarDadosAoVivo = useCallback(async () => {
    if (mesasBaseRef.current.length === 0) return;
    try {
      const [resAlertas, resLeituras] = await Promise.all([
        api.get("/alertas"),
        api.get("/leituras/recentes"),
      ]);
      const alertasAtivos: any[] = resAlertas.data?.alertas || [];
      const leiturasRecentes: any[] = resLeituras.data?.leituras || [];

      const mesasAtualizadas = mesasBaseRef.current.map((mesa: any) => {
        const totalAlertas = alertasAtivos.filter(
          (a: any) => Number(a.mesa_id) === Number(mesa.id)
        ).length;
        const leiturasMesa = leiturasRecentes.filter(
          (l: any) => Number(l.mesa_id) === Number(mesa.id)
        );
        const percentualMedio =
          leiturasMesa.length > 0
            ? Math.round(
                leiturasMesa.reduce((acc: number, l: any) => acc + Number(l.porcentagem), 0) /
                  leiturasMesa.length
              )
            : null;
        return { ...mesa, totalAlertas, percentualMedio };
      });

      setMesas(mesasAtualizadas);
    } catch {}
  }, []);

 useEffect(() => {
    async function carregarDados() {
      if (!user || user.tipo !== "admin") return;

      try {
        setLoading(true);

        const statusResp = await api.get("/mesas/status-evento");
        if (!statusResp.data?.ativo) {
          await AsyncStorage.multiRemove([
            "@nome_evento", "@limite_atencao", "@limite_critico",
            "@qtd_zonas", "@volume_copo", "@peso_copo_vazio",
          ]);
          router.replace("/evento-config");
          return;
        }

        const response = await api.get("/mesas");
        let mesasApi: any[] = [];
        if (response.data && response.data.mesas) {
          mesasApi = response.data.mesas;
        } else if (Array.isArray(response.data)) {
          mesasApi = response.data;
        }

        const [resCopos, resAlertas, resLeituras] = await Promise.all([
          api.get("/smartcups"),
          api.get("/alertas"),
          api.get("/leituras/recentes"),
        ]);

        const smartcups = Array.isArray(resCopos.data)
          ? resCopos.data
          : resCopos.data?.smartcups || [];

        const alertasAtivos: any[] = resAlertas.data?.alertas || [];
        const leiturasRecentes: any[] = resLeituras.data?.leituras || [];

        const mesasComResumo = mesasApi.map((mesa: any) => {
          const coposMesa = smartcups.filter(
            (cup: any) => Number(cup.mesa_id) === Number(mesa.id)
          );
          const totalAlertas = alertasAtivos.filter(
            (a: any) => Number(a.mesa_id) === Number(mesa.id)
          ).length;
          const leiturasMesa = leiturasRecentes.filter(
            (l: any) => Number(l.mesa_id) === Number(mesa.id)
          );
          const percentualMedio =
            leiturasMesa.length > 0
              ? Math.round(
                  leiturasMesa.reduce((acc: number, l: any) => acc + Number(l.porcentagem), 0) /
                    leiturasMesa.length
                )
              : null;
          return { ...mesa, totalCopos: coposMesa.length, totalAlertas, percentualMedio };
        });

        mesasBaseRef.current = mesasComResumo;
        smartcupsRef.current = smartcups;
        setMesas(mesasComResumo);

        const nomeSalvo = await AsyncStorage.getItem("@nome_evento");
        if (!nomeSalvo) {
          router.replace("/evento-config");
          return;
        }

        const limiteAtencaoSalvo = await AsyncStorage.getItem("@limite_atencao");
        const limiteCriticoSalvo = await AsyncStorage.getItem("@limite_critico");
        const zonasSalvas = await AsyncStorage.getItem("@qtd_zonas");
        const volumeCopoSalvo = await AsyncStorage.getItem("@volume_copo");
        const pesoCopioVazioSalvo = await AsyncStorage.getItem("@peso_copo_vazio");

        setEventData({
          eventName: nomeSalvo,
          tables: [],
          limiteAtencao: limiteAtencaoSalvo ? Number(limiteAtencaoSalvo) : 60,
          limiteCritico: limiteCriticoSalvo ? Number(limiteCriticoSalvo) : 30,
          zones: zonasSalvas ? Number(zonasSalvas) : 0,
          volumeCopo: volumeCopoSalvo ? Number(volumeCopoSalvo) : 300,
          pesoCopioVazio: pesoCopioVazioSalvo ? Number(pesoCopioVazioSalvo) : 139,
        });
      } catch (error) {
        console.error("Erro ao buscar mesas:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
    const intervalo = setInterval(atualizarDadosAoVivo, 8000);
    return () => clearInterval(intervalo);
  }, [atualizarDadosAoVivo]);

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
    { label: "Mesas", value: mesas.length },
    { label: "Limite Atenção", value: `${eventData.limiteAtencao}%` },
    { label: "Zonas", value: eventData.zones },
    { label: "Limite Crítico", value: `${eventData.limiteCritico}%` },
    { label: "Volume do Copo", value: `${eventData.volumeCopo}ml` },
    { label: "Peso Copo Vazio", value: `${eventData.pesoCopioVazio}g` },
  ];
async function encerrarEvento() {
  try {
      setModalVisivel(false);
      setLoading(true); 

      await AsyncStorage.setItem("@evento_encerrado", "true");
      await AsyncStorage.removeItem("@nome_evento");
      await AsyncStorage.removeItem("@limite_atencao");
      await AsyncStorage.removeItem("@limite_critico");
      await AsyncStorage.removeItem("@qtd_zonas");
      await AsyncStorage.removeItem("@volume_copo");
      await AsyncStorage.removeItem("@peso_copo_vazio");

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
                            table.percentualMedio == null
                              ? "#888"
                              : table.percentualMedio <= 25
                              ? "#ff5252"
                              : table.percentualMedio <= 50
                              ? "#ffd600"
                              : "#0fce52",
                        }}
                      />

                      <Text
                        style={{
                          color:
                            table.percentualMedio == null
                              ? "#888"
                              : table.percentualMedio <= 25
                              ? "#ff5252"
                              : table.percentualMedio <= 50
                              ? "#ffd600"
                              : "#0fce52",
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        {table.percentualMedio == null ? "Média: —" : `Média: ${table.percentualMedio}%`}
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
    

