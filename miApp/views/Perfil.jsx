import React, { useContext, useState, useEffect } from 'react';
import { View, Platform, Alert } from 'react-native';
import { Text, Button, Title, TextInput, Avatar, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { dashboardStyles as styles } from '../styles/DashboardStyles';
import { UserContext } from '../contexts/UserContext';
import { actualizarPerfil } from '../axiosClient';
import axiosClient from '../axiosClient';

const Perfil = () => {
  const isWeb = Platform.OS === 'web';
  const { usuario, setUsuario } = useContext(UserContext);

  const [editando, setEditando] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [nuevoPerfil, setNuevoPerfil] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    cedula: '',
    direccion: '',
    telefono: '',
    ...usuario,
  });

  const [fotoLocalUri, setFotoLocalUri] = useState(null);
  const [cargandoImagen, setCargandoImagen] = useState(true);

  useEffect(() => {
    setNuevoPerfil(usuario?.perfil || {});
  }, [usuario]);

  useEffect(() => {
    if (usuario?.foto_uri) {
      setFotoLocalUri(`${usuario.foto_uri}?t=${new Date().getTime()}`);
    } else {
      setFotoLocalUri(null);
    }
  }, [usuario?.foto_uri]);

  const manejarCambio = (campo, valor) => {
    setNuevoPerfil({ ...nuevoPerfil, [campo]: valor });
  };

  const validarPerfil = () => {
    const { nombre, apellido, edad, cedula, direccion, telefono } = nuevoPerfil;
    if (!nombre || !apellido || !edad || !cedula || !direccion || !telefono) return false;
    if (isNaN(edad) || edad < 0 || edad > 120) return false;
    if (!/\d{10}/.test(cedula)) return false;
    if (!/\d{7,10}/.test(telefono)) return false;
    return true;
  };

  const guardarPerfil = async () => {
    if (validarPerfil()) {
      try {
        const res = await actualizarPerfil(nuevoPerfil);
        setUsuario({
          ...usuario,
          perfil: res.perfil,
        });
        setEditando(false);
      } catch (error) {
        console.error('Error al actualizar perfil:', error.message);
      }
    }
  };

  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permiso.status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la galería.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!resultado.canceled && resultado.assets?.length > 0) {
      subirImagen(resultado.assets[0].uri);
    } else {
      Alert.alert('Cancelado', 'No se seleccionó ninguna imagen.');
    }
  };

  const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (permiso.status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la cámara.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!resultado.canceled) {
      subirImagen(resultado.assets[0].uri);
    }
  };

  const subirImagen = async (uri) => {
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename ?? '');
    const ext = match?.[1] ?? 'jpg';
    const type = `image/${ext}`;

    const formData = new FormData();
    formData.append('foto', {
      uri,
      name: filename,
      type,
    });

    try {
      setSubiendoFoto(true);
      const response = await axiosClient.post('/perfil/foto', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const nuevaFotoUri = response.data.foto_uri;
      setUsuario({ ...usuario, foto_uri: nuevaFotoUri });
    } catch (error) {
      console.error('Error al subir la imagen:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo subir la imagen');
    } finally {
      setSubiendoFoto(false);
    }
  };

  // Función para mostrar selector único
  const seleccionarOtomarFoto = () => {
    Alert.alert(
      "Seleccionar foto",
      "¿Quieres tomar una foto o escoger de la galería?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Galería", onPress: seleccionarImagen },
        { text: "Cámara", onPress: tomarFoto },
      ],
      { cancelable: true }
    );
  };

  const perfil = usuario?.perfil || {};

  return (
    <View style={styles.scene}>
      <Title style={styles.title}>Perfil</Title>

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <View style={{ position: 'relative' }}>
          <Avatar.Image
            size={120}
            source={{
              uri: fotoLocalUri || 'https://via.placeholder.com/120',
            }}
            onLoadStart={() => setCargandoImagen(true)}
            onLoadEnd={() => setCargandoImagen(false)}
          />
          {(cargandoImagen || subiendoFoto) && (
            <ActivityIndicator
              size="large"
              color="purple"
              style={{
                position: 'absolute',
                top: 40,
                left: 40,
                right: 40,
                bottom: 40,
              }}
            />
          )}
        </View>

        <Button mode="outlined" onPress={seleccionarOtomarFoto} loading={subiendoFoto} style={{ marginTop: 10 }}>
          Cambiar Foto de Perfil
        </Button>
      </View>

      {editando ? (
        <>
          <TextInput
            label="Nombre"
            value={nuevoPerfil.nombre}
            onChangeText={(v) => manejarCambio('nombre', v)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Apellido"
            value={nuevoPerfil.apellido}
            onChangeText={(v) => manejarCambio('apellido', v)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Edad"
            value={String(nuevoPerfil.edad)}
            onChangeText={(v) => manejarCambio('edad', v)}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Cédula"
            value={nuevoPerfil.cedula}
            onChangeText={(v) => manejarCambio('cedula', v)}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Dirección"
            value={nuevoPerfil.direccion}
            onChangeText={(v) => manejarCambio('direccion', v)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Teléfono"
            value={nuevoPerfil.telefono}
            onChangeText={(v) => manejarCambio('telefono', v)}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />
          <Button mode="contained" onPress={guardarPerfil} style={styles.button}>
            Guardar
          </Button>
        </>
      ) : (
        <>
          <Text style={styles.texto}>Nombre: {perfil.nombre}</Text>
          <Text style={styles.texto}>Apellido: {perfil.apellido}</Text>
          <Text style={styles.texto}>Edad: {perfil.edad}</Text>
          <Text style={styles.texto}>Cédula: {perfil.cedula}</Text>
          <Text style={styles.texto}>Dirección: {perfil.direccion}</Text>
          <Text style={styles.texto}>Teléfono: {perfil.telefono}</Text>
          <Button mode="outlined" onPress={() => setEditando(true)} style={styles.button}>
            Editar Perfil
          </Button>
        </>
      )}
    </View>
  );
};

export default Perfil;
