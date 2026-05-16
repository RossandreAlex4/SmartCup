
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import CustomButton from "../components/customButton";
import { styles } from "../styles/AdminDashboardScreenStyles";
import { router } from 'expo-router';
import { useContext } from "react";
import { EventContext } from "../../context/EventContext";



export default function AdmDash() {

  const { eventData } = useContext(EventContext);

    const totalTables = Number(eventData.tables.length);

  const stats = [
    {
      label: "Mesas",
      value: eventData.tables.length,
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

        <Text style={styles.title}>Dashboard</Text>

        <Text style={styles.subtitle}>Evento: {eventData.eventName}</Text>
      </View>

      <View style={styles.line}/>

      <View style={styles.statsContainer}>
        {stats.map((item) => (
          <View
            key={item.label}
            style={styles.statsCard}
          >
            <Text style={styles.value}>
              {item.value}
            </Text>
      
            <Text style={styles.label}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

    <View style={styles.createContainer}>
       <Text style={styles.overview}>Visão geral das mesas</Text>
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
          
        <Text style={styles.cardStatus}>
          {table.status}
        </Text>
          
        </View>
    
      ))}

</View>

      <CustomButton
        title="Criar"
        width="70%"
        backgroundColor="#0eb348"
        onPress={() => {
          router.push("/mesas-screen");
          console.log("Clicked")}}
        style={{
          marginBottom: 25,
          alignSelf: "center",
        }}
      />

    </View>
    </ScrollView>
  );
}