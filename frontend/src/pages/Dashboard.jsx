import { useState, useEffect } from 'react';
import { getEstadisticas } from '../api';

const CARRERAS_BASE = [
  'Ingeniería en Informática',
  'Ingeniería en Electrónica',
  'Ingeniería Industrial',
  'Ingeniería en Mecánica',
  'Ingeniería en Energías Renovables',
  'Ingeniería en Gestión Empresarial',
];

function Dashboard() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    setCargando(true);
    try {
      const res = await getEstadisticas();
      setDatos(res);
    } catch {
      console.error('Error al cargar estadísticas');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, 30000);
    return () => clearInterval(intervalo);
  }, []);

  const carrerasMerged = CARRERAS_BASE.map(nombre => {
    const encontrada = datos?.carreras.find(c => c.carrera === nombre);
    return encontrada
      ? { ...encontrada, total: Number(encontrada.total), promedio_match: Number(encontrada.promedio_match) }
      : { carrera: nombre, total: 0, promedio_match: 0 };
  });

  const totalTests = carrerasMerged.reduce((acc, c) => acc + c.total, 0);
  const maxTotal = Math.max(...carrerasMerged.map(c => c.total), 1);
  const carreraMasSolicitada = [...carrerasMerged].sort((a, b) => b.total - a.total).find(c => c.total > 0)?.carrera ?? '—';
  return (
    <div className="min-h-full px-6 py-10"
      style={{ background: 'linear-gradient(135deg, #0a0f2e 0%, #0f1a3e 40%, #1a0a2e 100%)' }}>

      {/* Fondo punteado */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #ffffff0d 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">DataPulse</h1>
            <p className="text-blue-300/60 text-sm mt-1">Panel de administración — Departamento de Difusión ITSM</p>
          </div>
          <button onClick={cargar}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-white/10 hover:border-white/30 transition-all"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <span className={cargando ? 'animate-spin' : ''}>⟳</span>
            Actualizar
          </button>
        </div>

        {cargando && !datos && (
          <div className="text-center text-white/30 py-32 text-lg">Cargando estadísticas...</div>
        )}

        {datos && (
          <>
            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl border border-white/10 p-6 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
                <p className="text-5xl font-bold text-white mb-1">{totalTests}</p>
                <p className="text-blue-300/60 text-sm">Tests completados</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-6 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
                <p className="text-5xl font-bold text-green-400 mb-1">{datos.total_chats}</p>
                <p className="text-blue-300/60 text-sm">Conversaciones de chat</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-6 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
                <p className="text-lg font-bold text-purple-300 mb-1">{carreraMasSolicitada}</p>
                <p className="text-blue-300/60 text-sm">Carrera más solicitada</p>
              </div>
            </div>

            {/* Interés por carrera */}
            <div className="rounded-2xl border border-white/10 p-6 mb-6"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
              <h2 className="font-bold text-white mb-6">🎓 Interés por carrera</h2>
              <div className="space-y-5">
                {carrerasMerged.map((c, i) => {
                  const pct = c.promedio_match;
                  const colores = ['#2563eb', '#7c3aed', '#d97706', '#059669', '#0891b2', '#dc2626'];
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-white/80">{c.carrera}</span>
                        <span className="text-white/40">
                          {c.total} aspirantes · {c.promedio_match.toFixed(1)}% match
                        </span>
                      </div>
                      <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-2 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: colores[i % colores.length] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Municipios */}
            <div className="rounded-2xl border border-white/10 p-6"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
              <h2 className="font-bold text-white mb-4">📍 Distribución por municipio</h2>
              {!datos.municipios || datos.municipios.length === 0 ? (
                <p className="text-white/30 text-center py-8">Sin datos aún.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {datos.municipios.map((m, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-sm font-medium border border-white/10"
                      style={{ background: 'rgba(124,58,237,0.15)', color: '#c4b5fd' }}>
                      📍 {m.municipio} <span className="font-bold">({m.total})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="text-center text-white/20 text-xs mt-6">
              Última actualización: {new Date(datos.actualizado).toLocaleString('es-MX')}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
