import { useEffect, useRef } from 'react';

function Mensaje({ msg }) {
  const esUsuario = msg.role === 'user';
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = esUsuario ? 'translateX(20px)' : 'translateX(-20px)';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 1s ease, transform 1s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateX(0)';
    });
  }, []);

  return (
    <div ref={ref} className={`flex ${esUsuario ? 'justify-end' : 'justify-start'}`}>
      {!esUsuario && (
        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-sm mr-2 shrink-0 mt-1">🤖</div>
      )}
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
        ${esUsuario ? 'text-white rounded-br-none' : 'rounded-bl-none border border-white/10 text-slate-200'}`}
        style={esUsuario
          ? { background: 'linear-gradient(135deg, #3b82f6, #6d28d9)' }
          : { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(4px)' }
        }>
        {esUsuario ? msg.content : msg.content.split(/(https?:\/\/[^\s]+)/g).map((part, j) =>
          /^https?:\/\//.test(part)
            ? <a key={j} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline break-all">{part}</a>
            : part
        )}
      </div>
    </div>
  );
}

export default Mensaje;