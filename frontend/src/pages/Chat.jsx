import { useState, useRef, useEffect } from 'react';
import { enviarMensaje } from '../api';

function Chat() {
  const [mensajes, setMensajes] = useState([
    { role: 'assistant', content: '¡Hola! Soy OrientaTec 👋 Cuéntame, ¿qué materias te gustan más o qué actividades disfrutas?' }
  ]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const sesion_id = useRef(`sesion_${Date.now()}`);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const enviar = async () => {
    if (!input.trim() || cargando) return;

    const nuevoMensaje = { role: 'user', content: input };
    const historialActual = [...mensajes, nuevoMensaje];
    setMensajes(historialActual);
    setInput('');
    setCargando(true);

    try {
      const historial = mensajes.map(m => ({ role: m.role, content: m.content }));
      const res = await enviarMensaje(input, historial, sesion_id.current);
      setMensajes([...historialActual, { role: 'assistant', content: res.respuesta }]);
    } catch {
      setMensajes([...historialActual, { role: 'assistant', content: 'Hubo un error, intenta de nuevo.' }]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      
      <div className="bg-blue-800 text-white px-6 py-3">
        <h2 className="font-bold text-lg">🤖 Asistente OrientaTec</h2>
        <p className="text-blue-200 text-sm">TecNM Campus Monclova</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {mensajes.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
              ${msg.role === 'user'
                ? 'bg-blue-700 text-white rounded-br-none'
                : 'bg-white text-gray-800 shadow rounded-bl-none'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {cargando && (
          <div className="flex justify-start">
            <div className="bg-white shadow px-4 py-3 rounded-2xl text-gray-400 text-sm">
              OrientaTec está escribiendo...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="bg-white border-t px-4 py-3 flex gap-2">
        <input
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && enviar()}
        />
        <button
          onClick={enviar}
          disabled={cargando}
          className="bg-blue-700 text-white px-5 py-2 rounded-full text-sm hover:bg-blue-800 disabled:opacity-50">
          Enviar
        </button>
      </div>

    </div>
  );
}

export default Chat;