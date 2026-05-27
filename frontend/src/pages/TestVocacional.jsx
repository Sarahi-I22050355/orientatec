import { useState } from 'react';
import { matchVocacional } from '../api';

const EMPRESAS_POR_CARRERA = {
  ING_INFORMATICA: [
    { nombre: 'Alphabet de México', sector: 'Productivo' },
    { nombre: 'JCS Systems', sector: 'Productivo' },
    { nombre: 'Sistemas Evolución', sector: 'Servicios' },
    { nombre: 'GCORP', sector: 'Productivo' },
    { nombre: 'Aztec Diseño e Ingeniería', sector: 'Productivo' },
    { nombre: 'Online Career Center México', sector: 'Educativo' },
    { nombre: 'Centro Nacional de Capacitación Noreste', sector: 'Público' },
    { nombre: 'Corporación Mexicana de Investigación en Materiales', sector: 'Servicios' },
  ],
  ING_ELECTRONICA: [
    { nombre: 'AHMSA', sector: 'Productivo' },
    { nombre: 'Comisión Federal de Electricidad', sector: 'Productivo' },
    { nombre: 'Denso Air Systems de México', sector: 'Productivo' },
    { nombre: 'Steel Fab de México', sector: 'Productivo' },
    { nombre: 'Cyclonova S.A. de C.V.', sector: 'Productivo' },
    { nombre: 'Antiabrasivos y Tecnología Especializada', sector: 'Productivo' },
    { nombre: 'OGS Energy Services México', sector: 'Productivo' },
    { nombre: 'IMSA', sector: 'Productivo' },
  ],
  ING_INDUSTRIAL: [
    { nombre: 'AHMSA', sector: 'Productivo' },
    { nombre: 'Trinity Industries de México', sector: 'Productivo' },
    { nombre: 'Arca Continental', sector: 'Productivo' },
    { nombre: 'Aramark Monclova Manufacturing', sector: 'Productivo' },
    { nombre: 'Manpower', sector: 'Productivo' },
    { nombre: 'Grupo Industrial Monclova', sector: 'Productivo' },
    { nombre: 'FCA FASEMEX Enterprise', sector: 'Productivo' },
    { nombre: 'Promotora de Manufacturas', sector: 'Productivo' },
  ],
  ING_MECANICA: [
    { nombre: 'AHMSA', sector: 'Productivo' },
    { nombre: 'IMSA', sector: 'Productivo' },
    { nombre: 'Montajes Frontera S.A. de C.V.', sector: 'Productivo' },
    { nombre: 'Industrias Metálicas de Monclova', sector: 'Productivo' },
    { nombre: 'Constructora Industrial de Monclova', sector: 'Productivo' },
    { nombre: 'Refractarios Básicos S.A.', sector: 'Productivo' },
    { nombre: 'ACEROFRON S.A. de C.V.', sector: 'Productivo' },
    { nombre: 'Procesador de Metales Santa Ana', sector: 'Productivo' },
  ],
  ING_ENERGIAS: [
    { nombre: 'Comisión Federal de Electricidad', sector: 'Productivo' },
    { nombre: 'OGS Energy Services México', sector: 'Productivo' },
    { nombre: 'GIMSA Centro de Investigación y Desarrollo', sector: 'Productivo' },
    { nombre: 'Proyectos y Construcciones de Coahuila', sector: 'Productivo' },
    { nombre: 'Corporación Mexicana de Investigación en Materiales', sector: 'Servicios' },
    { nombre: 'Secretaría de Salud de Coahuila', sector: 'Público' },
  ],
  ING_GESTION: [
    { nombre: 'Cámara Nacional de Comercio', sector: 'Productivo' },
    { nombre: 'Cámara Nacional de la Industria de Transformación', sector: 'Servicios' },
    { nombre: 'Manpower', sector: 'Productivo' },
    { nombre: 'Grupo FOX', sector: 'Productivo' },
    { nombre: 'Arca Continental', sector: 'Productivo' },
    { nombre: 'Hospital Sainte Marie', sector: 'Servicios' },
    { nombre: 'Presidencia Municipal de Monclova', sector: 'Público' },
    { nombre: 'Monclova Country Club A.C.', sector: 'Social' },
  ],
};

const COLORES_SECTOR = {
  'Productivo': 'bg-blue-100 text-blue-800',
  'Servicios': 'bg-purple-100 text-purple-800',
  'Público': 'bg-green-100 text-green-800',
  'Educativo': 'bg-yellow-100 text-yellow-800',
  'Social': 'bg-orange-100 text-orange-800',
};

