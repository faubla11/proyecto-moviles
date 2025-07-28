import React from 'react';
import { View, StyleSheet, Linking, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Text, Button, Card, Paragraph } from 'react-native-paper';

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

      {/* Tarjeta fija sobre el marcador */}
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
    top: Dimensions.get('window').height / 2 - 120, // aproximado al marcador
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
