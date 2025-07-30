import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  Linking,
} from 'react-native';
import { Text, Button, Card, Paragraph } from 'react-native-paper';

let MapView, Marker;
if (Platform.OS !== 'web') {
  MapView = require('react-native-maps').default;
  Marker = require('react-native-maps').Marker;
}

const Ubicacion = () => {
  const latitude = -0.952243;
  const longitude = -80.744887;

  const abrirGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      console.error('No se pudo abrir Google Maps', err)
    );
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <View style={{ flex: 1 }}>
          <iframe
            title="Mapa Web"
            width="100%"
            height="100%"
            style={styles.map}
            frameBorder="0"
            src={`https://www.google.com/maps/embed/v1/place?key=TU_API_KEY_DE_GOOGLE_MAPS&q=${latitude},${longitude}`}
            allowFullScreen
          />
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: latitude + 0.0012,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker coordinate={{ latitude, longitude }} />
        </MapView>
      )}

      {/* Tarjeta fija sobre el mapa */}
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
  },
  map: {
    flex: 1,
  },
  cardWrapper: {
    position: 'absolute',
    top: Dimensions.get('window').height / 2 - 120,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  infoCard: {
    width: '100%',
    borderRadius: 12,
    elevation: 5,
  },
});

export default Ubicacion;
