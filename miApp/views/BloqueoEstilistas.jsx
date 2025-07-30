import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Title,
  Paragraph,
  Snackbar,
  Chip,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import axiosClient from '../axiosClient';

const BloqueoEstilistas = () => {
  const [estilistas, setEstilistas] = useState([]);
  const [bloqueos, setBloqueos] = useState([]);
  const [estilistaId, setEstilistaId] = useState('');
  const [fechas, setFechas] = useState([]);
  const [snackbar, setSnackbar] = useState({ visible: false, mensaje: '' });

  const [mostrarPicker, setMostrarPicker] = useState(false);

  useEffect(() => {
    cargarEstilistas();
    cargarBloqueos();
  }, []);

  const cargarEstilistas = async () => {
    try {
      const res = await axiosClient.get('/estilistas');
      setEstilistas(res.data);
    } catch (error) {
      console.error('Error al cargar estilistas:', error.message);
    }
  };

  const cargarBloqueos = async () => {
    try {
      const res = await axiosClient.get('/bloquear-estilista');
      setBloqueos(res.data);
    } catch (error) {
      console.error('Error al cargar bloqueos:', error.message);
    }
  };

  const bloquear = async () => {
    if (!estilistaId || fechas.length === 0) {
      Alert.alert('Faltan campos', 'Selecciona un estilista y al menos una fecha.');
      return;
    }

    try {
      const res = await axiosClient.post('/bloquear-estilista', {
        estilista_id: estilistaId,
        fechas: fechas.map(date => moment(date).format('YYYY-MM-DD')),
      });
      setSnackbar({ visible: true, mensaje: 'Bloqueo registrado.' });
      setFechas([]);
      cargarBloqueos();
    } catch (error) {
      console.error('Error al bloquear:', error.message);
    }
  };

  const liberar = async (id) => {
    try {
      await axiosClient.delete(`/bloquear-estilista/${id}`);
      setSnackbar({ visible: true, mensaje: 'Bloqueo eliminado.' });
      cargarBloqueos();
    } catch (error) {
      console.error('Error al liberar:', error.message);
    }
  };

  const seleccionarFechaMovil = (date) => {
    const existe = fechas.some(f => moment(f).isSame(date, 'day'));
    if (!existe) {
      setFechas([...fechas, date]);
    }
    setMostrarPicker(false);
  };

  const eliminarFecha = (fecha) => {
    setFechas(fechas.filter(f => !moment(f).isSame(fecha, 'day')));
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Title style={{ marginBottom: 20, textAlign: 'center' }}>
        Bloqueo de Estilistas
      </Title>

      <Text>Selecciona un estilista:</Text>
      <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 20 }}>
        <Picker
          selectedValue={estilistaId}
          onValueChange={(value) => setEstilistaId(value)}
        >
          <Picker.Item label="-- Elegir estilista --" value="" />
          {estilistas.map(e => (
            <Picker.Item key={e.id} label={e.nombre} value={e.id} />
          ))}
        </Picker>
      </View>

      <Text>Selecciona fechas a bloquear:</Text>
      {Platform.OS === 'web' ? (
        <DatePicker
          selected={null}
          onChange={(date) => {
            if (!fechas.some(f => moment(f).isSame(date, 'day'))) {
              setFechas([...fechas, date]);
            }
          }}
          inline
        />
      ) : (
        <>
          <Button mode="outlined" onPress={() => setMostrarPicker(true)} style={{ marginBottom: 10 }}>
            Seleccionar fecha
          </Button>
          <DateTimePickerModal
            isVisible={mostrarPicker}
            mode="date"
            onConfirm={seleccionarFechaMovil}
            onCancel={() => setMostrarPicker(false)}
            minimumDate={new Date()}
          />
        </>
      )}

      {/* Fechas seleccionadas */}
      {fechas.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
          {fechas.map((f, i) => (
            <Chip key={i} onClose={() => eliminarFecha(f)} style={{ margin: 4 }}>
              {moment(f).format('YYYY-MM-DD')}
            </Chip>
          ))}
        </View>
      )}

      <Button mode="contained" onPress={bloquear} style={{ marginTop: 20 }}>
        Bloquear días
      </Button>

      <Title style={{ marginTop: 40, marginBottom: 10 }}>Bloqueos actuales</Title>
      {bloqueos.length === 0 ? (
        <Paragraph>No hay bloqueos registrados.</Paragraph>
      ) : (
        bloqueos.map((b) => (
          <Card key={b.id} style={{ marginBottom: 10, padding: 10 }}>
            <Card.Content>
              <Text>🧑 Estilista: {b.estilista?.nombre}</Text>
              <Text>📅 Fecha: {b.fecha}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => liberar(b.id)} color="red">
                Liberar
              </Button>
            </Card.Actions>
          </Card>
        ))
      )}

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, mensaje: '' })}
        duration={3000}
      >
        {snackbar.mensaje}
      </Snackbar>
    </ScrollView>
  );
};

export default BloqueoEstilistas;
