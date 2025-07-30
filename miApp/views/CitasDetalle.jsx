import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Title, Card, Button, Snackbar } from 'react-native-paper';
import {
  obtenerCitasPorEstado,
  cancelarCita,
  obtenerCitasPendientesEstilista,
  marcarCitaComoAtendida,
  obtenerCitasAtendidasEstilista,
} from '../axiosClient';

const CitasDetalle = ({ route, navigation }) => {
  const { tipoCita } = route.params || {};
  const [citas, setCitas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    cargarCitas();
  }, [tipoCita]);

const cargarCitas = async () => {
  try {
    let citasData = [];
    if (tipoCita === 'PorAtender') {
      citasData = await obtenerCitasPendientesEstilista();
    } else if (tipoCita === 'HistorialAtendidas') {
      citasData = await obtenerCitasAtendidasEstilista();
    } else {
      citasData = await obtenerCitasPorEstado(tipoCita);
    }
    setCitas(citasData);
  } catch (error) {
    console.error('Error al obtener citas:', error.message);
  }
};


  const handleCancelarCita = async (id) => {
    Alert.alert(
      '¿Cancelar cita?',
      '¿Estás seguro de cancelar esta cita?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí',
          onPress: async () => {
            try {
              const res = await cancelarCita(id);
              setMensaje(res.message || 'Cita cancelada');
              setVisible(true);
              cargarCitas();
            } catch (error) {
              console.error(error);
              setMensaje(error.message || 'Error al cancelar');
              setVisible(true);
            }
          },
        },
      ]
    );
  };

  const handleMarcarComoAtendida = async (id) => {
    Alert.alert(
      '¿Atender cita?',
      '¿Deseas marcar esta cita como atendida?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí',
          onPress: async () => {
            try {
              const res = await marcarCitaComoAtendida(id);
              setMensaje(res.message || 'Cita atendida');
              setVisible(true);
              cargarCitas();
            } catch (error) {
              console.error(error);
              setMensaje(error.message || 'Error al marcar cita');
              setVisible(true);
            }
          },
        },
      ]
    );
  };

const renderItem = ({ item }) => (
  <Card style={styles.card}>
    <Card.Content>
      <Text style={styles.label}>Servicio: {item.servicio}</Text>
      <Text style={styles.label}>Estilista: {item.estilista}</Text>
      <Text style={styles.label}>Fecha: {item.fecha}</Text>
      <Text style={styles.label}>Hora: {item.hora}</Text>

      {item.con_recargo && (
        <Text style={styles.recargoText}>Esta cita tiene recargo</Text>
      )}
    </Card.Content>

    {tipoCita === 'Agendadas' && (
      <Card.Actions>
        <Button onPress={() => handleCancelarCita(item.id)} color="red">
          Cancelar Cita
        </Button>
      </Card.Actions>
    )}

    {tipoCita === 'PorAtender' && (
      <Card.Actions>
        <Button
          onPress={() => handleMarcarComoAtendida(item.id)}
          icon="check-circle"
          color="green"
        >
          Marcar como Atendida
        </Button>
      </Card.Actions>
    )}

    {tipoCita === 'Atendidas' && !item.tiene_resena && (
      <Card.Actions>
        <Button
          mode="outlined"
          onPress={() =>
            navigation.navigate('CrearResena', {
              citaId: item.id,
              estilista: item.estilista,
            })
          }
        >
          Dejar Reseña
        </Button>
      </Card.Actions>
    )}
  </Card>
);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
      >
                <Title style={styles.title}>
          {(() => {
            switch (tipoCita) {
              case 'PorAtender':
                return 'Citas por Atender';
              case 'HistorialAtendidas':
                return 'Historial de Atenciones';
              case 'Agendadas':
                return 'Citas Agendadas';
              case 'Canceladas':
                return 'Citas Canceladas';
              case 'Atendidas':
                return 'Citas Atendidas';
              default:
                return 'Citas';
            }
          })()}
        </Title>

        {citas.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No hay citas registradas
          </Text>
        ) : (
          <FlatList
            data={citas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
      >
        {mensaje}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 100,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    width: Platform.OS === 'web' ? '70%' : '100%',
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  recargoText: {
    marginTop: 8,
    fontSize: 14,
    color: '#FFA726',
    fontWeight: 'bold',
  },
};

export default CitasDetalle;
