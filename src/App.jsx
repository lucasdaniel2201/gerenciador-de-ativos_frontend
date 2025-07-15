import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import AssetList from './components/Assets/AssetList'; // Componente futuro para listar ativos

function App() {
  return (
    <div className="App">
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
        <Link to="/register" style={{ marginRight: '15px' }}>Registrar</Link>
        <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
        <Link to="/assets">Ativos</Link>
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/assets" element={<AssetList />} />
        <Route path="/" element={<h2>Bem-vindo ao Gerenciador de Ativos!</h2>} /> {/* Rota padrão */}
      </Routes>
    </div>
  );
}

export default App;