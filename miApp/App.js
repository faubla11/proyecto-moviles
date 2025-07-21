import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';

import Router from './routers/router';
import { UserProvider } from './contexts/UserContext';


export default function App() {
  return (
    <PaperProvider>
      <UserProvider>
        <Router />
        <StatusBar style="auto" />
      </UserProvider>
    </PaperProvider>
  );
}
