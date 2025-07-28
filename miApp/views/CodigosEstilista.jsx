// CodigosEstilista.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Share,
  StyleSheet,
} from 'react-native';
import {
  Title,
  Button,
  Text,
  Card,
  Snackbar,
} from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import axiosClient from '../axiosClient';

const CodigosEstilista = () => {
  const [codigos, setCodigos] = useState([]);
  const [copiadoVisible, setCopiadoVisible] = useState(false);

  const cargarCodigos = async () => {
    try {
      const res = await axiosClient.get('/codigos-estilista');
      setCodigos(res.data);
    } catch (error) {
      console.error('Error al cargar códigos:', error.message);
    }
  };

  const generarCodigo = async () => {
    try {
      const res = await axiosClient.post('/codigos-estilista');
      setCodigos([res.data, ...codigos]);
    } catch (error) {
      console.error('Error al generar código:', error.message);
    }
  };

  const copiarCodigo = async (codigo) => {
    await Clipboard.setStringAsync(codigo);
    setCopiadoVisible(true);
  };

  const compartirCodigo = async (codigo) => {
    try {
      await Share.share({
        message: `Tu código de estilista es:\n\n🔑 ${codigo}\n\nCópialo y pégalo en el registro de la app.`,
      });
    } catch (error) {
      console.error('Error al compartir:', error.message);
    }
  };

  useEffect(() => {
    cargarCodigos();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Title style={{ marginBottom: 20, textAlign: 'center' }}>
        Códigos de Estilistas
      </Title>

      <Button
        mode="contained"
        onPress={generarCodigo}
        style={{ marginBottom: 20 }}
      >
        Generar Nuevo Código
      </Button>

      {codigos.map((c) => (
        <Card key={c.id} style={styles.card}>
          <Text>
            Código:{' '}
            <Text style={{ fontWeight: 'bold' }}>{c.codigo}</Text>
          </Text>
          <Text>Estado: {c.usado ? 'Usado' : 'Disponible'}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => copiarCodigo(c.codigo)}
              style={[styles.button, { backgroundColor: '#1976D2' }]}
            >
              <Text style={styles.buttonText}>Copiar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => compartirCodigo(c.codigo)}
              style={[styles.button, { backgroundColor: '#43A047' }]}
            >
              <Text style={styles.buttonText}>Compartir</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}

      <Snackbar
        visible={copiadoVisible}
        onDismiss={() => setCopiadoVisible(false)}
        duration={2000}
        style={{ backgroundColor: '#323232' }}
      >
        Código copiado al portapapeles
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CodigosEstilista;
