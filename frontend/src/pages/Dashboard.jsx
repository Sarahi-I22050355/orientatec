import { useState, useEffect } from 'react';
import { getEstadisticas } from '../api';

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

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">📈 DataPulse</h1>
            <p className="text-gray-500">Panel de administración — Departamento de Difusión ITSM</p>
          </div>
          <button onClick={cargar}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-950">
            🔄 Actualizar
          </button>
        </div>

        {cargando && (
          <div className="text-center text-gray-400 py-20">Cargando estadísticas...</div>
        )}

        {!cargando && datos && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl shadow p-6 text-center">
                <p className="text-4xl font-bold text-blue-900">
                  {datos.carreras.reduce((acc, c) => acc + Number(c.total), 0)}
                </p>
                <p className="text-gray-500 mt-1">Tests completados</p>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 text-center">
                <p className="text-4xl font-bold text-green-600">{datos.total_chats}</p>
                <p className="text-gray-500 mt-1">Conversaciones de chat</p>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 text-center">
                <p className="text-4xl font-bold text-blue-700" style={{fontSize: '1.25rem'}}>
                  {datos.carreras.length > 0 ? datos.carreras[0].carrera : '—'}
                </p>
                <p className="text-gray-500 mt-1">Carrera más solicitada</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <h2 className="font-bold text-lg text-blue-900 mb-4">🎓 Interés por carrera</h2>
              {datos.carreras.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Aún no hay datos. Los resultados aparecerán cuando los aspirantes completen el test.
                </p>
              ) : (
                <div className="space-y-4">
                  {datos.carreras.map((c, i) => {
                    const max = Math.max(...datos.carreras.map(x => Number(x.total)));
                    const pct = Math.round((Number(c.total) / max) * 100);
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{c.carrera}</span>
                          <span className="text-gray-500">
                            {c.total} aspirantes · {Number(c.promedio_match).toFixed(1)}% match promedio
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div className="bg-blue-700 h-3 rounded-full transition-all"
                            style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="font-bold text-lg text-blue-900 mb-4">📍 Distribución por municipio</h2>
              {datos.carreras.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Sin datos aún.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {[...new Set(datos.carreras.map(c => c.municipio))].map((m, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      📍 {m}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="text-center text-gray-400 text-xs mt-6">
              Última actualización: {new Date(datos.actualizado).toLocaleString('es-MX')}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;