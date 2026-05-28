import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import TestVocacional from './pages/TestVocacional';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-blue-950 text-white px-4 py-3 border-b border-blue-800">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <img src="/logo_tecnm.png" alt="TecNM Campus Monclova" className="h-8 object-contain" />
          <Link to="/" className="hover:text-blue-300 text-sm">Inicio</Link>
          <Link to="/chat" className="hover:text-blue-300 text-sm">Chatbot</Link>
          <Link to="/test" className="hover:text-blue-300 text-sm">Test Vocacional</Link>
          <Link to="/dashboard" className="hover:text-blue-300 text-sm">DataPulse</Link>
        </div>
      </nav>
      <div className="overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/test" element={<TestVocacional />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;