function TestVocacional() {
  const [paso, setPaso] = useState(1);
  const [form, setForm] = useState({
    nombre: '', bachillerato_origen: '', municipio: '',
    materias_favoritas: [], pasatiempos: [],
    habilidad_logica: 50, habilidad_diseno: 50,
    habilidad_liderazgo: 50, habilidad_manual: 50,
    entorno_laboral: '', prioridad_profesional: '',
    texto_libre: ''
  });
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const actualizar = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }));

  const toggleLista = (campo, valor) => {
    setForm(f => ({
      ...f,
      [campo]: f[campo].includes(valor)
        ? f[campo].filter(x => x !== valor)
        : [...f[campo], valor]
    }));
  };

  const enviar = async () => {
    setCargando(true);
    try {
      const res = await matchVocacional(form);
      setResultado(res);
      setPaso(4);
    } catch {
      alert('Error al procesar el test, intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const normalizarPorcentajes = (prediccion) => {
    const total = prediccion.reduce((sum, c) => sum + c.porcentaje_match, 0);
    return prediccion.map(c => ({
      ...c,
      porcentaje_match: Math.round((c.porcentaje_match / total) * 1000) / 10
    }));
  };

  const materias = ['Matemáticas', 'Física', 'Química', 'Programación', 'Dibujo Técnico', 'Liderazgo'];
  const hobbies = ['Armar circuitos', 'Programar', 'Diseñar piezas', 'Organizar equipos', 'Cuidar el ambiente', 'Reparar aparatos'];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-xl">

        <h1 className="text-3xl font-bold text-blue-900 mb-2">📊 Test Vocacional</h1>
        <p className="text-gray-500 mb-8">Descubre qué ingeniería es para ti</p>

        {/* PASO 1 */}
        {paso === 1 && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h2 className="font-bold text-lg text-blue-800">Paso 1 — Datos personales</h2>
            <input className="w-full border rounded-lg px-4 py-2" placeholder="Tu nombre"
              value={form.nombre} onChange={e => actualizar('nombre', e.target.value)} />
            <select className="w-full border rounded-lg px-4 py-2"
              value={form.bachillerato_origen} onChange={e => actualizar('bachillerato_origen', e.target.value)}>
              <option value="">¿De qué bachillerato vienes?</option>
              <optgroup label="── Públicas / Federales ──">
                <option>CECyTEC Plantel Venustiano Carranza</option>
                <option>CECyTEC Plantel John F. Kennedy</option>
                <option>CECyTEC Plantel Monclova Xochipilli</option>
                <option>CBTiS Núm. 36</option>
                <option>COBAC Carmen Elizondo de Ancira</option>
                <option>COBAC Francisco I. Madero</option>
                <option>COBAC Manuel Acuña – Unidad Monclova</option>
                <option>Esc. de Bachilleres Prof. Ladislao Farías Campos</option>
                <option>Preparatoria de Formación Integral de Monclova</option>
                <option>Preparatoria Venustiano Carranza</option>
                <option>Bachilleres Valle de Coahuila</option>
                <option>EMSAD</option>
                <option>Telebachillerato Comunitario</option>
              </optgroup>
              <optgroup label="── Privadas ──">
                <option>Colegio La Salle de Monclova</option>
                <option>Instituto Central Coahuila</option>
                <option>Colegio María Montessori de Monclova</option>
                <option>Bachillerato Pan American School</option>
                <option>Santiago de la Monclova</option>
                <option>Escuela Preparatoria Justo Sierra</option>
                <option>Colegio México de Nivel Medio Superior</option>
                <option>UANE Campus Monclova</option>
                <option>Colegio Regional de Educación de Monclova</option>
                <option>Escuela de Bachilleres América</option>
                <option>Universidad Metropolitana de Coahuila</option>
                <option>Preparatoria Colegio Zaragoza</option>
                <option>Centro Universitario Coahuilense</option>
                <option>Instituto Valle de Coahuila</option>
                <option>Colegio Vizcaya de las Américas</option>
                <option>Instituto Miguel Ángel</option>
                <option>Centro de Estudios Juan Larios</option>
                <option>Escuela Preparatoria Universidad de Durango</option>
                <option>Prof. Ezequiel Narváez T.</option>
                <option>Escuela Preparatoria Centro Educativo Guadalupe Victoria</option>
              </optgroup>
              <optgroup label="── Otro ──">
                <option>Otro</option>
              </optgroup>
            </select>
            <input className="w-full border rounded-lg px-4 py-2" placeholder="Tu municipio"
              value={form.municipio} onChange={e => actualizar('municipio', e.target.value)} />
            <button onClick={() => setPaso(2)}
              disabled={!form.nombre || !form.bachillerato_origen || !form.municipio}
              className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50">
              Siguiente →
            </button>
          </div>
        )}

        {/* PASO 2 */}
        {paso === 2 && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-5">
            <h2 className="font-bold text-lg text-blue-800">Paso 2 — Intereses y habilidades</h2>
            <div>
              <p className="text-sm font-medium mb-2">Materias favoritas:</p>
              <div className="flex flex-wrap gap-2">
                {materias.map(m => (
                  <button key={m} onClick={() => toggleLista('materias_favoritas', m)}
                    className={`px-3 py-1 rounded-full text-sm border transition
                      ${form.materias_favoritas.includes(m) ? 'bg-blue-700 text-white border-blue-700' : 'border-gray-300 text-gray-600'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Pasatiempos:</p>
              <div className="flex flex-wrap gap-2">
                {hobbies.map(h => (
                  <button key={h} onClick={() => toggleLista('pasatiempos', h)}
                    className={`px-3 py-1 rounded-full text-sm border transition
                      ${form.pasatiempos.includes(h) ? 'bg-blue-700 text-white border-blue-700' : 'border-gray-300 text-gray-600'}`}>
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPaso(1)} className="flex-1 border border-blue-700 text-blue-700 py-2 rounded-lg">← Atrás</button>
              <button onClick={() => setPaso(3)} className="flex-1 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800">Siguiente →</button>
            </div>
          </div>
        )}

        {/* PASO 3 */}
        {paso === 3 && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-5">
            <h2 className="font-bold text-lg text-blue-800">Paso 3 — Tu perfil</h2>
            {[
              { label: '🧮 Lógica / Matemáticas', campo: 'habilidad_logica' },
              { label: '🎨 Creatividad / Diseño', campo: 'habilidad_diseno' },
              { label: '👥 Liderazgo / Comunicación', campo: 'habilidad_liderazgo' },
              { label: '🔧 Habilidad Manual / Técnica', campo: 'habilidad_manual' },
            ].map(({ label, campo }) => (
              <div key={campo}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{label}</span>
                  <span className="font-bold text-blue-700">{form[campo]}</span>
                </div>
                <input type="range" min="0" max="100" value={form[campo]}
                  onChange={e => actualizar(campo, Number(e.target.value))}
                  className="w-full accent-blue-700" />
              </div>
            ))}
            <select className="w-full border rounded-lg px-4 py-2"
              value={form.entorno_laboral} onChange={e => actualizar('entorno_laboral', e.target.value)}>
              <option value="">¿Dónde te ves trabajando?</option>
              <option>Planta industrial y talleres especializados</option>
              <option>Oficina o empresa de tecnología</option>
              <option>Laboratorio de investigación</option>
              <option>Mi propia empresa</option>
              <option>Trabajo remoto desde casa</option>
            </select>
            <textarea className="w-full border rounded-lg px-4 py-2 text-sm" rows={3}
              placeholder="Cuéntanos en tus propias palabras qué te apasiona o qué te gustaría hacer..."
              value={form.texto_libre} onChange={e => actualizar('texto_libre', e.target.value)} />
            <div className="flex gap-2">
              <button onClick={() => setPaso(2)} className="flex-1 border border-blue-700 text-blue-700 py-2 rounded-lg">← Atrás</button>
              <button onClick={enviar} disabled={cargando || !form.entorno_laboral}
                className="flex-1 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50">
                {cargando ? 'Analizando...' : '🔍 Ver mi resultado'}
              </button>
            </div>
          </div>
        )}

        {/* PASO 4 — Resultado */}
        {paso === 4 && resultado && (() => {
          const prediccionNorm = normalizarPorcentajes(resultado.prediccion);
          const topCarreraId = resultado.prediccion[0]?.carrera_id;
          const empresas = EMPRESAS_POR_CARRERA[topCarreraId] || [];

          return (
            <div className="space-y-4">

              <div className="bg-blue-800 text-white rounded-2xl p-6 text-center">
                <p className="text-blue-200 text-sm mb-1">Resultado para</p>
                <h2 className="text-2xl font-bold">{resultado.aspirante}</h2>
                <p className="mt-2 text-blue-200">{resultado.perfil_detectado}</p>
              </div>

              {prediccionNorm.map((carrera, i) => (
                <div key={i} className="bg-white rounded-2xl shadow p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-blue-900">{carrera.nombre_carrera}</h3>
                    <span className="text-2xl font-bold text-blue-700">{carrera.porcentaje_match}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${carrera.porcentaje_match}%` }} />
                  </div>
                  <p className="text-gray-600 text-sm">{carrera.razonamiento}</p>
                </div>
              ))}

              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                <p className="text-green-800 font-medium">📬 Próxima acción</p>
                <p className="text-green-700 text-sm mt-1">{resultado.proxima_accion}</p>
              </div>

              {empresas.length > 0 && (
                <div className="bg-white rounded-2xl shadow p-5">
                  <h3 className="font-bold text-blue-900 mb-1">🏭 Empresas donde puedes hacer residencias</h3>
                  <p className="text-gray-500 text-xs mb-4">
                    Convenio directo con el TecNM Campus Monclova — {prediccionNorm[0]?.nombre_carrera}
                  </p>
                  <div className="space-y-2">
                    {empresas.map((e, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="text-sm text-gray-800">{e.nombre}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${COLORES_SECTOR[e.sector] || 'bg-gray-100 text-gray-600'}`}>
                          {e.sector}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => {
                setPaso(1); setResultado(null);
                setForm({ nombre: '', bachillerato_origen: '', municipio: '', materias_favoritas: [], pasatiempos: [], habilidad_logica: 50, habilidad_diseno: 50, habilidad_liderazgo: 50, habilidad_manual: 50, entorno_laboral: '', prioridad_profesional: '', texto_libre: '' });
              }} className="w-full border border-blue-700 text-blue-700 py-2 rounded-lg hover:bg-blue-50">
                🔄 Hacer el test de nuevo
              </button>

            </div>
          );
        })()}

      </div>
    </div>
  );
}

export default TestVocacional;