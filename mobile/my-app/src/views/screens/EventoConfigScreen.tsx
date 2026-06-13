import { useReducer, useState, useContext, useEffect, useCallback } from "react";
import { Text, View, Image, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, Platform, BackHandler } from "react-native";
import CustomButton from "../components/customButton";
import ConfirmLogoutModal from "../components/ConfirmLogoutModal";
import { styles } from "../styles/EventoConfigScreenStyle";
import { router } from "expo-router";
import { EventContext } from "../../context/EventContext";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

import {
  darkTheme,
  lightTheme,
} from "../../themes/colors";

import { api } from "../../services/api";

type State = {
  tables: number;
  limiteAtencao: number;
  zones: number;
  limiteCritico: number;
  volumeCopo: number;
  pesoCopioVazio: number;
};

type Action =
  | { type: "INCREMENT"; field: keyof State }
  | { type: "DECREMENT"; field: keyof State };

const initialState: State = {
  tables: 0,
  limiteAtencao: 60,
  zones: 0,
  limiteCritico: 30,
  volumeCopo: 300,
  pesoCopioVazio: 139,
};

function reducer(state: State, action: Action): State {
  const passo =
    action.field === "limiteAtencao" || action.field === "limiteCritico" ? 5 :
    action.field === "volumeCopo" ? 10 :
    action.field === "pesoCopioVazio" ? 5 : 1;

  switch (action.type) {
    case "INCREMENT": {
      if (action.field === "limiteAtencao" && state.limiteAtencao >= 60) return state;
      if (action.field === "limiteCritico" && state.limiteCritico >= state.limiteAtencao - 5) return state;
      if (action.field === "volumeCopo" && state.volumeCopo >= 1000) return state;
      if (action.field === "pesoCopioVazio" && state.pesoCopioVazio >= 500) return state;
      return { ...state, [action.field]: state[action.field] + passo };
    }
    case "DECREMENT": {
      const minimo =
        action.field === "limiteAtencao" ? Math.max(30, state.limiteCritico + 5) :
        action.field === "limiteCritico" ? 5 :
        action.field === "volumeCopo" || action.field === "pesoCopioVazio" ? 50 : 0;
      return {
        ...state,
        [action.field]: state[action.field] > minimo ? state[action.field] - passo : minimo,
      };
    }
    default:
      return state;
  }
}

export default function ConfigEvento() {

  const { setEventData } =
    useContext(EventContext);

  useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      voltarParaLogin(); 
      return true;
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => subscription.remove();
  }, [])
);

  const { logout } =
    useContext(AuthContext);

  const {
    theme,
    toggleTheme,
  } = useContext(ThemeContext);

  const colors =
    theme === "dark"
      ? darkTheme
      : lightTheme;

  const [state, dispatch] =
    useReducer(
      reducer,
      initialState
    );

  const [eventName, setEventName] =
    useState("");

  const [eventNameError, setEventNameError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    logoutModalVisible,
    setLogoutModalVisible,
  ] = useState(false);

  const [checandoEvento, setChecandoEvento] = useState(true);

  useEffect(() => {
  async function verificarEventoAtivo() {
    try {
      const foiEncerrado = await AsyncStorage.getItem("@evento_encerrado");
      
      if (foiEncerrado === "true") {
        await AsyncStorage.removeItem("@evento_encerrado");
        setChecandoEvento(false);
        return;
      }

      const nomeSalvo = await AsyncStorage.getItem("@nome_evento");
      const response = await api.get("/mesas");
      const listaMesas = response.data?.mesas || response.data;
      
      if (nomeSalvo && Array.isArray(listaMesas) && listaMesas.length > 0) {
        const limiteAtencaoSalvo = await AsyncStorage.getItem("@limite_atencao");
        const limiteCriticoSalvo = await AsyncStorage.getItem("@limite_critico");
        const zonasSalvas = await AsyncStorage.getItem("@qtd_zonas");
        const volumeCopoSalvo = await AsyncStorage.getItem("@volume_copo");
        const pesoCopioVazioSalvo = await AsyncStorage.getItem("@peso_copo_vazio");

        setEventData({
          eventName: nomeSalvo,
          tables: [],
          limiteAtencao: limiteAtencaoSalvo ? Number(limiteAtencaoSalvo) : 60,
          zones: zonasSalvas ? Number(zonasSalvas) : 0,
          limiteCritico: limiteCriticoSalvo ? Number(limiteCriticoSalvo) : 30,
          volumeCopo: volumeCopoSalvo ? Number(volumeCopoSalvo) : 300,
          pesoCopioVazio: pesoCopioVazioSalvo ? Number(pesoCopioVazioSalvo) : 139,
        });

        router.replace("/(tabs)/adm-dash");
      } else {
        setChecandoEvento(false);
      }
    } catch (error) {
      console.log("Nenhum evento ativo ou erro ao conectar:", error);
      setChecandoEvento(false);
    }
  }

  verificarEventoAtivo();
}, []);
  
  function voltarParaLogin() {

    setLogoutModalVisible(true);

  }

  async function confirmarLogout() {

    setLogoutModalVisible(false);

    await logout();

    router.dismissAll();

    router.replace("/");

  }

  const cards = [
    { title: "Mesas", value: `${state.tables}`, field: "tables" },
    { title: "Limite de Atenção (%)", value: `${state.limiteAtencao}%`, field: "limiteAtencao" },
    { title: "Zonas", value: `${state.zones}`, field: "zones" },
    { title: "Limite Crítico (%)", value: `${state.limiteCritico}%`, field: "limiteCritico" },
    { title: "Volume do Copo (ml)", value: `${state.volumeCopo}ml`, field: "volumeCopo" },
    { title: "Peso do Copo Vazio (g)", value: `${state.pesoCopioVazio}g`, field: "pesoCopioVazio" },
  ];

  async function criarEvento() {

    if (!eventName.trim()) {

      setEventNameError(
        "Digite o nome do evento."
      );

      Alert.alert(
        "Erro",
        "Informe o nome do evento."
      );

      return;
    }

    if (state.tables === 0 || state.limiteAtencao === 0 || state.zones === 0 || state.limiteCritico === 0 || state.volumeCopo === 0 || state.pesoCopioVazio === 0) {
      const mensagemErro = "Por favor, configure todos os campos do evento antes de continuar.";
      
      if (Platform.OS === "web") {
        window.alert(mensagemErro);
      } else {
        Alert.alert("Erro", mensagemErro);
      }
      return;
    }

    setEventNameError("");

    try {

      setLoading(true);

      await api.delete("/usuarios/garcons").catch(() => console.log("Sem garçons para limpar"));

      await api.post("/mesas/configurar-evento", {
      qtd_mesas: state.tables,
      qtd_zonas: state.zones,
      limite_atencao: state.limiteAtencao,
      limite_critico: state.limiteCritico,
      volume_copo: state.volumeCopo,
      peso_copo_vazio: state.pesoCopioVazio,
      nome_evento: eventName,
    });

    await AsyncStorage.setItem("@nome_evento", eventName);
    await AsyncStorage.setItem("@limite_atencao", String(state.limiteAtencao));
    await AsyncStorage.setItem("@limite_critico", String(state.limiteCritico));
    await AsyncStorage.setItem("@qtd_zonas", String(state.zones));
    await AsyncStorage.setItem("@volume_copo", String(state.volumeCopo));
    await AsyncStorage.setItem("@peso_copo_vazio", String(state.pesoCopioVazio));

    setEventData({
      eventName,
      tables: [],
      limiteAtencao: state.limiteAtencao,
      zones: state.zones,
      limiteCritico: state.limiteCritico,
      volumeCopo: state.volumeCopo,
      pesoCopioVazio: state.pesoCopioVazio,
    });

    Alert.alert("Sucesso", "O evento e as mesas foram gerados no banco!");
    router.push("/(tabs)/adm-dash");

  } catch (error) {
    console.error(error);
    Alert.alert("Erro", "Não foi possível conectar com o servidor.");
  } finally {
    setLoading(false);
  }
}

