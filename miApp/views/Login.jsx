import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, useTheme, Snackbar } from 'react-native-paper';
import { loginStyles as styles } from '../styles/LoginStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { iniciarSesion } from '../axiosClient';
import { UserContext } from '../contexts/UserContext';

const Login = ({ navigation }) => {
  const { setUsuario } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const theme = useTheme();

  // Estados para Snackbar
  const [mensajeError, setMensajeError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

const handleLogin = async () => {
  try {
    const data = await iniciarSesion({ email, password });

    const usuarioCompleto = {
      ...data.usuario,
      perfil: data.perfil || {},
    };

    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('usuario', JSON.stringify(usuarioCompleto));
    setUsuario(usuarioCompleto);

  } catch (error) {
    setMensajeError(error.message || 'Credenciales incorrectas');
    setSnackbarVisible(true);
  }
};


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.box}>
        <Title style={styles.title}>Iniciar Sesión</Title>

        <TextInput
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
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
          right={
            <TextInput.Icon
              icon={secureText ? 'eye-off' : 'eye'}
              onPress={() => setSecureText(!secureText)}
            />
          }
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Ingresar
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Register')}
          labelStyle={styles.link}
        >
          ¿No tienes cuenta? Regístrate
        </Button>
      </View>

      {/* Snackbar para errores */}
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

export default Login;
