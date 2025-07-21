import React, { useContext, useState, useEffect } from 'react';
import { View, Platform } from 'react-native';
import { Text, Button, Title, Drawer } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomNavigation } from 'react-native-paper';
import { dashboardStyles as styles } from '../styles/DashboardStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cerrarSesion } from '../axiosClient';
import CitasSection from './CitasSection';
import Perfil from './Perfil';
import { UserContext } from '../contexts/UserContext';

const Dashboard = ({ navigation }) => {
  const isWeb = Platform.OS === 'web';
  const { logout } = useContext(UserContext);

  const [index, setIndex] = useState(null); // Inicia sin valor
  const routes = [
    { key: 'dashboard', title: 'Inicio', icon: 'home' },
    { key: 'perfil', title: 'Perfil', icon: 'account' },
    { key: 'config', title: 'Configuración', icon: 'cog' },
  ];

  // Cargar el índice guardado al montar
  useEffect(() => {
    const cargarIndice = async () => {
      const guardado = await AsyncStorage.getItem('tabIndex');
      if (guardado !== null) {
        setIndex(parseInt(guardado));
      } else {
        setIndex(0); // Valor por defecto
      }
    };
    cargarIndice();
  }, []);

  // Guardar el índice cada vez que cambia
  useEffect(() => {
    if (index !== null) {
      AsyncStorage.setItem('tabIndex', index.toString());
    }
  }, [index]);

  const cerrarSesionApp = async () => {
    try {
      await cerrarSesion(); // Llamada al backend
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
    await logout(); // Limpia token y usuario del contexto
    await AsyncStorage.removeItem('tabIndex'); // Limpia el tab guardado
    
  };

  const renderScene = (route) => {
    switch (route.key) {
      case 'dashboard':
        return <CitasSection navigation={navigation} />;
      case 'perfil':
        return <Perfil />;
      case 'config':
        return (
          <View style={styles.scene}>
            <Title style={styles.title}>Configuración</Title>
            <Button mode="contained" onPress={cerrarSesionApp} style={styles.button}>
              Cerrar Sesión
            </Button>
          </View>
        );
      default:
        return null;
    }
  };

  if (index === null) return null; // ⏳ Puedes poner aquí un spinner o pantalla de carga

  // Vista para Web
  if (isWeb) {
    return (
      <View style={{ flexDirection: 'row', height: '100%' }}>
        <View style={{ width: 220, backgroundColor: '#f2f2f2', paddingTop: 20 }}>
          <Drawer.Section title="Menú Web">
            {routes.map((r, i) => (
              <Drawer.Item
                key={r.key}
                label={r.title}
                icon={r.icon}
                active={index === i}
                onPress={() => setIndex(i)}
              />
            ))}
          </Drawer.Section>
        </View>
        <View style={{ flex: 1, padding: 20 }}>
          {renderScene(routes[index])}
        </View>
      </View>
    );
  }

  // Vista para Móvil
  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={BottomNavigation.SceneMap({
        dashboard: () => renderScene(routes[0]),
        perfil: () => renderScene(routes[1]),
        config: () => renderScene(routes[2]),
      })}
      renderIcon={({ route, focused, color }) => (
        <MaterialCommunityIcons name={route.icon} size={24} color={color} />
      )}
    />
  );
};

export default Dashboard;
