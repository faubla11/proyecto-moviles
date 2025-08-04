import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Paragraph } from 'react-native-paper';
import { Linking } from 'react-native';

const Ubicacion = () => {
  const latitude = -0.952243;
  const longitude = -80.744887;

  const abrirGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url).catch(err =>
      console.error("No se pudo abrir Google Maps", err)
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.infoCard}>
        <Card.Title title="📍 Peluquería Mi Estilo" />
        <Card.Content>
          <Paragraph>Manta, Ecuador</Paragraph>
          <Paragraph>🕒 Lunes a Domingo: 09:00 - 21:00</Paragraph>
          <Paragraph>📞 +593 98 051 8380</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={abrirGoogleMaps}>
            Ver en Google Maps
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  infoCard: {
    borderRadius: 12,
    elevation: 5,
  },
});

export default Ubicacion;
