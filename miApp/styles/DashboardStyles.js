import { StyleSheet } from 'react-native';

export const dashboardStyles = StyleSheet.create({
  scene: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f6fa',
    width: '100%',
    maxWidth: 800, // 🧩 Evita que se extienda demasiado en pantallas grandes
    alignSelf: 'center', // Centrado en web
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
