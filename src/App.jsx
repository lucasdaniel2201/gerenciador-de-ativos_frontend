import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import AssetList from './components/Assets/AssetList';
import Header from './components/Header/Header';
import RegisterPage from './pages/RegisterPage.jsx';


function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/assets" element={<AssetList />} />
        <Route path="/" element={<h2>Bem-vindo ao Gerenciador de Ativos!</h2>} />
      </Routes>
    </div>
  );
}

export default App;