import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserContext } from '../contexts/UserContext';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // ✅

import Login from '../views/Login';
import Register from '../views/Register';
import Dashboard from '../views/Dashboard';
import CitasDetalle from '../views/CitasDetalle';
import AgendarCita from '../views/AgendarCita';
import Ubicacion from '../views/Ubicacion';
import CrearResena from '../views/CrearResena';
import VerResenas from '../views/VerResenas';

const Stack = createNativeStackNavigator();

const Router = () => {
  const { usuario, cargando } = useContext(UserContext);

  if (cargando) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {usuario ? (
            <>
              <Stack.Screen name="Dashboard" component={Dashboard} />
              <Stack.Screen name="CitasDetalle" component={CitasDetalle} />
              <Stack.Screen name="AgendarCita" component={AgendarCita} />
              <Stack.Screen name="Ubicacion" component={Ubicacion} />
              <Stack.Screen name="CrearResena" component={CrearResena} />
              <Stack.Screen name="VerResenas" component={VerResenas} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Router;
