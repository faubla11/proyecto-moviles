import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Text,
  Avatar,
  Menu,
  Button,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { obtenerEstilistas, filtrarResenas } from '../axiosClient';

const VerResenas = () => {
  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [estilistas, setEstilistas] = useState([]);
  const [estilistaSeleccionado, setEstilistaSeleccionado] = useState(null);
  const [estrellasSeleccionadas, setEstrellasSeleccionadas] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    cargarEstilistas();
  }, []);

  useEffect(() => {
    cargarResenas();
  }, [estilistaSeleccionado, estrellasSeleccionadas]);

  const cargarEstilistas = async () => {
    try {
      const data = await obtenerEstilistas();
      setEstilistas(data);
    } catch (error) {
      console.error('Error al obtener estilistas:', error.message);
    }
  };

  const cargarResenas = async () => {
    setCargando(true);
    try {
      const filtros = {};
      if (estilistaSeleccionado) filtros.estilista_id = estilistaSeleccionado;
      if (estrellasSeleccionadas) filtros.estrellas = estrellasSeleccionadas;
      const data = await filtrarResenas(filtros);
      setResenas(data);
    } catch (error) {
      console.error('Error al cargar reseñas:', error.message);
    } finally {
      setCargando(false);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.usuario?.nombre || 'Usuario'}
        subtitle={`Estilista: ${item.estilista?.nombre || item.estilista_id}`}
        left={(props) => (
          <Avatar.Text
            {...props}
            label={(item.usuario?.nombre || 'U')[0].toUpperCase()}
          />
        )}
      />
      <Card.Content>
        <Text style={styles.estrellasTexto}>⭐ {item.estrellas} estrellas</Text>
        <Paragraph>{item.comentario || 'Sin comentario.'}</Paragraph>
      </Card.Content>
    </Card>
  );

  const renderFiltroEstrellas = () => (
    <View style={styles.filtroEstrellas}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity key={n} onPress={() => setEstrellasSeleccionadas(n)}>
          <Text
            style={[
              styles.estrellaItem,
              estrellasSeleccionadas === n && styles.estrellaSeleccionada,
            ]}
          >
            {Array(n).fill('⭐').join('')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderFiltroEstilista = () => (
    <View style={styles.filtroDropdown}>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            style={styles.dropdownBtn}
          >
            {estilistaSeleccionado
              ? estilistas.find((e) => e.id === estilistaSeleccionado)?.nombre
              : 'Seleccionar estilista'}
          </Button>
        }
      >
        {estilistas.map((e) => (
          <Menu.Item
            key={e.id}
            title={e.nombre}
            onPress={() => {
              setEstilistaSeleccionado(e.id);
              setMenuVisible(false);
            }}
          />
        ))}
        <Menu.Item
          title="Todos"
          onPress={() => {
            setEstilistaSeleccionado(null);
            setMenuVisible(false);
          }}
        />
      </Menu>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Title style={styles.title}>Reseñas de Clientes</Title>

      {renderFiltroEstilista()}
      {renderFiltroEstrellas()}

      {cargando ? (
        <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={resenas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  estrellasTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  filtroDropdown: {
    marginBottom: 10,
    alignSelf: 'center',
  },
  filtroEstrellas: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  estrellaItem: {
    fontSize: 18,
    padding: 5,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  estrellaSeleccionada: {
    backgroundColor: '#ffe082',
    borderColor: '#fbc02d',
  },
  dropdownBtn: {
    borderRadius: 8,
    paddingHorizontal: 15,
  },
});

export default VerResenas;
