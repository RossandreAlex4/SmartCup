import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/GarcomHistoricoStyle';

interface Alerta {
  id: string;
  index: string;
  titulo: string;
  mesa: string;
}

const DATA: Alerta[] = [
  { id: '1', index: '01', titulo: 'copo vazio', mesa: 'mesa 1' },
  { id: '2', index: '02', titulo: 'copo vazio', mesa: 'mesa 4' },
  { id: '3', index: '03', titulo: 'copo', mesa: 'xxxxx' },
  { id: '4', index: '04', titulo: 'copo', mesa: 'xxxxx' },
  { id: '5', index: '05', titulo: 'copo vazio', mesa: 'mesa 2' },
  { id: '6', index: '06', titulo: 'copo', mesa: 'mesa 3' },
];

const AlertasScreen = () => {
  const [alertas, setAlertas] = useState<Alerta[]>(DATA);

  const atenderAlerta = (id: string) => {
    setAlertas(prev => prev.filter(alerta => alerta.id !== id));
  };

  const renderItem = ({ item }: { item: Alerta }) => (
    <View style={styles.card}>
      <View style={styles.indexCircle}>
        <Text style={styles.indexText}>{item.index}</Text>
      </View>
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.cardSubtitle}>{item.mesa}</Text>
      </View>
      <TouchableOpacity 
        style={styles.checkButton} 
        onPress={() => atenderAlerta(item.id)}
      >
        <Ionicons name="checkmark-circle-outline" size={32} color="#00FF00" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={{ width: 45, height: 45, resizeMode: 'contain' }}
        />
        <Text style={styles.headerTitle}>Historico de Alertas</Text>
        <View style={{ width: 45 }} />
      </View>

      <FlatList
        data={alertas}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView >
  );
};

export default AlertasScreen;