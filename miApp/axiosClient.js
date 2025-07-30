// axiosClient.js
import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = Constants.expoConfig.extra.API_BASE_URL;

const axiosClient = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a cada solicitud si existe
axiosClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Manejo centralizado de errores
const manejarError = (error) => {
  const data = error.response?.data;

  if (data?.errors) {
    const firstError = Object.values(data.errors)[0][0];
    return { message: firstError };
  }

  if (data?.message) {
    return { message: data.message };
  }

  if (data?.mensaje) {
    return { message: data.mensaje };
  }

  return { message: 'Error de red o del servidor' };
};

// 📌 Registrar nuevo usuario
export const registrarUsuario = async ({ nombre, correo, password, codigo_estilista }) => {
  try {
    const response = await axiosClient.post('/register', {
      nombre,
      correo,
      password,
      codigo_estilista,
    });
    return response.data;
  } catch (error) {
    throw manejarError(error);
  }
};

// 🔐 Iniciar sesión
export const iniciarSesion = async ({ email, password }) => {
  try {
    const response = await axiosClient.post('/login', {
      correo: email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error desconocido');
  }
};


// 🔒 Cerrar sesión
export const cerrarSesion = async () => {
  try {
    const response = await axiosClient.post('/logout');
    return response.data;
  } catch (error) {
    throw manejarError(error);
  }
};

// 📥 Obtener perfil del usuario actual
export const obtenerPerfil = async () => {
  try {
    const response = await axiosClient.get('/perfil');
    return response.data;
  } catch (error) {
    throw manejarError(error);
  }
};

// ✏️ Actualizar perfil del usuario actual
export const actualizarPerfil = async (perfil) => {
  try {
    const response = await axiosClient.put('/perfil', perfil);
    return response.data;
  } catch (error) {
    throw manejarError(error);
  }
};

export const agendarCita = async (cita) => {
  try {
    const response = await axiosClient.post('/citas', cita);
    return response.data;
  } catch (error) {
    throw manejarError(error);
  }
};


export const obtenerCitasPorEstado = async (estado) => {
  try {
    const response = await axiosClient.get(`/citas/estado/${estado.toLowerCase()}`);
    return response.data;
  } catch (error) {
    throw manejarError(error);
  }
};

export const obtenerServicios = async () => {
  try {
    const response = await axiosClient.get('/servicios');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    return [];
  }
};


export const obtenerEstilistas = async () => {
  const response = await axiosClient.get('/estilistas');
  return response.data;
};

export const obtenerHorasOcupadas = async (fecha, estilista) => {
  try {
    const response = await axiosClient.get('/horas-ocupadas', { // Aquí la ruta correcta
      params: { fecha, estilista }
    });
    return response.data;
  } catch (error) {
    console.error('Error obtener horas ocupadas:', error);
    return [];
  }
};

export const cancelarCita = async (id) => {
  try {
    const response = await axiosClient.post(`/citas/${id}/cancelar`);
    return response.data;
  } catch (error) {
    throw manejarError(error);
  }
};


// Ejemplo simplificado de carga de códigos
export const obtenerCodigos = async (token) => {
  try {
    const response = await axiosClient.get('/codigos-estilista', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al cargar códigos:', error);
    throw error;
  }
};

export const obtenerCitasPendientesEstilista = async () => {
  const res = await axiosClient.get('/estilista/citas/pendientes');
  return res.data;
};

export const obtenerCitasAtendidasEstilista = async () => {
  const res = await axiosClient.get('/estilista/citas/atendidas');
  return res.data;
};

export const marcarCitaComoAtendida = async (id) => {
  const res = await axiosClient.post(`/estilista/citas/${id}/atender`);
  return res.data;
};


export const enviarResena = async (datos) => {
  const res = await axiosClient.post('/resenas', datos);
  return res.data;
};

export const obtenerResenas = async () => {
  const res = await axiosClient.get('/resenas');
  return res.data;
};

export const filtrarResenas = async (filtros) => {
  const res = await axiosClient.get('/resenas/filtrar', { params: filtros });
  return res.data;
};

export const obtenerDiasBloqueados = async (estilista) => {
  const res = await axiosClient.get(`/dias-bloqueados`, {
    params: { estilista }
  });
  return res.data;
};

export const bloquearEstilista = async (datos) => {
  const res = await axiosClient.post('/bloquear-estilista', datos);
  return res.data;
};

export default axiosClient;
