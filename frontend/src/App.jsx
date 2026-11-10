import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';

// Cada página se descarga solo cuando se visita (code splitting). La animación
// del robot (dotlottie) ya no se descarga al abrir la página de inicio.
const Chat = lazy(() => import('./pages/Chat'));
const TestVocacional = lazy(() => import('./pages/TestVocacional'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Mientras llega el código de la página se muestra el mismo fondo, sin parpadeo.
const CargandoPagina = () => (
  <div className="h-full" role="status" aria-label="Cargando..."
    style={{ background: 'linear-gradient(135deg, #0a0f2e 0%, #0f1a3e 40%, #1a0a2e 100%)' }} />
);

function NavLink({ to, children }) {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      to={to}
      className={`relative text-base font-medium transition-colors duration-200 group
        ${isActive ? 'text-blue-300' : 'text-white hover:text-blue-300'}`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-0.5 bg-blue-400 rounded-full transition-all duration-300
          ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
      />
    </Link>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen overflow-hidden">
        <nav className="bg-blue-950 text-white px-6 py-4 border-b border-blue-800 sticky top-0 z-50 shrink-0">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="https://tecmonclova.com/sitio/" target="_blank" rel="noopener noreferrer">
              {/* Versión del logo al tamaño en que se muestra (10 KB en vez de 24 KB). */}
              <img src="/logo_tecnm_nav.png" alt="TecNM Campus Monclova" width="114" height="48" className="h-12 w-auto object-contain hover:opacity-80 transition-opacity duration-200" />
            </a>
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/chat">Chatbot</NavLink>
            <NavLink to="/test">Test Vocacional</NavLink>
            <NavLink to="/dashboard">DataPulse</NavLink>
          </div>
        </nav>
            <div className="flex-1 overflow-auto">
            <Suspense fallback={<CargandoPagina />}>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/test" element={<TestVocacional />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
            </Suspense>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;