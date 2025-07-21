import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, Snackbar } from 'react-native-paper'; // <-- IMPORTA Snackbar
import { registerStyles as styles } from '../styles/RegisterStyles';
import { registrarUsuario } from '../axiosClient';

const Register = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [secureText, setSecureText] = useState(true);

  // Estados para Snackbar
  const [mensajeError, setMensajeError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleRegister = async () => {
    if (!nombre.trim()) {
      setMensajeError('Por favor ingresa tu nombre');
      setSnackbarVisible(true);
      return;
    }
    if (password !== confirmPass) {
      setMensajeError('Las contraseñas no coinciden');
      setSnackbarVisible(true);
      return;
    }

    try {
      await registrarUsuario({ nombre, correo, password });
      setMensajeError('Registro exitoso');
      setSnackbarVisible(true);
      // Navegar después de un breve delay para que el usuario vea el mensaje
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
    } catch (error) {
      setMensajeError(error.message || 'Correo ya registrado u otro problema');
      setSnackbarVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.box}>
        <Title style={styles.title}>Registro</Title>

        {/* Inputs ... (igual que antes) */}
        <TextInput
          label="Nombre"
          value={nombre}
          onChangeText={setNombre}
          mode="outlined"
          style={styles.input}
          outlineStyle={styles.inputOutline}
          left={<TextInput.Icon icon="account" />}
        />
        <TextInput
          label="Correo electrónico"
          value={correo}
          onChangeText={setCorreo}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          outlineStyle={styles.inputOutline}
          left={<TextInput.Icon icon="email" />}
        />
        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={secureText}
          style={styles.input}
          outlineStyle={styles.inputOutline}
          left={<TextInput.Icon icon="lock" />}
        />
        <TextInput
          label="Confirmar contraseña"
          value={confirmPass}
          onChangeText={setConfirmPass}
          mode="outlined"
          secureTextEntry={secureText}
          style={styles.input}
          outlineStyle={styles.inputOutline}
          left={<TextInput.Icon icon="lock-check" />}
          right={
            <TextInput.Icon
              icon={secureText ? 'eye-off' : 'eye'}
              onPress={() => setSecureText(!secureText)}
            />
          }
        />

        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Registrar
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Login')}
          labelStyle={styles.link}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </View>

      {/* Snackbar para mensajes de error o éxito */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {mensajeError}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

export default Register;
