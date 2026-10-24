import { useRef, useEffect, useState } from 'react';
import Mensaje from './Mensaje';

function ChatBox({ mensajes, cargando, input, setInput, onEnviar, mostrarSugerencias, sugerencias, onSugerencia }) {
  const bottomRef = useRef(null);
  const scrollRef = useRef(null);
  const [mostrarBotonScroll, setMostrarBotonScroll] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distanciaAlFondo = el.scrollHeight - el.scrollTop - el.clientHeight;
    setMostrarBotonScroll(distanciaAlFondo > 100);
  };

  const irAlFondo = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto px-4 py-6 space-y-4 scrollbar-hide"
        >
          {mensajes.map((msg, i) => <Mensaje key={i} msg={msg} />)}

          {/* Sugerencias iniciales */}
          {mostrarSugerencias && !cargando && (
            <div className="flex flex-wrap gap-2 mt-2">
              {sugerencias.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onSugerencia(s)}
                  className="px-4 py-2 rounded-full text-xs text-blue-300 border border-blue-500/30 hover:border-blue-400/60 hover:bg-blue-500/10 transition-all duration-200"
                  style={{ background: 'rgba(59,130,246,0.07)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {cargando && (
            <div className="flex justify-start items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-sm shrink-0">🤖</div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-none text-sm border border-white/10"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Botón scroll to bottom */}
        {mostrarBotonScroll && (
          <button
            onClick={irAlFondo}
            className="absolute bottom-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:opacity-90 border border-white/10"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
          >
            ↓
          </button>
        )}
      </div>

      <div className="px-4 py-3 border-t border-white/10"
        style={{ background: 'rgba(10,15,46,0.8)', backdropFilter: 'blur(8px)' }}>
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            className="flex-1 rounded-full px-5 py-2.5 text-sm text-white outline-none border border-white/15 focus:border-blue-500/60 transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)' }}
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onEnviar()}
          />
          <button onClick={() => onEnviar()} disabled={cargando}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
            Enviar
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatBox;