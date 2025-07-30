import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { enviarResena } from '../axiosClient'; // Asegúrate que esta funcione correctamente

const CrearResena = ({ route, navigation }) => {
  const { citaId, estilista } = route.params;
  const [comentario, setComentario] = useState('');
  const [estrellas, setEstrellas] = useState(0);
  const [enviando, setEnviando] = useState(false);

  const handleEnviar = async () => {
    if (!comentario || estrellas === 0) {
      Alert.alert('Faltan campos', 'Por favor, selecciona estrellas y deja un comentario.');
      return;
    }

    try {
      setEnviando(true);
      await enviarResena({
        comentario,
        estrellas,
        cita_id: citaId,
      });
      Alert.alert('¡Gracias!', 'Tu reseña ha sido enviada.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al enviar la reseña', error);
      Alert.alert('Error', 'No se pudo enviar la reseña');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Reseña para {estilista}</Title>

      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Icon
            key={i}
            name={i <= estrellas ? 'star' : 'star-outline'}
            size={30}
            color="#FFD700"
            onPress={() => setEstrellas(i)}
          />
        ))}
      </View>

      <TextInput
        label="Comentario"
        mode="outlined"
        multiline
        numberOfLines={4}
        value={comentario}
        onChangeText={setComentario}
        style={{ marginVertical: 10 }}
      />

      <Button
        mode="contained"
        onPress={handleEnviar}
        loading={enviando}
        disabled={enviando}
      >
        Enviar Reseña
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 15,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
});

export default CrearResena;
