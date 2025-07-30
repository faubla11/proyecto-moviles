import React, { useContext } from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Paragraph, Button, List, Title } from 'react-native-paper';
import { UserContext } from '../contexts/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const CitasSection = ({ navigation }) => {
  const { usuario } = useContext(UserContext);

  // Secciones base
  const citas = [
    ...(usuario?.es_estilista
      ? [
          {
            key: 'atender',
            title: 'Atender Citas',
            icon: 'scissors-cutting',
            description: 'Citas que debes atender como estilista.',
            actionText: 'Ver citas por atender',
            routeName: 'CitasDetalle',
            tipoCita: 'PorAtender', // Tipo personalizado para estilista
          },
          {
          key: 'historial-estilista',
          title: 'Historial de Atenciones',
          icon: 'history',
          description: 'Citas que ya has atendido como estilista.',
          actionText: 'Ver historial',
          routeName: 'CitasDetalle',
          tipoCita: 'HistorialAtendidas',
        },
        ]
      : []),
    {
      key: 'agendadas',
      title: 'Citas Agendadas',
      icon: 'calendar-check',
      description: 'Estas son tus citas que tienes programadas.',
      actionText: 'Ver detalles',
      routeName: 'CitasDetalle',
      tipoCita: 'Agendadas',
    },
    {
      key: 'canceladas',
      title: 'Citas Canceladas',
      icon: 'calendar-remove',
      description: 'Estas son las citas que fueron canceladas.',
      actionText: 'Ver historial',
      routeName: 'CitasDetalle',
      tipoCita: 'Canceladas',
    },
    {
      key: 'atendidas',
      title: 'Citas Atendidas',
      icon: 'calendar-check-outline',
      description: 'Citas que ya han sido atendidas.',
      actionText: 'Ver resumen',
      routeName: 'CitasDetalle',
      tipoCita: 'Atendidas',
    },
    {
      key: 'ubicacion',
      title: 'Ubicación',
      icon: 'map-marker',
      description: 'Ver ubicación del local.',
      actionText: 'Ver en mapa',
      routeName: 'Ubicacion',
    },
    {
    key: 'resenas',
    title: 'Reseñas',
    icon: 'star-circle',
    description: 'Reseñas de los clientes.',
    actionText: 'Leer opiniones',
    routeName: 'VerResenas',  
    },
  ];

  return (
    <ScrollView style={{ padding: 10 }}>
      <Title style={{ textAlign: 'center', marginBottom: 10 }}>Mis Citas</Title>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('AgendarCita')}
        style={{ marginBottom: 20, borderRadius: 10 }}
      >
        Nueva Cita
      </Button>

      {citas.map(
        ({ key, title, icon, description, actionText, onAction, routeName, tipoCita }) => (
          <Card key={key} style={{ marginBottom: 15, borderRadius: 12, elevation: 3 }}>
            <Card.Title
              title={title}
              left={(props) => <List.Icon {...props} icon={icon} />}
            />
            <Card.Content>
              <Paragraph>{description}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button
                onPress={
                  onAction
                    ? onAction
                    : () => navigation.navigate(routeName, { tipoCita })
                }
              >
                {actionText}
              </Button>
            </Card.Actions>
          </Card>
        )
      )}
    </ScrollView>
  );
};

export default CitasSection;
