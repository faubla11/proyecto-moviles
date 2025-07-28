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

const [mensajeError, setMensajeError] = useState('');
const [snackbarVisible, setSnackbarVisible] = useState(false);

const handleLogin = async () => {
try {
console.log("🟡 Enviando login con:", { email, password });


  const data = await iniciarSesion({ email, password });

  console.log("🟢 Respuesta completa del backend:", data);
  console.log("🔎 Usuario recibido:", data.usuario);
  console.log("🔎 ¿es_admin?:", data.usuario?.es_admin);

  const usuarioCompleto = {
    ...data.usuario,
    perfil: data.perfil || {},
    es_admin: !!data?.usuario?.es_admin,
  };

  console.log("✅ Usuario completo que se guardará:", usuarioCompleto);

  await AsyncStorage.setItem('token', data.token);
  await AsyncStorage.setItem('usuario', JSON.stringify(usuarioCompleto));
  setUsuario(usuarioCompleto);

} catch (error) {
  console.error("❌ Error en login:", error);
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