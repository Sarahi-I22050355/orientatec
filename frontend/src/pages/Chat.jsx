import { useState, useRef, useEffect } from 'react';
import lottie from 'lottie-web';
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

function Chat() {
  const [mensajes, setMensajes] = useState([
    { role: 'assistant', content: '¡Hola! Soy OrientaTec 👋 Cuéntame, ¿qué materias te gustan más o qué actividades disfrutas?' }
  ]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const sesion_id = useRef(`sesion_${Date.now()}`);
  const robotRef = useRef(null);
  const animRef = useRef(null);

  const volverIdle = () => {
    if (!animRef.current) return;
    animRef.current.loop = true;
    animRef.current.playSegments(SEGMENTOS.IDLE, true);
  };

  useEffect(() => {
    animRef.current = lottie.loadAnimation({
      container: robotRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: '/robot.json',
    });

    animRef.current.addEventListener('DOMLoaded', () => {
      // Al cargar, saluda con YES y luego entra en idle
      animRef.current.playSegments(SEGMENTOS.YES, true);
      animRef.current.addEventListener('complete', () => {
        volverIdle();
      }, { once: true });
    });

    return () => animRef.current?.destroy();
  }, []);

  const tocarSegmento = (seg, volverAIdle = true) => {
    if (!animRef.current) return;
    animRef.current.loop = false;
    animRef.current.playSegments(SEGMENTOS[seg], true);
    if (volverAIdle) {
      animRef.current.addEventListener('complete', () => {
        volverIdle();
      }, { once: true });
    }
  };

  const enviar = async () => {
    if (!input.trim() || cargando) return;
    const nuevoMensaje = { role: 'user', content: input };
    const historialActual = [...mensajes, nuevoMensaje];
    setMensajes(historialActual);
    setInput('');
    setCargando(true);

    // JUMP sin volver a idle (lo manejamos manualmente)
    if (!animRef.current) return;
    animRef.current.loop = false;
    animRef.current.playSegments(SEGMENTOS.JUMP, true);

    try {
      const historial = mensajes.map(m => ({ role: m.role, content: m.content }));

      await new Promise(r => setTimeout(r, 1200));

      // PENSANDO en loop mientras espera
      animRef.current.loop = true;
      animRef.current.playSegments(SEGMENTOS.PENSANDO, true);

      const res = await enviarMensaje(input, historial, sesion_id.current);

      await new Promise(r => setTimeout(r, 800));

      animRef.current.loop = false;
      const texto = res.respuesta.toLowerCase();

      if (texto.includes('lo siento') || texto.includes('no puedo') || texto.includes('no es posible')) {
        tocarSegmento('NO');
      } else if (texto.includes('error') || texto.includes('problema') || texto.includes('cuidado')) {
        tocarSegmento('ALERTA');
      } else {
        tocarSegmento('YES');
      }

      await new Promise(r => setTimeout(r, 600));
      setMensajes([...historialActual, { role: 'assistant', content: res.respuesta }]);

    } catch {
      animRef.current.loop = false;
      tocarSegmento('ALERTA');
      await new Promise(r => setTimeout(r, 600));
      setMensajes([...historialActual, { role: 'assistant', content: 'Hubo un error, intenta de nuevo.' }]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0f2e 0%, #0f1a3e 40%, #1a0a2e 100%)' }}>

      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #ffffff0d 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Header */}
      <div className="relative z-10 px-6 py-4 border-b border-white/10 flex items-center gap-3 shrink-0"
        style={{ background: 'rgba(10,15,46,0.8)', backdropFilter: 'blur(8px)' }}>
        <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-xl">
          🤖
        </div>
        <div>
          <h2 className="font-semibold text-white text-base leading-tight">Asistente OrientaTec</h2>
          <p className="text-blue-300/70 text-xs">TecNM Campus Monclova · IA disponible</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          En línea
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
          />
        </div>

        <div className="hidden md:flex w-72 lg:w-96 flex-col items-center justify-center gap-4 px-6"
          style={{ background: 'rgba(10,15,46,0.3)' }}>

          <div
            ref={robotRef}
            className="w-64 h-64 lg:w-80 lg:h-80"
            style={{ clipPath: 'inset(0 0 25% 0)' }}
          />

          <div className="text-center -mt-8">
            <p className="text-white/60 text-sm font-medium">OrientaTec IA</p>
            <p className="text-white/30 text-xs mt-1">Tu asistente vocacional</p>
          </div>

          <div className="absolute w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, #7c3aed15 0%, transparent 70%)' }} />
        </div>

      </div>
    </div>
  );
}

export default Chat;