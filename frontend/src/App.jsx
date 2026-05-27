import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import TestVocacional from './pages/TestVocacional';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-blue-800 text-white px-6 py-4 flex gap-6 items-center">
        <span className="font-bold text-xl mr-4">🎓 OrientaTec</span>
        <Link to="/" className="hover:text-blue-200">Inicio</Link>
        <Link to="/chat" className="hover:text-blue-200">Chatbot</Link>
        <Link to="/test" className="hover:text-blue-200">Test Vocacional</Link>
        <Link to="/dashboard" className="hover:text-blue-200 ml-auto">Dashboard</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/test" element={<TestVocacional />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;