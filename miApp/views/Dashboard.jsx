import React, { useContext, useState, useEffect } from 'react';
import { View, Platform, TouchableOpacity } from 'react-native';
import {
  Appbar,
  Drawer,
  Button,
  Title,
  Text,
  Menu,
  Avatar,
  BottomNavigation,
  Switch,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { dashboardStyles as styles } from '../styles/DashboardStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cerrarSesion } from '../axiosClient';
import CitasSection from './CitasSection';
import Perfil from './Perfil';
import { UserContext } from '../contexts/UserContext';
import { ThemeContext } from '../contexts/ThemeContext'; // ✅ Importa el contexto del tema

const Dashboard = ({ navigation }) => {
  const isWeb = Platform.OS === 'web';
  const { logout } = useContext(UserContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); // ✅ Extrae desde el contexto

  const [index, setIndex] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(null);
  const [menuColapsado, setMenuColapsado] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const abrirMenu = () => setMenuVisible(true);
  const cerrarMenu = () => setMenuVisible(false);

  const mobileRoutes = [
    { key: 'dashboard', title: 'Inicio', icon: 'home' },
    { key: 'perfil', title: 'Perfil', icon: 'account' },
    { key: 'config', title: 'Configuración', icon: 'cog' },
  ];

  const webRoutes = [
    { key: 'dashboard', title: 'Inicio', icon: 'home' },
  ];

  const routes = isWeb ? webRoutes : mobileRoutes;

  const cerrarSesionApp = async () => {
    try {
      await cerrarSesion();
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
    await logout();
    await AsyncStorage.removeItem('tabIndex');
  };

  const renderScene = (route) => {
    switch (route.key) {
      case 'dashboard':
        return <CitasSection navigation={navigation} />;
      case 'perfil':
        return <Perfil />;
// Dentro del switch(renderScene):

case 'config':
  return (
    <View style={styles.scene}>
      <Title style={styles.title}>Configuración</Title>
      <Text>Opciones de configuración...</Text>

      {/* Toggle tema SOLO en móvil */}
      {!isWeb && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
          <Text style={{ marginRight: 10 }}>Tema: {isDarkMode ? 'Oscuro' : 'Claro'}</Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>
      )}

      {/* Botón cerrar sesión SOLO móvil */}
      {!isWeb && (
        <Button
          mode="outlined"
          onPress={cerrarSesionApp}
          style={styles.button}
          icon="logout"
        >
          Cerrar sesión
        </Button>
      )}
    </View>
  );
      default:
        return null;
    }
  };

  if (isWeb) {
    const drawerWidth = menuColapsado ? 72 : 220;

    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ justifyContent: 'flex-start' }}>
          <Appbar.Action
            icon={menuColapsado ? 'menu-open' : 'menu'}
            onPress={() => setMenuColapsado(!menuColapsado)}
          />
          {!menuColapsado && (
            <Appbar.Content
              title={
                sceneIndex === 'perfil'
                  ? 'Perfil'
                  : sceneIndex === 'config'
                  ? 'Configuración'
                  : routes[index]?.title || 'Dashboard'
              }
            />
          )}
        </Appbar.Header>

        {/* Avatar y menú desplegable */}
        <View style={{ position: 'absolute', top: 12, right: 16, zIndex: 999 }}>
          <Menu
            visible={menuVisible}
            onDismiss={cerrarMenu}
            anchor={
              <TouchableOpacity onPress={abrirMenu}>
                <Avatar.Icon
                  size={36}
                  icon="account"
                  style={{ backgroundColor: '#6200ee' }}
                />
              </TouchableOpacity>
            }
          >
            <Menu.Item
              onPress={() => {
                cerrarMenu();
                setSceneIndex('perfil');
              }}
              title="Perfil"
              leadingIcon="account"
            />
            <Menu.Item
              onPress={() => {
                cerrarMenu();
                setSceneIndex('config');
              }}
              title="Configuración"
              leadingIcon="cog"
            />
            <Menu.Item
              onPress={() => {
                toggleTheme();
              }}
              title={`Tema: ${isDarkMode ? 'Oscuro' : 'Claro'}`}
              leadingIcon={isDarkMode ? 'weather-night' : 'white-balance-sunny'}
              right={() => (
                <Switch value={isDarkMode} onValueChange={toggleTheme} />
              )}
            />
            <Menu.Item
              onPress={() => {
                cerrarMenu();
                cerrarSesionApp();
              }}
              title="Cerrar sesión"
              leadingIcon="logout"
            />
          </Menu>
        </View>

        <View style={{ flexDirection: 'row', height: '100%' }}>
          <View
            style={{
              width: drawerWidth,
              backgroundColor: '#f2f2f2',
              paddingTop: 10,
              borderRightWidth: 1,
              borderRightColor: '#ddd',
            }}
          >
            {routes.map((r, i) => (
              <Drawer.Item
                key={r.key}
                label={menuColapsado ? '' : r.title}
                icon={({ size, color }) => (
                  <MaterialCommunityIcons
                    name={r.icon}
                    size={24}
                    color={color}
                    style={{ alignSelf: 'center' }}
                  />
                )}
                style={{ justifyContent: 'center' }}
                active={index === i && !sceneIndex}
                onPress={() => {
                  setSceneIndex(null);
                  setIndex(i);
                }}
              />
            ))}
          </View>

          <View style={{ flex: 1, padding: 20 }}>
            {sceneIndex ? renderScene({ key: sceneIndex }) : renderScene(routes[index])}
          </View>
        </View>
      </View>
    );
  }

  // MÓVIL
  return (
    <BottomNavigation
      navigationState={{ index, routes: mobileRoutes }}
      onIndexChange={(newIndex) => {
        setSceneIndex(null);
        setIndex(newIndex);
      }}
      renderScene={BottomNavigation.SceneMap({
        dashboard: () => renderScene(mobileRoutes[0]),
        perfil: () => renderScene(mobileRoutes[1]),
        config: () => renderScene(mobileRoutes[2]),
      })}
      renderIcon={({ route, focused, color }) => (
        <MaterialCommunityIcons name={route.icon} size={24} color={color} />
      )}
    />
  );
};

export default Dashboard;
