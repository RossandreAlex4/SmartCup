import { StyleSheet, ScrollView } from 'react-native';
import Login from '../src/views/screens/LoginScreen';
import TelaInicial from '../src/views/screens/LandingScreen'
import ConfigEvento from '../src/views/screens/EventoConfigScreen';

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TelaInicial/>
      {/* <Login/> */}
      {/* <ConfigEvento/> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
});