if (checandoEvento) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ color: colors.text, marginTop: 10 }}>Sincronizando evento...</Text>
    </View>
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
          style={styles.titleConfig}
        >

          <TouchableOpacity
            style={styles.backButton}
            onPress={voltarParaLogin}
            activeOpacity={0.7}
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
            Configuração do Evento
          </Text>

          <View
            style={styles.titleSpacer}
          />

        </View>

        <View
          style={[
            styles.line,
            {
              backgroundColor:
                colors.primary,
            },
          ]}
        />

        <View
          style={
            styles.createContainer
          }
        >

          <Text
            style={[
              styles.createName,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Nome do evento
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.primary,
              },
            ]}
          >

            <TextInput
              placeholder="Digite o nome do evento"
              placeholderTextColor="#999"
              style={[
                styles.input,
                {
                  color:
                    colors.text,
                },
              ]}
              value={eventName}
              onChangeText={(text) => {

                setEventName(text);

                if (eventNameError) {

                  setEventNameError("");

                }
              }}
            />

          </View>

          {eventNameError ? (

            <Text
              style={styles.errorText}
            >
              {eventNameError}
            </Text>

          ) : null}

        </View>

        <View
          style={
            styles.cardsContainer
          }
        >

          {cards.map((card) => (

            <View
              style={[
                styles.card,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.primary,
                },
              ]}
              key={card.field}
            >

              <Text
                style={[
                  styles.cardTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {card.title}
              </Text>

              <Text
                style={[
                  styles.value,
                  {
                    color:
                      colors.primary,
                  },
                ]}
              >
                {card.value}
              </Text>

              <View
                style={
                  styles.buttonsContainer
                }
              >

                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        colors.primary,
                    },
                  ]}
                  onPress={() =>
                    dispatch({
                      type:
                        "DECREMENT",
                      field:
                        card.field as keyof State,
                    })
                  }
                >

                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    -
                  </Text>

                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        colors.primary,
                    },
                  ]}
                  onPress={() =>
                    dispatch({
                      type:
                        "INCREMENT",
                      field:
                        card.field as keyof State,
                    })
                  }
                >

                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    +
                  </Text>

                </TouchableOpacity>

              </View>

            </View>

          ))}

        </View>

        <CustomButton
          title={
            loading
              ? "Criando..."
              : "Criar"
          }
          width="70%"
          backgroundColor={
            colors.primary
          }
          onPress={criarEvento}
          style={{
            marginBottom: 25,
            alignSelf: "center",
          }}
        />

        <ConfirmLogoutModal
          visible={logoutModalVisible}
          colors={colors}
          onCancel={() =>
            setLogoutModalVisible(false)
          }
          onConfirm={confirmarLogout}
        />

      </View>

    </ScrollView>
  );
}

