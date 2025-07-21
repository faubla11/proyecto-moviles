// App.js
import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';

import Router from './routers/router';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext';

const AppContent = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <PaperProvider theme={theme}>
      <UserProvider>
        <Router />
        <StatusBar style="auto" />
      </UserProvider>
    </PaperProvider>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
