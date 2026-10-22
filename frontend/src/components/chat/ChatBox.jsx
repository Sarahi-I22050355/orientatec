import { useRef, useEffect } from 'react';
import Mensaje from './Mensaje';

function ChatBox({ mensajes, cargando, input, setInput, onEnviar }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  return (
    <>
      {/* Lista de mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4
        scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {mensajes.map((msg, i) => <Mensaje key={i} msg={msg} />)}

        {cargando && (
          <div className="flex justify-start items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-sm shrink-0">
              🤖
            </div>
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

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/10"
        style={{ background: 'rgba(10,15,46,0.8)', backdropFilter: 'blur(8px)' }}>
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            className="flex-1 rounded-full px-5 py-2.5 text-sm text-white outline-none
              border border-white/15 focus:border-blue-500/60 transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)' }}
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onEnviar()}
          />
          <button
            onClick={onEnviar}
            disabled={cargando}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-white
              transition-all duration-200 hover:opacity-90 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
            Enviar
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatBox;