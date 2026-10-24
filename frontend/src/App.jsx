import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import TestVocacional from './pages/TestVocacional';
import Dashboard from './pages/Dashboard';

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
              <img src="/logo_tecnm.png" alt="TecNM Campus Monclova" className="h-12 object-contain hover:opacity-80 transition-opacity duration-200" />
            </a>
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/chat">Chatbot</NavLink>
            <NavLink to="/test">Test Vocacional</NavLink>
            <NavLink to="/dashboard">DataPulse</NavLink>
          </div>
        </nav>
            <div className="flex-1 overflow-auto">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/test" element={<TestVocacional />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;