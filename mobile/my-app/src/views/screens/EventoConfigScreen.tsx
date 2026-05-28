import { useReducer, useState, useContext, useEffect } from "react";
import { Text, View, Image, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from "react-native";
import CustomButton from "../components/customButton";
import ConfirmLogoutModal from "../components/ConfirmLogoutModal";
import { styles } from "../styles/EventoConfigScreenStyle";
import { router } from "expo-router";
import { EventContext } from "../../context/EventContext";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  darkTheme,
  lightTheme,
} from "../../themes/colors";

import { api } from "../../services/api";

type State = {
  tables: number;
  smartCups: number;
  zones: number;
  waiters: number;
};

type Action =
  | {
      type: "INCREMENT";
      field: keyof State;
    }
  | {
      type: "DECREMENT";
      field: keyof State;
    };

const initialState: State = {
  tables: 0,
  smartCups: 0,
  zones: 0,
  waiters: 0,
};

function reducer(
  state: State,
  action: Action
): State {

  switch (action.type) {

    case "INCREMENT":

      return {
        ...state,
        [action.field]:
          state[action.field] + 1,
      };

    case "DECREMENT":

      return {
        ...state,
        [action.field]:
          state[action.field] > 0
            ? state[action.field] - 1
            : 0,
      };

    default:
      return state;
  }
}

export default function ConfigEvento() {

  const { setEventData } =
    useContext(EventContext);

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

      const response = await api.get("/mesas");
      const listaMesas = response.data?.mesas || response.data;
      
      if (Array.isArray(listaMesas) && listaMesas.length > 0) {
        const nomeSalvo = await AsyncStorage.getItem("@nome_evento");
        setEventData({
          eventName: nomeSalvo || "Evento Ativo",
          tables: [],
          smartCups: state.smartCups,
          zones: state.zones,
          waiters: state.waiters,
        });
        
        router.replace("/(tabs)/adm-dash");
      } else {
        setChecandoEvento(false); //
      }
    } catch (error) {
      console.log("Nenhum evento ativo ou erro ao conectar:", error);
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
    {
      title: "Mesas",
      value: state.tables,
      field: "tables",
    },

    {
      title: "SmartCups",
      value: state.smartCups,
      field: "smartCups",
    },

    {
      title: "Zonas",
      value: state.zones,
      field: "zones",
    },

    {
      title: "Garçons por zona",
      value: state.waiters,
      field: "waiters",
    },
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

    setEventNameError("");

    try {

      setLoading(true);

      await api.delete(
        "/usuarios/garcons"
      );

      await api.post("/mesas/configurar-evento", {
      qtd_mesas: state.tables,
      qtd_zonas: state.zones
    });

    await AsyncStorage.setItem("@nome_evento", eventName)

    setEventData({
      eventName,
      tables: [], 
      smartCups: state.smartCups,
      zones: state.zones,
      waiters: state.waiters,
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

