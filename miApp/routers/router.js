import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserContext } from '../contexts/UserContext';

import Login from '../views/Login';
import Register from '../views/Register';
import Dashboard from '../views/Dashboard';
import CitasDetalle from '../views/CitasDetalle';
import AgendarCita from '../views/AgendarCita';
import Ubicacion from '../views/Ubicacion'; 

  
const Stack = createNativeStackNavigator();

const Router = () => {
  const { usuario, cargando } = useContext(UserContext);

  if (cargando) return null; // o un splash/loading screen

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {usuario ? (
          <>
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="CitasDetalle" component={CitasDetalle} />
            <Stack.Screen name="AgendarCita" component={AgendarCita} options={{ title: 'Agendar Cita' }} />
            <Stack.Screen name="Ubicacion" component={Ubicacion} options={{ title: 'Ubicación' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
