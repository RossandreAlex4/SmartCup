import { useReducer, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import CustomButton from "../components/customButton";
import { styles } from "../styles/EventoConfigScreenStyle";
import { router } from 'expo-router';
import { EventContext } from "../../context/EventContext";

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
      return {
        ...state,
        [action.field]: state[action.field] + 1,
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

const { setEventData } = useContext(EventContext);

  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  const [eventName, setEventName] = useState("")

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


  return (
    <ScrollView 
      contentContainerStyle={{
      flexGrow: 1,
    }}>
    <View style={styles.container}>
      <View style={styles.titleConfig}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image
            source={require("../../../assets/images/back.png")}
            style={styles.image}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Configuração do Evento</Text>
      </View>

      <View style={styles.line} />

      <View style={styles.createContainer}>
        <Text style={styles.createName}>Nome do evento</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Digite o nome do evento'
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

            <Text style={styles.cardTitle}>
              {card.title}
            </Text>

            <Text style={styles.value}>
              {card.value}
            </Text>

            <View style={styles.buttonsContainer}>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  dispatch({
                    type: "DECREMENT",
                    field:
                      card.field as keyof State,
                  })
                }
              >
                <Text style={styles.buttonText}>
                  -
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  dispatch({
                    type: "INCREMENT",
                    field:
                      card.field as keyof State,
                  })
                }
              >
                <Text style={styles.buttonText}>
                  +
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        ))}
      </View>

      <CustomButton
        title="Criar"
        width="70%"
        backgroundColor="#0eb348"
        onPress={() => {

          const tablesArray = Array.from(
            { length: state.tables },
            (_, index) => ({
              id: index + 1,
              status: "Livre",
            })
          );
        
          setEventData({
            eventName,
            tables: tablesArray,
            smartCups: state.smartCups,
            zones: state.zones,
            waiters: state.waiters,
          });
        
          router.push("/adm-dash");
        }}
        style={{
          marginBottom: 25,
          alignSelf: "center",
        }}
      />

    </View>
    </ScrollView>
  );
}