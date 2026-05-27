import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

// ─── CHAT ────────────────────────────────────────────────────────────────────
export const enviarMensaje = async (mensaje, historial, sesion_id) => {
    const { data } = await api.post('/chat/mensaje', {
        mensaje,
        historial,
        sesion_id
    });
    return data;
};

export const obtenerHistorial = async (sesion_id) => {
    const { data } = await api.get(`/chat/historial/${sesion_id}`);
    return data;
};

// ─── MATCH VOCACIONAL ─────────────────────────────────────────────────────────
export const matchVocacional = async (perfil) => {
    const { data } = await api.post('/vocacional/match', perfil);
    return data;
};

export const listarCarreras = async () => {
    const { data } = await api.get('/vocacional/carreras');
    return data;
};

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
export const getEstadisticas = async () => {
    const { data } = await api.get('/dashboard/estadisticas');
    return data;
};