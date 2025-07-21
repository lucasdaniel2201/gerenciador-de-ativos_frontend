import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import Header from './components/Header/Header';
import RegisterPage from './pages/RegisterPage.jsx';
import AssetListPage from './pages/AssetListPage.jsx';
import AssetsRegisterPage from './pages/AssetsRegisterPage.jsx';
import AssetsUpdate from './components/Assets/AssetUpdate/AssetUpdate.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/assets" element={<AssetListPage />} />
            <Route path="/assetsregister" element={<AssetsRegisterPage />} />
            <Route path='/assets/:id' element={<AssetsUpdate />} />
            <Route path="/" element={<h2>Bem-vindo ao Gerenciador de Ativos!</h2>} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;