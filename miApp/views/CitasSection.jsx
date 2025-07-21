import React from 'react';
import { ScrollView } from 'react-native';
import { Card, Paragraph, Button, List } from 'react-native-paper';

const CitasSection = ({ navigation }) => {
  const citas = [
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
      description: 'Calle Falsa 123, Peluquería Bryan Style.',
      actionText: 'Ver en mapa',
      onAction: () => alert('Abrir mapa'),
    },
    {
      key: 'resenas',
      title: 'Reseñas',
      icon: 'star-circle',
      description: 'Reseñas de los clientes.',
      actionText: 'Leer opiniones',
      onAction: () => alert('Mostrar reseñas'),
    },
  ];

  return (
    <ScrollView style={{ padding: 10 }}>
      {citas.map(({ key, title, icon, description, actionText, onAction, routeName, tipoCita }) => (
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
      ))}
    </ScrollView>
  );
};

export default CitasSection;
