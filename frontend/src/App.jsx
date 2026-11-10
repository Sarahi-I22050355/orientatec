import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import IdiomaProvider from './i18n/IdiomaProvider';
import { useIdioma } from './i18n/contexto';
import { IDIOMAS } from './i18n/textos';

// Cada página se descarga solo cuando se visita (code splitting). La animación
// del robot (dotlottie) ya no se descarga al abrir la página de inicio.
const Chat = lazy(() => import('./pages/Chat'));
const TestVocacional = lazy(() => import('./pages/TestVocacional'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Mientras llega el código de la página se muestra el mismo fondo, sin parpadeo.
function CargandoPagina() {
  const { t } = useIdioma();
  return (
    <div className="h-full" role="status" aria-label={t.app.cargando}
      style={{ background: 'linear-gradient(135deg, #0a0f2e 0%, #0f1a3e 40%, #1a0a2e 100%)' }} />
  );
}

// Selector de idioma ES / EN en la barra de navegación.
function SelectorIdioma() {
  const { idioma, setIdioma, t } = useIdioma();
  return (
    <div role="group" aria-label={t.app.idioma}
      className="ml-auto flex items-center rounded-full border border-blue-700 p-0.5 text-sm font-medium">
      {IDIOMAS.map(codigo => (
        <button key={codigo} type="button" onClick={() => setIdioma(codigo)}
          aria-pressed={idioma === codigo}
          lang={codigo}
          className={`px-3 py-1 rounded-full transition-colors duration-200
            ${idioma === codigo ? 'bg-blue-500 text-white' : 'text-blue-200 hover:text-white'}`}>
          {codigo.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

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
    <IdiomaProvider>
      <Contenido />
    </IdiomaProvider>
  );
}

function Contenido() {
  const { t } = useIdioma();
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen overflow-hidden">
        <nav className="bg-blue-950 text-white px-6 py-4 border-b border-blue-800 sticky top-0 z-50 shrink-0">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="https://tecmonclova.com/web/" target="_blank" rel="noopener noreferrer">
              {/* Versión del logo al tamaño en que se muestra (10 KB en vez de 24 KB). */}
              <img src="/logo_tecnm_nav.png" alt={t.app.logoAlt} width="114" height="48" className="h-12 w-auto object-contain hover:opacity-80 transition-opacity duration-200" />
            </a>
            <NavLink to="/">{t.app.nav.inicio}</NavLink>
            <NavLink to="/chat">{t.app.nav.chat}</NavLink>
            <NavLink to="/test">{t.app.nav.test}</NavLink>
            <NavLink to="/dashboard">{t.app.nav.dashboard}</NavLink>
            <SelectorIdioma />
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