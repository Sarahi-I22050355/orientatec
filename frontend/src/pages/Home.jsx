import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {

  useEffect(() => {
    fetch('/robot.lottie').catch(() => {});
  }, []);

  return (
      <div className="min-h-screen text-white flex flex-col overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #0a0f2e 0%, #0f1a3e 40%, #1a0a2e 100%)' }}>
      {/* Dot grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff0d 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

        {/* Glow blobs */}
        <div className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b5fd020 0%, transparent 70%)' }} />
        <div className="fixed bottom-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed18 0%, transparent 70%)' }} />

        {/* Logo decorativo de fondo */}
        <div className="fixed left-[-280px] top-1/2 -translate-y-1/2 pointer-events-none z-0">
          <div className="relative w-[700px] h-[700px]">
            {/* Engranaje girando */}
            <img
              src="/engranaje.svg"
              className="absolute inset-0 w-full h-full object-contain opacity-[100]"
              style={{ animation: 'spin-gear 40s linear infinite' }}
            />
            {/* Indio — centrado en el engranaje */}
            <img
              src="/indio.svg"
              className="absolute w-[590px] h-[590px] object-contain opacity-[100]"
              style={{ top: '50%', left: '50%', transform: 'translate(-20%, -53%)' }}
            />          
          </div>
        </div>     
        {/* Hero */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs text-blue-300 mb-8 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
          TecNM Campus Monclova · IA disponible
        </div>

        {/* Title */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold leading-none tracking-tight mb-6">
          <span
            style={{
              background: 'linear-gradient(135deg, #93c5fd 0%, #a78bfa 50%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Orienta
          </span>
          <span className="text-white">Tec</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl text-white/90 max-w-md mx-auto mb-4 leading-relaxed font-medium">
          Descubre qué carrera va contigo <br className="hidden sm:block" />
          con ayuda de inteligencia artificial.
        </p>
        <p className="text-sm text-blue-300/80 mb-16 font-medium tracking-wide">
          Hecho para futuros ingenieros del ITSM.
        </p>
        {/* CTA Cards */}
        <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-4">

          {/* Primary — Chat */}
          <Link
            to="/chat"
            className="flex-1 group relative overflow-hidden rounded-2xl border border-blue-500/40 p-7 flex flex-col items-start text-left transition-all duration-300 hover:border-blue-400/70 backdrop-blur-[2px]"
            style={{ background: 'rgba(13, 21, 38, 0.25)' }}
          >
            <div className="w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center mb-5 text-2xl">🤖</div>
            <h2 className="text-xl font-semibold text-white mb-2">Habla con OrientaTec</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Platica con el asistente y descubre qué carrera encaja con tus intereses.
            </p>
            <span className="mt-auto text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200 inline-block">
              Empezar conversación →
            </span>
          </Link>

          {/* Secondary — Test */}
          <Link
            to="/test"
            className="flex-1 group relative overflow-hidden rounded-2xl border border-purple-500/30 p-7 flex flex-col items-start text-left transition-all duration-300 hover:border-purple-400/60 backdrop-blur-[2px]"
            style={{ background: 'rgba(10, 15, 30, 0.25)' }}
          >
            <div className="w-11 h-11 rounded-xl bg-purple-500/15 flex items-center justify-center mb-5 text-2xl">📊</div>
            <h2 className="text-xl font-semibold text-white mb-2">Test Vocacional</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Responde el test y obtén tu porcentaje de afinidad con cada ingeniería del ITSM.
            </p>
            <span className="mt-auto text-purple-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200 inline-block">
              Hacer el test →
            </span>
          </Link>

        </div>
        {/* Stats bar */}
        <div className="mt-16 flex flex-wrap justify-center gap-x-16 gap-y-6 text-center">
          {[
            { num: '6', label: 'Carreras de ingeniería' },
            { num: 'IA', label: 'Orientación personalizada' },
            { num: '100%', label: 'Gratuito' },
          ].map(({ num, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-5xl font-extrabold text-white">{num}</span>
              <span className="text-sm text-slate-200 mt-1">{label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative text-center py-4 text-xs text-slate-400 bg-black border-t border-white/10">
        © 2026 Hackaton TecNM Campus Monclova — Jabalí Digital
      </footer>
    </div>
  );
}

export default Home;
