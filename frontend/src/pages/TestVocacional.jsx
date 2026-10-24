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
  'Productivo': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  'Servicios':  'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  'Público':    'bg-green-500/20 text-green-300 border border-green-500/30',
  'Educativo':  'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  'Social':     'bg-orange-500/20 text-orange-300 border border-orange-500/30',
};

const PASOS_LABELS = ['Datos', 'Intereses', 'Perfil', 'Resultado'];

function Stepper({ paso }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {PASOS_LABELS.map((nombre, i) => {
        const num = i + 1;
        const completado = paso >= num;
        const activo = paso === num;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                ${activo ? 'text-white' : completado ? 'bg-green-500 text-white' : 'text-white/30 border border-white/20'}`}
                style={activo ? { background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' } : {}}>
                {completado && !activo ? '✓' : num}
              </div>
              <span className={`text-xs mt-1 ${activo ? 'text-white' : completado ? 'text-green-400' : 'text-white/30'}`}>
                {nombre}
              </span>
            </div>
            {i < 3 && (
              <div className={`w-12 h-0.5 mb-5 mx-1 transition-all duration-300 ${paso > num ? 'bg-green-500' : 'bg-white/15'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TestVocacional() {
  const [paso, setPaso] = useState(1);
  const [form, setForm] = useState({
    bachillerato_origen: '', municipio: '',
    materias_favoritas: [], pasatiempos: [],
    habilidad_logica: 50, habilidad_diseno: 50,
    habilidad_liderazgo: 50, habilidad_manual: 50,
    entorno_laboral: '', prioridad_profesional: '',
    texto_libre: ''
  });
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [carruselIdx, setCarruselIdx] = useState(0);

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
      setCarruselIdx(0);
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

  const selectStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'white',
  };

  const cardStyle = {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(8px)',
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10"
      style={{ background: 'linear-gradient(135deg, #0a0f2e 0%, #0f1a3e 40%, #1a0a2e 100%)' }}>

      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #ffffff0d 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative z-10 w-full max-w-xl">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">📊 Test Vocacional</h1>
          <p className="text-blue-300/70">Descubre qué ingeniería es para ti</p>
        </div>

        <Stepper paso={paso} />

        {/* PASO 1 */}
        {paso === 1 && (
          <div className="rounded-2xl p-6 space-y-4 border border-white/10" style={cardStyle}>
            <h2 className="font-bold text-lg text-white">Paso 1 — Datos personales</h2>
            <select className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={selectStyle}
              value={form.bachillerato_origen} onChange={e => actualizar('bachillerato_origen', e.target.value)}>
              <option value="" style={{ background: '#0f1a3e' }}>¿De qué bachillerato vienes?</option>
              <optgroup label="── Públicas / Federales ──">
                {['CECyTEC Plantel Venustiano Carranza','CECyTEC Plantel John F. Kennedy','CECyTEC Plantel Monclova Xochipilli','CBTiS Núm. 36','COBAC Carmen Elizondo de Ancira','COBAC Francisco I. Madero','COBAC Manuel Acuña – Unidad Monclova','Esc. de Bachilleres Prof. Ladislao Farías Campos','Preparatoria de Formación Integral de Monclova','Preparatoria Venustiano Carranza','Bachilleres Valle de Coahuila','EMSAD','Telebachillerato Comunitario'].map(o =>
                  <option key={o} style={{ background: '#0f1a3e' }}>{o}</option>)}
              </optgroup>
              <optgroup label="── Privadas ──">
                {['Colegio La Salle de Monclova','Instituto Central Coahuila','Colegio María Montessori de Monclova','Bachillerato Pan American School','Santiago de la Monclova','Escuela Preparatoria Justo Sierra','Colegio México de Nivel Medio Superior','UANE Campus Monclova','Colegio Regional de Educación de Monclova','Escuela de Bachilleres América','Universidad Metropolitana de Coahuila','Preparatoria Colegio Zaragoza','Centro Universitario Coahuilense','Instituto Valle de Coahuila','Colegio Vizcaya de las Américas','Instituto Miguel Ángel','Centro de Estudios Juan Larios','Escuela Preparatoria Universidad de Durango','Prof. Ezequiel Narváez T.','Escuela Preparatoria Centro Educativo Guadalupe Victoria'].map(o =>
                  <option key={o} style={{ background: '#0f1a3e' }}>{o}</option>)}
              </optgroup>
              <optgroup label="── Otro ──">
                <option style={{ background: '#0f1a3e' }}>Otro</option>
              </optgroup>
            </select>

            <select className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={selectStyle}
              value={form.municipio} onChange={e => actualizar('municipio', e.target.value)}>
              <option value="" style={{ background: '#0f1a3e' }}>¿De qué municipio eres?</option>
              <optgroup label="── Región Centro-Norte ──">
                {['Monclova','Frontera','San Buenaventura','Castaños','Abasolo','Cuatro Ciénegas','Ocampo'].map(m => <option key={m} style={{ background: '#0f1a3e' }}>{m}</option>)}
              </optgroup>
              <optgroup label="── Región Sureste ──">
                {['Saltillo','Ramos Arizpe','Arteaga','General Cepeda','Parras de la Fuente'].map(m => <option key={m} style={{ background: '#0f1a3e' }}>{m}</option>)}
              </optgroup>
              <optgroup label="── Región Norte ──">
                {['Piedras Negras','Nava','Allende','Zaragoza','Jiménez','Morelos'].map(m => <option key={m} style={{ background: '#0f1a3e' }}>{m}</option>)}
              </optgroup>
              <optgroup label="── Región Laguna ──">
                {['Torreón','Francisco I. Madero','Matamoros','San Pedro de las Colonias','Viesca'].map(m => <option key={m} style={{ background: '#0f1a3e' }}>{m}</option>)}
              </optgroup>
              <optgroup label="── Otro ──">
                <option style={{ background: '#0f1a3e' }}>Otro municipio de Coahuila</option>
                <option style={{ background: '#0f1a3e' }}>Otro estado de México</option>
              </optgroup>
            </select>

            <button onClick={() => setPaso(2)} disabled={!form.bachillerato_origen || !form.municipio}
              className="w-full py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
              Siguiente →
            </button>
          </div>
        )}

        {/* PASO 2 */}
        {paso === 2 && (
          <div className="rounded-2xl p-6 space-y-5 border border-white/10" style={cardStyle}>
            <h2 className="font-bold text-lg text-white">Paso 2 — Intereses y habilidades</h2>
            <div>
              <p className="text-sm font-medium text-white/70 mb-3">Materias favoritas:</p>
              <div className="flex flex-wrap gap-2">
                {materias.map(m => (
                  <button key={m} onClick={() => toggleLista('materias_favoritas', m)}
                    className="px-4 py-2 rounded-full text-sm border transition-all duration-200"
                    style={form.materias_favoritas.includes(m)
                      ? { background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', color: 'white', border: '1px solid transparent' }
                      : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-white/70 mb-3">Pasatiempos:</p>
              <div className="flex flex-wrap gap-2">
                {hobbies.map(h => (
                  <button key={h} onClick={() => toggleLista('pasatiempos', h)}
                    className="px-4 py-2 rounded-full text-sm border transition-all duration-200"
                    style={form.pasatiempos.includes(h)
                      ? { background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', color: 'white', border: '1px solid transparent' }
                      : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPaso(1)} className="flex-1 py-3 rounded-xl text-sm font-medium text-white/70 border border-white/20 hover:border-white/40 transition-colors">← Atrás</button>
              <button onClick={() => setPaso(3)} className="flex-1 py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>Siguiente →</button>
            </div>
          </div>
        )}

        {/* PASO 3 */}
        {paso === 3 && (
          <div className="rounded-2xl p-6 space-y-5 border border-white/10" style={cardStyle}>
            <h2 className="font-bold text-lg text-white">Paso 3 — Tu perfil</h2>
            {[
              { label: '🧮 Lógica / Matemáticas', campo: 'habilidad_logica' },
              { label: '🎨 Creatividad / Diseño', campo: 'habilidad_diseno' },
              { label: '👥 Liderazgo / Comunicación', campo: 'habilidad_liderazgo' },
              { label: '🔧 Habilidad Manual / Técnica', campo: 'habilidad_manual' },
            ].map(({ label, campo }) => (
              <div key={campo}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">{label}</span>
                  <span className="font-bold text-blue-400">{form[campo]}</span>
                </div>
                <input type="range" min="0" max="100" value={form[campo]}
                  onChange={e => actualizar(campo, Number(e.target.value))}
                  className="w-full accent-blue-500" />
              </div>
            ))}
            <select className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={selectStyle}
              value={form.entorno_laboral} onChange={e => actualizar('entorno_laboral', e.target.value)}>
              <option value="" style={{ background: '#0f1a3e' }}>¿Dónde te ves trabajando?</option>
              {['Planta industrial y talleres especializados','Oficina o empresa de tecnología','Laboratorio de investigación','Mi propia empresa','Trabajo remoto desde casa'].map(o =>
                <option key={o} style={{ background: '#0f1a3e' }}>{o}</option>)}
            </select>
            <textarea className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
              style={{ ...selectStyle, minHeight: '80px' }}
              placeholder="Cuéntanos en tus propias palabras qué te apasiona o qué te gustaría hacer..."
              value={form.texto_libre} onChange={e => actualizar('texto_libre', e.target.value)} />
            <div className="flex gap-2">
              <button onClick={() => setPaso(2)} className="flex-1 py-3 rounded-xl text-sm font-medium text-white/70 border border-white/20 hover:border-white/40 transition-colors">← Atrás</button>
              <button onClick={enviar} disabled={cargando || !form.entorno_laboral}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
                {cargando ? '🔍 Analizando...' : '🔍 Ver mi resultado'}
              </button>
            </div>
          </div>
        )}

        {/* PASO 4 — Resultado */}
        {paso === 4 && resultado && (() => {
          const prediccionNorm = normalizarPorcentajes(resultado.prediccion);
          const top = prediccionNorm[0];
          const resto = prediccionNorm.slice(1);
          const carruselCarrera = resto[carruselIdx];
          const empresas = EMPRESAS_POR_CARRERA[resultado.prediccion[0]?.carrera_id] || [];

          return (
            <div className="space-y-4">

              {/* Banner principal */}
              <div className="rounded-2xl p-6 text-center border border-white/10"
                style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(124,58,237,0.25))', backdropFilter: 'blur(8px)' }}>
                <p className="text-blue-300/70 text-xs uppercase tracking-widest mb-1">Tu mejor match</p>
                <h2 className="text-2xl font-bold text-white mb-1">{top.nombre_carrera}</h2>
                <div className="inline-block px-3 py-1 rounded-full text-sm font-bold text-blue-300 mb-3"
                  style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)' }}>
                  {top.porcentaje_match}% compatibilidad
                </div>
                <div className="w-full rounded-full h-2 mb-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${top.porcentaje_match}%`, background: 'linear-gradient(90deg, #3b82f6, #7c3aed)' }} />
                </div>
                <p className="text-white/60 text-sm">{top.razonamiento}</p>
              </div>

              {/* Carrusel otras carreras */}
              {resto.length > 0 && (
                <div className="rounded-2xl p-5 border border-white/10" style={cardStyle}>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Otras opciones para ti</p>

                  <div className="flex items-center gap-3">
                    <button onClick={() => setCarruselIdx(i => Math.max(0, i - 1))}
                      disabled={carruselIdx === 0}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white border border-white/20 disabled:opacity-20 hover:border-white/40 transition-colors shrink-0">
                      ←
                    </button>

                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-white text-sm">{carruselCarrera.nombre_carrera}</h3>
                        <span className="text-blue-400 font-bold">{carruselCarrera.porcentaje_match}%</span>
                      </div>
                      <div className="w-full rounded-full h-2 mb-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <div className="h-2 rounded-full transition-all duration-500"
                          style={{ width: `${carruselCarrera.porcentaje_match}%`, background: 'linear-gradient(90deg, #3b82f6, #7c3aed)' }} />
                      </div>
                      <p className="text-white/50 text-xs">{carruselCarrera.razonamiento}</p>
                    </div>

                    <button onClick={() => setCarruselIdx(i => Math.min(resto.length - 1, i + 1))}
                      disabled={carruselIdx === resto.length - 1}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white border border-white/20 disabled:opacity-20 hover:border-white/40 transition-colors shrink-0">
                      →
                    </button>
                  </div>

                  {/* Dots */}
                  <div className="flex justify-center gap-1.5 mt-4">
                    {resto.map((_, i) => (
                      <button key={i} onClick={() => setCarruselIdx(i)}
                        className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                        style={{ background: i === carruselIdx ? '#3b82f6' : 'rgba(255,255,255,0.2)' }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Próxima acción */}
              <div className="rounded-2xl p-4 text-center border border-green-500/20"
                style={{ background: 'rgba(74,222,128,0.06)' }}>
                <p className="text-green-400 font-medium text-sm">📬 Próxima acción</p>
                <p className="text-green-300/70 text-sm mt-1">{resultado.proxima_accion}</p>
              </div>

              {/* Empresas */}
              {empresas.length > 0 && (
                <div className="rounded-2xl p-5 border border-white/10" style={cardStyle}>
                  <h3 className="font-bold text-white mb-1">🏭 Empresas donde puedes hacer residencias</h3>
                  <p className="text-white/40 text-xs mb-4">Convenio directo con el TecNM Campus Monclova — {top.nombre_carrera}</p>
                  <div className="space-y-2">
                    {empresas.map((e, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                        <span className="text-sm text-white/70">{e.nombre}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${COLORES_SECTOR[e.sector] || 'bg-white/10 text-white/50'}`}>
                          {e.sector}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => {
                setPaso(1); setResultado(null); setCarruselIdx(0);
                setForm({ bachillerato_origen: '', municipio: '', materias_favoritas: [], pasatiempos: [], habilidad_logica: 50, habilidad_diseno: 50, habilidad_liderazgo: 50, habilidad_manual: 50, entorno_laboral: '', prioridad_profesional: '', texto_libre: '' });
              }} className="w-full py-3 rounded-xl text-sm font-medium text-white/70 border border-white/20 hover:border-white/40 transition-colors">
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