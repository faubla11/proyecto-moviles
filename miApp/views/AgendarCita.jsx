import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  TextInput,
  Button,
  Title,
  HelperText,
  Text,
  Snackbar,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { dashboardStyles as styles } from '../styles/DashboardStyles';
import {
  agendarCita,
  obtenerServicios,
  obtenerEstilistas,
  obtenerHorasOcupadas,
} from '../axiosClient';

const AgendarCita = ({ navigation }) => {
  const [servicio, setServicio] = useState('');
  const [estilista, setEstilista] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [servicios, setServicios] = useState([]);
  const [estilistas, setEstilistas] = useState([]);
  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingHoras, setLoadingHoras] = useState(false);

  // Función para mostrar el date picker solo si hay estilista seleccionado
  const showDatePicker = () => {
    if (!estilista) {
      // Opcional: mensaje o alerta
      // alert('Por favor, seleccione un estilista primero');
      return;
    }
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => setDatePickerVisibility(false);

  // Cargar servicios y estilistas
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const servs = await obtenerServicios();
        const estilists = await obtenerEstilistas();
        setServicios(servs);
        setEstilistas(estilists);
      } catch {}
    };
    cargarDatos();
  }, []);

  // Cargar horas ocupadas si cambia estilista o fecha
  useEffect(() => {
    const cargarHorasOcupadas = async () => {
      if (fecha && estilista) {
        setLoadingHoras(true);
        try {
          const ocupadasRaw = await obtenerHorasOcupadas(fecha, estilista);
          console.log('Horas ocupadas recibidas:', ocupadasRaw);

          // Aseguramos que sea un array de strings
          const ocupadas = ocupadasRaw.map((h) => h.toString());
          setHorasOcupadas(ocupadas);
        } catch (error) {
          console.error(error);
          setHorasOcupadas([]);
        }
        setLoadingHoras(false);
      } else {
        setHorasOcupadas([]);
      }
    };
    cargarHorasOcupadas();
  }, [fecha, estilista]);

  const handleAgendar = async () => {
    if (!servicio || !estilista || !fecha || !hora) return;
    try {
      await agendarCita({ servicio, estilista, fecha, hora });
      setShowSuccess(true);
      setTimeout(() => {
        navigation.navigate('Dashboard');
      }, 3000);
    } catch {
      alert('Error al agendar la cita');
    }
  };

  const handleConfirmDate = (selectedDate) => {
    setDatePickerVisibility(false);

    const y = selectedDate.getFullYear();
    const m = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const d = selectedDate.getDate().toString().padStart(2, '0');
    const fechaSeleccionada = `${y}-${m}-${d}`;
    setFecha(fechaSeleccionada);
    setHora('');
  };

  const generarHorasDisponibles = () => {
    const horas = [];
    const ahora = new Date();
    const fechaSeleccionada = new Date(fecha + 'T00:00:00');
    const esHoy = fechaSeleccionada.toDateString() === ahora.toDateString();

    for (let h = 8; h <= 18; h++) {
      for (let m of [0, 30]) {
        if (h === 18 && m === 30) continue;
        const horaStr = `${h.toString().padStart(2, '0')}:${m
          .toString()
          .padStart(2, '0')}`;

        const horaObj = new Date(fechaSeleccionada);
        horaObj.setHours(h, m, 0, 0);
        const yaOcupada = horasOcupadas.includes(horaStr);

        if ((!esHoy || horaObj > ahora) && !yaOcupada) {
          horas.push(horaStr);
        }
      }
    }

    return horas;
  };

  const horasDisponibles = fecha && estilista ? generarHorasDisponibles() : [];

  return (
    <ScrollView contentContainerStyle={styles.scene}>
      <Title style={styles.title}>Agendar Nueva Cita</Title>

      {/* Servicio */}
      <Text style={{ marginLeft: 8 }}>Servicio</Text>
      <View style={[styles.input, { backgroundColor: '#fff' }]}>
        <Picker selectedValue={servicio} onValueChange={setServicio}>
          <Picker.Item label="Seleccione un servicio" value="" />
          {servicios.map((s, idx) => (
            <Picker.Item key={idx} label={s} value={s} />
          ))}
        </Picker>
      </View>

      {/* Estilista */}
      <Text style={{ marginLeft: 8, marginTop: 12 }}>Estilista</Text>
      <View style={[styles.input, { backgroundColor: '#fff' }]}>
        <Picker selectedValue={estilista} onValueChange={setEstilista}>
          <Picker.Item label="Seleccione un estilista" value="" />
          {estilistas.map((e, idx) => (
            <Picker.Item key={idx} label={e} value={e} />
          ))}
        </Picker>
      </View>

      {/* Fecha */}
      {estilista && (
        <>
          <Text style={{ marginLeft: 8, marginTop: 12 }}>Fecha</Text>
          <TouchableOpacity
            onPress={showDatePicker}
            style={{ opacity: 1 }}
          >
            <View pointerEvents="none">
              <TextInput
                label="Fecha"
                value={fecha}
                mode="outlined"
                editable={false}
                style={[styles.input, { backgroundColor: '#fff' }]}
                placeholder="Seleccione una fecha"
              />
            </View>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
            minimumDate={new Date()}
            maximumDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
          />
        </>
      )}


      {/* Hora */}
      {fecha && estilista && (
        <>
          <Text style={{ marginLeft: 8, marginTop: 12 }}>Hora</Text>
          {loadingHoras ? (
            <ActivityIndicator style={{ marginTop: 10 }} />
          ) : (
            <View style={[styles.input, { backgroundColor: '#fff' }]}>
              <Picker selectedValue={hora} onValueChange={setHora}>
                <Picker.Item label="Seleccione una hora" value="" />
                {horasDisponibles.length === 0 ? (
                  <Picker.Item label="No hay horas disponibles" value="" />
                ) : (
                  horasDisponibles.map((h, idx) => (
                    <Picker.Item key={idx} label={h} value={h} />
                  ))
                )}
              </Picker>
            </View>
          )}
        </>
      )}

      {/* Botón */}
      <Button mode="contained" onPress={handleAgendar} style={styles.button}>
        Agendar
      </Button>

      {/* Mensaje de éxito */}
      <Snackbar
        visible={showSuccess}
        onDismiss={() => setShowSuccess(false)}
        duration={3000}
        style={{
          backgroundColor: '#4CAF50',
          margin: 16,
          borderRadius: 10,
          alignSelf: 'center',
          maxWidth: '90%',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          ¡Cita agendada con éxito!
        </Text>
      </Snackbar>
    </ScrollView>
  );
};

export default AgendarCita;
