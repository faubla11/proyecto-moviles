import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Title, Card } from 'react-native-paper';
import { obtenerCitasPorEstado } from '../axiosClient';

const CitasDetalle = ({ route }) => {
  const { tipoCita } = route.params || {};
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const citasData = await obtenerCitasPorEstado(tipoCita);
        setCitas(citasData);
      } catch (error) {
        console.error('Error al obtener citas:', error.message);
      }
    };
    fetchCitas();
  }, [tipoCita]);

  return (
    <View style={{ padding: 20 }}>
      <Title>Citas {tipoCita}</Title>
      <FlatList
        data={citas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 10, padding: 10 }}>
            <Text>Servicio: {item.servicio}</Text>
            <Text>Estilista: {item.estilista}</Text>
            <Text>Fecha: {item.fecha}</Text>
            <Text>Hora: {item.hora}</Text>
          </Card>
        )}
      />
    </View>
  );
};

export default CitasDetalle;
