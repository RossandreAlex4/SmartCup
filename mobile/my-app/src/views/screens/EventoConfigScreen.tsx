import { useReducer, useState, useContext } from "react";
import { Text, View, Image, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from "react-native";
import CustomButton from "../components/customButton";
import { styles } from "../styles/EventoConfigScreenStyle";
import { router } from "expo-router";
import { EventContext } from "../../context/EventContext";
import { api } from "../../services/api";

type State = {
  tables: number;
  smartCups: number;
  zones: number;
  waiters: number;
};

type Action =
  | { type: "INCREMENT"; field: keyof State }
  | { type: "DECREMENT"; field: keyof State };

const initialState: State = {
  tables: 0,
  smartCups: 0,
  zones: 0,
  waiters: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, [action.field]: state[action.field] + 1 };
    case "DECREMENT":
      return {
        ...state,
        [action.field]: state[action.field] > 0 ? state[action.field] - 1 : 0,
      };
    default:
      return state;
  }
}

export default function ConfigEvento() {
  const { setEventData } = useContext(EventContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(false);

  const cards = [
    { title: "Mesas", value: state.tables, field: "tables" },
    { title: "SmartCups", value: state.smartCups, field: "smartCups" },
    { title: "Zonas", value: state.zones, field: "zones" },
    { title: "Garcons por zona", value: state.waiters, field: "waiters" },
  ];

  async function criarEvento() {
    if (!eventName.trim()) {
      Alert.alert("Erro", "Informe o nome do evento.");
      return;
    }
    try {
      setLoading(true);
      await api.delete("/usuarios/garcons");
      const tablesArray = Array.from({ length: state.tables }, (_, index) => ({
        id: index + 1,
        status: "Livre",
      }));
      setEventData({
        eventName,
        tables: tablesArray,
        smartCups: state.smartCups,
        zones: state.zones,
        waiters: state.waiters,
      });
      router.push("/(tabs)/adm-dash" as any);
    } catch {
      Alert.alert("Erro", "Nao foi possivel iniciar o evento. Verifique a conexao com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.titleConfig}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Image
              source={require("../../../assets/images/back.png")}
              style={styles.image}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Configuracao do Evento</Text>
        </View>

        <View style={styles.line} />

        <View style={styles.createContainer}>
          <Text style={styles.createName}>Nome do evento</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Digite o nome do evento"
              placeholderTextColor="#999"
              style={styles.input}
              value={eventName}
              onChangeText={setEventName}
            />
          </View>
        </View>

        <View style={styles.cardsContainer}>
          {cards.map((card) => (
            <View style={styles.card} key={card.field}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.value}>{card.value}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    dispatch({ type: "DECREMENT", field: card.field as keyof State })
                  }
                >
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    dispatch({ type: "INCREMENT", field: card.field as keyof State })
                  }
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <CustomButton
          title={loading ? "Criando..." : "Criar"}
          width="70%"
          backgroundColor="#0eb348"
          onPress={criarEvento}
          style={{ marginBottom: 25, alignSelf: "center" }}
        />
      </View>
    </ScrollView>
  );
}