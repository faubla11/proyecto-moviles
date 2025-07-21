import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Cargar usuario desde almacenamiento local al iniciar la app
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const datos = await AsyncStorage.getItem('usuario');
        if (token && datos) {
          setUsuario(JSON.parse(datos));
        }
      } catch (e) {
        console.error('Error cargando usuario:', e);
      } finally {
        setCargando(false);
      }
    };
    cargarUsuario();
  }, []);

  // Guardar usuario en AsyncStorage cada vez que cambie
  useEffect(() => {
    const guardarUsuario = async () => {
      if (usuario) {
        await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
      }
    };
    guardarUsuario();
  }, [usuario]);

  // Cerrar sesión
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('usuario');
      //await AsyncStorage.removeItem('lastRoute');
      //await AsyncStorage.removeItem('lastRouteParams');

    } catch (e) {
      console.error('Error limpiando almacenamiento:', e);
    }
    setUsuario(null);
  };

  return (
    <UserContext.Provider value={{ usuario, setUsuario, logout, cargando }}>
      {children}
    </UserContext.Provider>
  );
};
