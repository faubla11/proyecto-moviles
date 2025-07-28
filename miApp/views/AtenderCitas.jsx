import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Title, Card, Button, Snackbar } from 'react-native-paper';
import { obtenerCitasPendientesEstilista, marcarCitaComoAtendida } from '../axiosClient';
import { UserContext } from '../contexts/UserContext';

const AtenderCitas = () => {
  const [citas, setCitas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [visible, setVisible] = useState(false);
  const { usuario } = useContext(UserContext);

  useEffect(() => {
    if (usuario?.es_estilista) {
      cargarCitas();
    }
  }, []);

  const cargarCitas = async () => {
    const res = await obtenerCitasPendientesEstilista();
    setCitas(res);
  };

  const atender = (id) => {
    Alert.alert(
      '¿Atender cita?',
      '¿Deseas marcar esta cita como atendida?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí',
          onPress: async () => {
            await marcarCitaComoAtendida(id);
            setMensaje('Cita atendida');
            setVisible(true);
            cargarCitas();
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Title style={{ textAlign: 'center', marginBottom: 10 }}>Citas por Atender</Title>
      {citas.length === 0 ? (
        <Text style={{ textAlign: 'center' }}>No hay citas pendientes</Text>
      ) : (
        citas.map(cita => (
          <Card key={cita.id} style={{ marginBottom: 15, padding: 10 }}>
            <Card.Content>
              <Text>Cliente: {cita.usuario_id}</Text>
              <Text>Servicio: {cita.servicio}</Text>
              <Text>Fecha: {cita.fecha}</Text>
              <Text>Hora: {cita.hora}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => atender(cita.id)}>Marcar como Atendida</Button>
            </Card.Actions>
          </Card>
        ))
      )}
      <Snackbar visible={visible} onDismiss={() => setVisible(false)}>{mensaje}</Snackbar>
    </ScrollView>
  );
};

export default AtenderCitas;
