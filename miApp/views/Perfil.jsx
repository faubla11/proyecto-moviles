import React, { useContext, useState, useEffect } from 'react';
import { View, Platform } from 'react-native';
import { Text, Button, Title, TextInput } from 'react-native-paper';
import { dashboardStyles as styles } from '../styles/DashboardStyles';
import { UserContext } from '../contexts/UserContext';
import { actualizarPerfil } from '../axiosClient';

const Perfil = () => {
  const isWeb = Platform.OS === 'web';
  const { usuario, setUsuario } = useContext(UserContext);

  // Usamos el perfil del usuario, si existe
  const [editando, setEditando] = useState(false);
  const [nuevoPerfil, setNuevoPerfil] = useState({
  nombre: '',
  apellido: '',
  edad: '',
  cedula: '',
  direccion: '',
  telefono: '',
  ...usuario, // Sobrescribe si el usuario ya tiene datos
});

  useEffect(() => {
    setNuevoPerfil(usuario?.perfil || {});
  }, [usuario]);

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

        // Actualizamos el perfil en el contexto global del usuario
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

  const perfil = usuario?.perfil || {};

  return (
    <View style={styles.scene}>
      <Title style={styles.title}>Perfil</Title>
      {editando ? (
        <>
          <TextInput label="Nombre" value={nuevoPerfil.nombre} onChangeText={(v) => manejarCambio('nombre', v)} mode="outlined" style={styles.input} />
          <TextInput label="Apellido" value={nuevoPerfil.apellido} onChangeText={(v) => manejarCambio('apellido', v)} mode="outlined" style={styles.input} />
          <TextInput label="Edad" value={String(nuevoPerfil.edad)} onChangeText={(v) => manejarCambio('edad', v)} mode="outlined" keyboardType="numeric" style={styles.input} />
          <TextInput label="Cédula" value={nuevoPerfil.cedula} onChangeText={(v) => manejarCambio('cedula', v)} mode="outlined" keyboardType="numeric" style={styles.input} />
          <TextInput label="Dirección" value={nuevoPerfil.direccion} onChangeText={(v) => manejarCambio('direccion', v)} mode="outlined" style={styles.input} />
          <TextInput label="Teléfono" value={nuevoPerfil.telefono} onChangeText={(v) => manejarCambio('telefono', v)} mode="outlined" keyboardType="phone-pad" style={styles.input} />
          <Button mode="contained" onPress={guardarPerfil} style={styles.button}>Guardar</Button>
        </>
      ) : (
        <>
          <Text style={styles.texto}>Nombre: {perfil.nombre}</Text>
          <Text style={styles.texto}>Apellido: {perfil.apellido}</Text>
          <Text style={styles.texto}>Edad: {perfil.edad}</Text>
          <Text style={styles.texto}>Cédula: {perfil.cedula}</Text>
          <Text style={styles.texto}>Dirección: {perfil.direccion}</Text>
          <Text style={styles.texto}>Teléfono: {perfil.telefono}</Text>
          <Button mode="outlined" onPress={() => setEditando(true)} style={styles.button}>Editar Perfil</Button>
        </>
      )}
    </View>
  );
};

export default Perfil;
