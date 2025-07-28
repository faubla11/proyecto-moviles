// AgendarCita.jsx
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  View,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import {
  TextInput,
  Button,
  Title,
  Text,
  Snackbar,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { agendarCitaStyles as styles } from '../styles/AgendarCitaStyles';
import {
  agendarCita,
  obtenerServicios,
  obtenerEstilistas,
  obtenerHorasOcupadas,
  obtenerPerfil,
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
  const [tieneRecargo, setTieneRecargo] = useState(false);
  const [mostrarAlertaRecargo, setMostrarAlertaRecargo] = useState(false);


  const showDatePicker = () => {
    if (!estilista) return;
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => setDatePickerVisibility(false);

useEffect(() => {
  const cargarDatos = async () => {
    try {
      const servs = await obtenerServicios();
      const estilists = await obtenerEstilistas();
      const perfil = await obtenerPerfil();

      setServicios(servs);
      setEstilistas(estilists);

      if (perfil?.tiene_recargo_pendiente) {
        setTieneRecargo(true);
        setMostrarAlertaRecargo(true);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error.message);
    }
  };
  cargarDatos();
}, []);


  useEffect(() => {
    const cargarHorasOcupadas = async () => {
      if (fecha && estilista) {
        setLoadingHoras(true);
        try {
          const ocupadasRaw = await obtenerHorasOcupadas(fecha, estilista);
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

const handleAgendar = () => {
  if (!servicio || !estilista || !fecha || !hora) {
    alert('Completa todos los campos');
    return;
  }

  const ejecutarAgendamiento = async () => {
    try {
      await agendarCita({ servicio, estilista, fecha, hora });

      // Limpiar el recargo una vez que ya se aplicó a esta cita
      setTieneRecargo(false);
      setMostrarAlertaRecargo(false);

      setShowSuccess(true);
      setTimeout(() => {
        navigation.navigate('Dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error al agendar:', error);
      alert('Error al agendar la cita');
    }
  };

  if (tieneRecargo) {
    if (Platform.OS === 'web') {
      // En web, usamos un confirm simple o Snackbar adicional si prefieres
      const confirmado = window.confirm('Se aplicará un recargo por haber cancelado una cita sin anticipación. ¿Deseas continuar?');
      if (confirmado) {
        ejecutarAgendamiento();
      }
    } else {
      // En móvil usamos Alert de React Native
      Alert.alert(
        'Recargo pendiente',
        'Se aplicará un recargo por haber cancelado una cita sin anticipación. ¿Deseas continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sí, continuar', onPress: ejecutarAgendamiento }
        ],
        { cancelable: true }
      );
    }
  } else {
    ejecutarAgendamiento();
  }
};

  const handleConfirmDate = (selectedDate) => {
    if (!selectedDate) return;
    setDatePickerVisibility(false);
    const y = selectedDate.getFullYear();
    const m = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const d = selectedDate.getDate().toString().padStart(2, '0');
    setFecha(`${y}-${m}-${d}`);
    setHora('');
  };

  const generarHorasDisponibles = () => {
    const horas = [];
    const ahora = new Date();
    const fechaSeleccionada = new Date(fecha + 'T00:00:00');
    const esHoy = fechaSeleccionada.toDateString() === ahora.toDateString();

    for (let h = 0; h <= 23; h++) {
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
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.formWrapper}>
            <Title style={{ textAlign: 'center', marginBottom: 16 }}>
              Agendar Nueva Cita
            </Title>

            <Text style={styles.label}>Servicio</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={servicio} onValueChange={setServicio}>
                <Picker.Item label="Seleccione un servicio" value="" />
                {servicios.map((s, idx) => (
                  <Picker.Item key={idx} label={s} value={s} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Estilista</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={estilista} onValueChange={setEstilista}>
                <Picker.Item label="Seleccione un estilista" value="" />
                {estilistas.map((e, idx) => (
                  <Picker.Item key={e.id} label={e.nombre} value={e.nombre} />
                ))}
              </Picker>
            </View>

            {estilista && (
              <>
                <Text style={styles.label}>Fecha</Text>
                {Platform.OS === 'web' ? (
                  <View style={{ marginBottom: 12 }}>
                    <DatePicker
                      selected={fecha ? new Date(fecha + 'T00:00:00') : null}
                      onChange={(date) => handleConfirmDate(date)}
                      minDate={new Date()}
                      maxDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Seleccione una fecha"
                      className="react-datepicker__input"
                      style={{ width: '100%' }}
                    />
                  </View>
                ) : (
                  <TouchableOpacity onPress={showDatePicker}>
                    <View pointerEvents="none">
                      <TextInput
                        label="Fecha"
                        value={fecha}
                        mode="outlined"
                        editable={false}
                        style={styles.input}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                {Platform.OS !== 'web' && (
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePicker}
                    minimumDate={new Date()}
                    maximumDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
                  />
                )}
              </>
            )}

            {fecha && estilista && (
              <>
                <Text style={styles.label}>Hora</Text>
                {loadingHoras ? (
                  <ActivityIndicator style={{ marginTop: 10 }} />
                ) : (
                  <View style={styles.pickerContainer}>
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

            <Button mode="contained" onPress={handleAgendar} style={styles.button}>
              Agendar
            </Button>

            <Snackbar
              visible={showSuccess}
              onDismiss={() => setShowSuccess(false)}
              duration={3000}
              style={styles.snackbar}
            >
              <Text style={styles.snackbarText}>¡Cita agendada con éxito!</Text>
            </Snackbar>
                      <Snackbar
            visible={mostrarAlertaRecargo}
            onDismiss={() => setMostrarAlertaRecargo(false)}
            duration={4000}
            style={[styles.snackbar, { backgroundColor: '#FFA726' }]}
          >
            <Text style={[styles.snackbarText, { fontWeight: 'bold' }]}>
              Tienes un recargo pendiente por cancelación tardía.
            </Text>
          </Snackbar>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AgendarCita;
