import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 text-white flex flex-col items-center justify-center px-6">

      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">🎓 OrientaTec</h1>
        <p className="text-xl text-blue-200 max-w-xl">
          Descubre tu carrera ideal en el TecNM Campus Monclova con ayuda de Inteligencia Artificial
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">

        <Link to="/chat" className="bg-white text-blue-900 rounded-2xl p-8 hover:scale-105 transition-transform shadow-xl">
          <div className="text-4xl mb-3">🤖</div>
          <h2 className="text-2xl font-bold mb-2">Habla con OrientaTec</h2>
          <p className="text-gray-600">Platica con nuestro asistente inteligente y descubre qué carrera va contigo.</p>
        </Link>

        <Link to="/test" className="bg-white text-blue-900 rounded-2xl p-8 hover:scale-105 transition-transform shadow-xl">
          <div className="text-4xl mb-3">📊</div>
          <h2 className="text-2xl font-bold mb-2">Test Vocacional</h2>
          <p className="text-gray-600">Responde nuestro test con IA y obtén tu porcentaje de compatibilidad con cada ingeniería.</p>
        </Link>

      </div>

      <div className="mt-12 text-blue-300 text-sm text-center">
        © 2026 Hackaton TecNM Campus Monclova — Jabalí Digital
      </div>

    </div>
  );
}

export default Home;