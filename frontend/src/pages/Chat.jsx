import { useState, useRef, useEffect } from 'react';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import { enviarMensaje } from '../api';
import ChatBox from '../components/chat/ChatBox';

const SEGMENTOS = {
  IDLE:     [0, 30],
  YES:      [31, 105],
  NO:       [106, 180],
  ALERTA:   [181, 270],
  PENSANDO: [271, 390],
  JUMP:     [391, 479],
};

const SUGERENCIAS = [
  '¿Qué carreras tienen?',
  '¿Hay becas disponibles?',
  '¿Dónde está el campus?',
  '¿Qué actividades extracurriculares hay?',
];

function Chat() {
  const [mensajes, setMensajes] = useState([
    { role: 'assistant', content: '¡Hola! Soy OrientaTec 👋 Cuéntame, ¿qué materias te gustan más o qué actividades disfrutas?' }
  ]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(true);
  const sesion_id = useRef(`sesion_${Date.now()}`);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const audioRef = useRef(new Audio('/notify.wav'));
  const segActual = useRef('IDLE');

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
  };
  }, []);

  const typewriter = (texto, historialActual) => {
    let i = 0;
    const intervalo = setInterval(() => {
      i++;
      setMensajes([...historialActual, { role: 'assistant', content: texto.slice(0, i) }]);
      if (i >= texto.length) clearInterval(intervalo);
    }, 18);
  };

  const enviar = async (mensajeOverride) => {
    const textoEnviar = mensajeOverride || input;
    if (!textoEnviar.trim() || cargando) return;
    setMostrarSugerencias(false);
    const nuevoMensaje = { role: 'user', content: textoEnviar };
    const historialActual = [...mensajes, nuevoMensaje];
    setMensajes(historialActual);
    setInput('');
    setCargando(true);

    tocarSegmento('JUMP');
    await new Promise(r => setTimeout(r, 1200));

    tocarSegmento('PENSANDO');
    animRef.current?.setLoop(true);
    animRef.current?.play();

    try {
      const historial = mensajes.map(m => ({ role: m.role, content: m.content }));
      const res = await enviarMensaje(textoEnviar, historial, sesion_id.current);
      await new Promise(r => setTimeout(r, 800)); 

      const texto = res.respuesta.toLowerCase();
      if (texto.includes('lo siento') || texto.includes('no puedo') || texto.includes('no es posible')) {
        tocarSegmento('NO');
      } else if (texto.includes('error') || texto.includes('problema') || texto.includes('cuidado')) {
        tocarSegmento('ALERTA');
      } else {
        tocarSegmento('YES');
      }

      await new Promise(r => setTimeout(r, 1400));

      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      typewriter(res.respuesta, historialActual);

    } catch {
      tocarSegmento('ALERTA');
      await new Promise(r => setTimeout(r, 1000));
      setMensajes([...historialActual, { role: 'assistant', content: 'Hubo un error, intenta de nuevo.' }]);
    } finally {
      setCargando(false);
    }
    };

  return (
      <div className="flex flex-col h-full overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0f2e 0%, #0f1a3e 40%, #1a0a2e 100%)' }}>

      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #ffffff0d 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Header */}
      <div className="relative z-10 px-6 py-4 border-b border-white/10 flex items-center gap-3 shrink-0"
        style={{ background: 'rgba(10,15,46,0.8)', backdropFilter: 'blur(8px)' }}>
        <div>
          <h2 className="font-semibold text-white text-base leading-tight">Asistente OrientaTec</h2>
          <p className="text-blue-300/70 text-xs">TecNM Campus Monclova · IA disponible</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30"
          style={{ background: 'rgba(74,222,128,0.08)' }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium text-green-400">En línea</span>
        </div>
      </div>

      {/* Layout dos columnas */}
      <div className="relative z-10 flex flex-1 overflow-hidden">

        <div className="flex flex-col flex-1 overflow-hidden border-r border-white/10">
          <ChatBox
            mensajes={mensajes}
            cargando={cargando}
            input={input}
            setInput={setInput}
            onEnviar={enviar}
            mostrarSugerencias={mostrarSugerencias}
            sugerencias={SUGERENCIAS}
            onSugerencia={(s) => enviar(s)}
          />
        </div>

        <div className="hidden md:flex w-72 lg:w-96 flex-col items-center justify-center gap-4 px-6"
          style={{ background: 'rgba(10,15,46,0.3)' }}>
          <canvas ref={canvasRef} className="w-64 h-64 lg:w-80 lg:h-80"
            style={{ clipPath: 'inset(0 0 25% 0)' }} />
          <div className="text-center -mt-8">
            <p className="text-white/80 text-lg font-semibold">OrientaTec IA</p>
            <p className="text-white/40 text-sm mt-1">Tu asistente vocacional</p>
          </div>
          <div className="absolute w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, #7c3aed15 0%, transparent 70%)' }} />
        </div>

      </div>
    </div>
  );
}

export default Chat;