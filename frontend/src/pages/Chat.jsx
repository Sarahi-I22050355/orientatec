import { useState, useRef, useEffect, useMemo } from 'react';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import { enviarMensaje } from '../api';
import ChatBox from '../components/chat/ChatBox';
import { useIdioma } from '../i18n/contexto';
import FondoPuntos from '../components/FondoPuntos';

const SEGMENTOS = {
  IDLE:     [0, 30],
  YES:      [31, 105],
  NO:       [106, 180],
  ALERTA:   [181, 270],
  PENSANDO: [271, 390],
  JUMP:     [391, 479],
};

// Identificador de sesión difícil de adivinar (antes era solo la hora en ms,
// lo que permitía adivinar sesiones ajenas). Se conserva el prefijo "sesion_".
const crearSesionId = () =>
  `sesion_${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random().toString(36).slice(2)}`}`;

// Las sugerencias y el saludo inicial están en i18n/textos.js (español e inglés).
// Pone el texto del saludo inicial en el idioma indicado.
const conSaludo = (lista, saludo) =>
  lista.map(m => m.inicial ? { role: m.role, content: saludo } : m);

function Chat() {
  const { idioma, t } = useIdioma();
  // El saludo inicial se escribe en el idioma del sitio. Mientras la persona no
  // haya escrito nada, cambia si se cambia el idioma; al enviar el primer
  // mensaje queda fijo en el idioma en que se mostró.
  const [mensajes, setMensajes] = useState([{ role: 'assistant', inicial: true }]);
  const mensajesVista = useMemo(() => conSaludo(mensajes, t.chat.saludo), [mensajes, t.chat.saludo]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(true);
  const [sesionId] = useState(crearSesionId);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  // El audio se crea una sola vez al usarse (antes se creaba un objeto Audio
  // nuevo en cada renderizado, es decir, cada 18 ms durante el efecto de escritura).
  const audioRef = useRef(null);
  const segActual = useRef('IDLE');
  // Animación de escritura en curso: { intervalo, final }
  const escrituraRef = useRef(null);

  const volverIdle = () => {
    if (!animRef.current) return;
    segActual.current = 'IDLE';
    animRef.current.setLoop(true);
    animRef.current.setSegment(SEGMENTOS.IDLE[0], SEGMENTOS.IDLE[1]);
    animRef.current.play();
  };

  const tocarSegmento = (seg) => {
    if (!animRef.current) return;
    segActual.current = seg;
    animRef.current.setLoop(false);
    animRef.current.setSegment(SEGMENTOS[seg][0], SEGMENTOS[seg][1]);
    animRef.current.play();
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0]?.toString?.().includes('AbortError')) return;
      originalError(...args);
    };

    animRef.current = new DotLottie({
      canvas: canvasRef.current,
      src: '/robot.lottie',
      loop: false,
      autoplay: false,
    });
    
    animRef.current.addEventListener('load', () => {
      tocarSegmento('YES');
    });

    animRef.current.addEventListener('loadError', (e) => {
      // Ignorar AbortError — pasa cuando el componente se desmonta antes de que cargue
      if (e?.error?.name === 'AbortError') return;
      console.warn('Error cargando robot.lottie:', e);
    });

    animRef.current.addEventListener('complete', () => {
      if (segActual.current !== 'IDLE') {
        volverIdle();
      }
    });

  return () => {
    console.error = originalError; // restaurar
    animRef.current?.destroy();
    clearInterval(escrituraRef.current?.intervalo);
  };
  }, []);

  const typewriter = (texto, historialActual) => {
    const final = [...historialActual, { role: 'assistant', content: texto }];
    let i = 0;
    const intervalo = setInterval(() => {
      i++;
      setMensajes([...historialActual, { role: 'assistant', content: texto.slice(0, i) }]);
      if (i >= texto.length) {
        clearInterval(intervalo);
        escrituraRef.current = null;
      }
    }, 18);
    escrituraRef.current = { intervalo, final };
  };

  // Si el usuario envía otro mensaje mientras la respuesta anterior se sigue
  // "escribiendo", se completa de inmediato. Antes la animación anterior seguía
  // corriendo, borraba de la pantalla el mensaje nuevo y la respuesta quedaba
  // cortada en el historial enviado a la IA.
  const terminarEscritura = () => {
    const actual = escrituraRef.current;
    if (!actual) return null;
    clearInterval(actual.intervalo);
    escrituraRef.current = null;
    setMensajes(actual.final);
    return actual.final;
  };

  const enviar = async (mensajeOverride) => {
    const textoEnviar = mensajeOverride || input;
    if (!textoEnviar.trim() || cargando) return;
    setMostrarSugerencias(false);
    const previos = conSaludo(terminarEscritura() ?? mensajes, t.chat.saludo);
    const nuevoMensaje = { role: 'user', content: textoEnviar };
    const historialActual = [...previos, nuevoMensaje];
    setMensajes(historialActual);
    setInput('');
    setCargando(true);

    tocarSegmento('JUMP');
    await new Promise(r => setTimeout(r, 1200));

    tocarSegmento('PENSANDO');
    animRef.current?.setLoop(true);
    animRef.current?.play();

    try {
      const historial = previos.map(m => ({ role: m.role, content: m.content }));
      const res = await enviarMensaje(textoEnviar, historial, sesionId, idioma);
      await new Promise(r => setTimeout(r, 800)); 

      const texto = res.respuesta.toLowerCase();
      // También reconoce respuestas en inglés, porque el bot contesta en el idioma del usuario.
      if (texto.includes('lo siento') || texto.includes('no puedo') || texto.includes('no es posible')
        || texto.includes("i'm sorry") || texto.includes("i can't") || texto.includes('i cannot')) {
        tocarSegmento('NO');
      } else if (texto.includes('error') || texto.includes('problema') || texto.includes('cuidado')
        || texto.includes('problem') || texto.includes('careful')) {
        tocarSegmento('ALERTA');
      } else {
        tocarSegmento('YES');
      }

      await new Promise(r => setTimeout(r, 1400));

      audioRef.current ??= new Audio('/notify.mp3');
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      typewriter(res.respuesta, historialActual);

    } catch {
      tocarSegmento('ALERTA');
      await new Promise(r => setTimeout(r, 1000));
      setMensajes([...historialActual, { role: 'assistant', content: t.chat.error }]);
    } finally {
      setCargando(false);
    }
    };

  return (
      <div className="flex flex-col h-full overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0f2e 0%, #0f1a3e 40%, #1a0a2e 100%)' }}>

      <FondoPuntos posicion="absolute" />

      {/* Header */}
      <div className="relative z-10 px-6 py-4 border-b border-white/10 flex items-center gap-3 shrink-0"
        style={{ background: 'rgba(10,15,46,0.8)', backdropFilter: 'blur(8px)' }}>
        <div>
          <h2 className="font-semibold text-white text-base leading-tight">{t.chat.titulo}</h2>
          <p className="text-blue-300/70 text-xs">{t.chat.subtitulo}</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30"
          style={{ background: 'rgba(74,222,128,0.08)' }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium text-green-400">{t.chat.enLinea}</span>
        </div>
      </div>

      {/* Layout dos columnas */}
      <div className="relative z-10 flex flex-1 overflow-hidden">

        <div className="flex flex-col flex-1 overflow-hidden border-r border-white/10">
          <ChatBox
            mensajes={mensajesVista}
            cargando={cargando}
            input={input}
            setInput={setInput}
            onEnviar={enviar}
            mostrarSugerencias={mostrarSugerencias}
            sugerencias={t.chat.sugerencias}
            onSugerencia={(s) => enviar(s)}
          />
        </div>

        <div className="hidden md:flex w-72 lg:w-96 flex-col items-center justify-center gap-4 px-6"
          style={{ background: 'rgba(10,15,46,0.3)' }}>
          <canvas ref={canvasRef} className="w-64 h-64 lg:w-80 lg:h-80"
            style={{ clipPath: 'inset(0 0 25% 0)' }} />
          <div className="text-center -mt-8">
            <p className="text-white/80 text-lg font-semibold">OrientaTec IA</p>
            <p className="text-white/40 text-sm mt-1">{t.chat.asistente}</p>
          </div>
          <div className="absolute w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, #7c3aed15 0%, transparent 70%)' }} />
        </div>

      </div>
    </div>
  );
}

export default Chat;