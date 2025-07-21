import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const dashboardStyles = StyleSheet.create({
  scene: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f6fa',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
  },
  texto: {
    fontSize: 16,
    marginBottom: 10,
    color: '#444',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
  },
});
