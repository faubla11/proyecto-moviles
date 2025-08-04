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
  iniciarPagoCita,
} from '../axiosClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import axiosClient from '../axiosClient'; // si no está ya



const CitasDetalle = ({ route, navigation }) => {
  const { tipoCita } = route.params || {};
  const [citas, setCitas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [visible, setVisible] = useState(false);


  const handlePagarCita = async (citaId) => {
  try {
    const res = await iniciarPagoCita(citaId);

    if (res && res.paymentUrl && res.transactionId) {
      // Guarda el ID de la cita y el transactionId para usarlos al regresar
      await AsyncStorage.setItem('citaEnPago', citaId.toString());
      await AsyncStorage.setItem('transactionId', res.transactionId.toString());

      // Mostrar alerta informativa antes de redirigir
      Alert.alert(
        'Redirigiendo a PayPhone',
        'Serás redirigido a la app de PayPhone para completar tu pago.',
        [{ text: 'OK', onPress: () => Linking.openURL(res.paymentUrl) }]
      );
    } else {
      alert('No se pudo iniciar el pago. Inténtalo más tarde.');
    }
  } catch (error) {
    console.error('Error al iniciar pago:', error.response?.data || error.message);

    if (error.response?.data?.detalles?.includes('transacciones pendientes')) {
      alert('⚠️ Ya tienes un pago pendiente. Revisa tu app PayPhone o espera unos minutos.');
    } else {
      alert('Error al procesar el pago.');
    }
  }
};


const handleDeepLink = async ({ url }) => {
  const parsed = Linking.parse(url);

  if (parsed.path === 'pago-exitoso') {
    alert('✅ ¡Pago exitoso!');
    try {
      const citaId = await AsyncStorage.getItem('citaEnPago');
      const transactionId = await AsyncStorage.getItem('transactionId');

      if (!citaId || !transactionId) {
        console.warn('⚠️ Faltan datos para verificar pago');
        return;
      }

      // 🔍 Verificar pago con el backend
      const res = await axiosClient.post(`/cita/verificar-pago`, {
        transactionId: transactionId,
      });

      console.log('🧾 Respuesta al verificar pago:', res.data);

      await AsyncStorage.removeItem('citaEnPago');
      await AsyncStorage.removeItem('transactionId');

      // Recargar citas
      await cargarCitas();

      // Mostrar confirmación
      setMensaje('✅ Cita pagada con éxito');
      setVisible(true);

    } catch (e) {
      console.error('❌ Error al verificar pago:', e);
      alert('Ocurrió un error al verificar el pago. Intenta nuevamente.');
    }
  }

  if (parsed.path === 'pago-cancelado') {
    alert('❌ Pago cancelado.');
    await AsyncStorage.removeItem('citaEnPago');
    await AsyncStorage.removeItem('transactionId');
  }
};

useEffect(() => {
  Linking.getInitialURL().then((url) => {
    if (url) handleDeepLink({ url });
  });

  const subscription = Linking.addEventListener('url', handleDeepLink);
  return () => subscription.remove();
}, []);

// ✅ importante agregar dependencia


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
    setCitas([...citasData]); // fuerza nuevo array para FlatList

    console.log('📋 Citas actualizadas:', citasData);
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
      <Text style={styles.label}>💰 Total: ${Number(item.precio).toFixed(2)}</Text>

      {item.con_recargo && (
      <Text style={{ color: '#FFA726', fontWeight: 'bold' }}>
      ⚠ Esta cita tuvo un recargo
      </Text>
      )}

      {/* ✅ Aquí mostramos el mensaje de cita pagada */}
  {item.estado === 'pagada' && (
    <Text style={{ marginTop: 5, color: 'green', fontWeight: 'bold' }}>
      ✅ Cita pagada
    </Text>
  )}
    </Card.Content>

    {tipoCita === 'Agendadas' && (
  <Card.Actions>
    <Button onPress={() => handleCancelarCita(item.id)} color="red">
      Cancelar Cita
    </Button>

{item.estado === 'agendada' && (
  <Button
    onPress={() => handlePagarCita(item.id)}
    icon="credit-card"
    color="#2E7D32"
    mode="contained"
  >
    Pagar
  </Button>
)}

{item.estado === 'pagada' && (
  <Button
    icon="check-circle"
    disabled
    mode="outlined"
    color="green"
    labelStyle={{ fontWeight: 'bold' }}
    contentStyle={{ flexDirection: 'row-reverse' }}
  >
    Pagada
  </Button>
)}

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
