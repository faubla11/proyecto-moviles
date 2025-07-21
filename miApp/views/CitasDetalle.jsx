import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';

const CitasDetalle = ({ route }) => {
  const { tipoCita } = route.params || {};

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Citas {tipoCita}</Title>
      <Text style={styles.text}>Aquí se mostrarán tus citas {tipoCita?.toLowerCase()}.</Text>
      {/* Aquí luego colocarás el fetch de citas reales desde backend */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CitasDetalle;
