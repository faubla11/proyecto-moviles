import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Paragraph, Button } from 'react-native-paper';

const Ubicacion = () => {
  const latitude = -0.952243;
  const longitude = -80.744887;

  const abrirGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  return (
    <View style={styles.container}>
      <iframe
        title="Mapa Web"
        width="100%"
        height="300"
        style={styles.map}
        frameBorder="0"
        src={`https://www.google.com/maps/embed/v1/place?key=TU_API_KEY_DE_GOOGLE_MAPS&q=${latitude},${longitude}`}
        allowFullScreen
      />
      <View style={styles.cardWrapper}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  map: {
    borderRadius: 8,
    marginBottom: 16,
  },
  cardWrapper: {
    marginTop: 10,
  },
  infoCard: {
    borderRadius: 12,
    elevation: 5,
  },
});

export default Ubicacion;
