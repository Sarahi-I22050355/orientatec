import { useState, useEffect, useRef } from 'react';
import { getEstadisticas } from '../api';
import { useIdioma } from '../i18n/contexto';

const CARRERAS_BASE = [
  'Ingeniería en Informática',
  'Ingeniería en Electrónica',
  'Ingeniería Industrial',
  'Ingeniería en Mecánica',
  'Ingeniería en Energías Renovables',
  'Ingeniería en Gestión Empresarial',
  'Ingeniería Mecatrónica',
];

function Dashboard() {
  const { t, etiqueta } = useIdioma();
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const enCurso = useRef(false);

  const traer = () => {
    // Evita peticiones duplicadas si la anterior aún no termina.
    if (enCurso.current) return;
    enCurso.current = true;
    getEstadisticas()
      .then(res => setDatos(res))
      .catch(() => console.error('Error al cargar estadísticas'))
      .finally(() => {
        enCurso.current = false;
        setCargando(false);
      });
  };

  const cargar = () => {
    if (enCurso.current) return;
    setCargando(true);
    traer();
  };

  useEffect(() => {
    traer();
    const intervalo = setInterval(() => {
      // No consultar mientras la pestaña está oculta.
      if (!document.hidden) cargar();
    }, 30000);
    return () => clearInterval(intervalo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carrerasMerged = CARRERAS_BASE.map(nombre => {
    const encontrada = datos?.carreras.find(c => c.carrera === nombre);
    return encontrada
      ? { ...encontrada, total: Number(encontrada.total), promedio_match: Number(encontrada.promedio_match) }
      : { carrera: nombre, total: 0, promedio_match: 0 };
  });

  const totalTests = carrerasMerged.reduce((acc, c) => acc + c.total, 0);
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
            <p className="text-blue-300/60 text-sm mt-1">{t.dashboard.subtitulo}</p>
          </div>
          <button onClick={cargar}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-white/10 hover:border-white/30 transition-all"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <span className={cargando ? 'animate-spin' : ''}>⟳</span>
            {t.dashboard.actualizar}
          </button>
        </div>

        {cargando && !datos && (
          // Esqueleto de carga: misma forma que el panel para que no "salte".
          <div className="animate-pulse" role="status" aria-label={t.dashboard.cargando}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[0, 1, 2].map(i => (
                <div key={i} className="rounded-2xl border border-white/10 p-6 h-[116px]"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="h-10 w-16 mx-auto rounded-lg bg-white/10 mb-3" />
                  <div className="h-3 w-32 mx-auto rounded bg-white/10" />
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-white/10 p-6 space-y-6"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="h-4 w-40 rounded bg-white/10" />
              {CARRERAS_BASE.map(nombre => (
                <div key={nombre} className="space-y-2">
                  <div className="h-3 w-56 rounded bg-white/10" />
                  <div className="h-2 w-full rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        )}

        {datos && (
          <>
            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl border border-white/10 p-6 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
                <p className="text-5xl font-bold text-white mb-1">{totalTests}</p>
                <p className="text-blue-300/60 text-sm">{t.dashboard.tests}</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-6 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
                <p className="text-5xl font-bold text-green-400 mb-1">{datos.total_chats}</p>
                <p className="text-blue-300/60 text-sm">{t.dashboard.chats}</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-6 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
                <p className="text-lg font-bold text-purple-300 mb-1">{etiqueta(carreraMasSolicitada)}</p>
                <p className="text-blue-300/60 text-sm">{t.dashboard.masSolicitada}</p>
              </div>
            </div>

            {/* Interés por carrera */}
            <div className="rounded-2xl border border-white/10 p-6 mb-6"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}>
              <h2 className="font-bold text-white mb-6">{t.dashboard.interes}</h2>
              <div className="space-y-5">
                {carrerasMerged.map((c, i) => {
                  const pct = c.promedio_match;
                  const colores = ['#2563eb', '#7c3aed', '#d97706', '#059669', '#0891b2', '#dc2626', '#db2777'];
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-white/80">{etiqueta(c.carrera)}</span>
                        <span className="text-white/40">
                          {c.total} {t.dashboard.aspirantes} · {c.promedio_match.toFixed(1)}% {t.dashboard.match}
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
              <h2 className="font-bold text-white mb-4">{t.dashboard.municipios}</h2>
              {!datos.municipios || datos.municipios.length === 0 ? (
                <p className="text-white/30 text-center py-8">{t.dashboard.sinDatos}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {datos.municipios.map((m, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-sm font-medium border border-white/10"
                      style={{ background: 'rgba(124,58,237,0.15)', color: '#c4b5fd' }}>
                      📍 {etiqueta(m.municipio)} <span className="font-bold">({m.total})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="text-center text-white/20 text-xs mt-6">
              {t.dashboard.ultima} {new Date(datos.actualizado).toLocaleString(t.dashboard.locale)}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
