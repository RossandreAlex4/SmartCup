import { useReducer, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import CustomButton from "../components/customButton";
import { styles } from "../styles/MesasScreenStyle";
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

export default function MesasScreen() {

    const { eventData } =
  useContext(EventContext);
    

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

        <Text style={styles.title}>Configuração das Mesas</Text>
      </View>

      <View style={styles.line} />

      <View style={styles.createContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Buscar mesa ....'
            placeholderTextColor="#999"
            style={styles.input}
            value={eventName}
            onChangeText={setEventName}
          />
        </View>
      </View>

      <View style={styles.cardsContainer}>
      
        {eventData.tables.map((table) => (
          <View
            key={table.id}
            style={styles.card}
          >
        
          <Text style={styles.cardTitle}>
            Mesa {table.id}
          </Text>
          
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require("../../../assets/images/edit.png")}
              style={styles.cardEdit}
            />
          </TouchableOpacity>
      
          <View style={styles.cardStatusLine}>  
          <Text style={styles.cardStatus}>
            {table.status}
          </Text>


          <Text style={styles.cardStatus}>
            {table.status}
          </Text> 
          </View> 


      
          </View>
        
        ))}

      <CustomButton
        title="Adicionar Mesa"
        width="70%"
        backgroundColor="#0eb348"
        onPress={() =>
          router.push({
            pathname: "/alert",
            params: {
              eventName: eventName,
              tables: state.tables.toString(),
              smartCups: state.smartCups.toString(),
              zones: state.zones.toString(),
              waiters: state.waiters.toString(),
            },
          })
        }
        style={{
          marginBottom: 25,
          alignSelf: "center",
        }}
      />

    </View>
    </View>
    </ScrollView>
  );
}