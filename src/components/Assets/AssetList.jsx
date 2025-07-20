import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import removeAsset from '../../services/assetsService.jsx';

function AssetList() {
  const [assets, setAssets] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssets = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redireciona para login se não houver token
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/assets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAssets(response.data);
        console.log(response.data);
        setMessage('');
      } catch (error) {
        console.error('Erro ao buscar ativos:', error.response?.data || error.message);
        setMessage(error.response?.data?.message || 'Erro ao carregar ativos. Faça login novamente.');
        // Se o token for inválido/expirado, redireciona para login
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    };

    fetchAssets();
  }, [navigate]); // Adiciona navigate como dependência do useEffect

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDelete = async (assetId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redireciona para login se não houver token
      return;
    }
    try {
      await removeAsset(assetId);
      setAssets(prevAssets => prevAssets.filter(asset => asset.id !== assetId));
    } catch (error) {
      console.error('Erro ao excluir asset:', error);
    }
  };
  const handleRegister = () => {
    navigate('/assetsregister')
  }
  const handleUpdate = (assetId) => {
    navigate(`/assets/${assetId}`);
  };


  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Meus Ativos</h2>
    
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Sair
        </button>
        <button onClick={handleRegister} style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
           Novo Ativo
        </button>
      </div>
    </div>

      {message && <p style={{ color: 'red' }}>{message}</p>}

      {assets.length === 0 && !message ? (
        <p>Nenhum ativo encontrado. Crie um novo ativo!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Nome</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Nº Série</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Responsável</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Condição</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, idx) => (
              <tr key={asset.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{asset.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{asset.serialNumber}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{asset.responsible}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{asset.condition}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {/* Botões de Editar e Excluir virão aqui */}
                  <button onClick={() => handleUpdate(asset.id)} style={{padding: '10px ', backgroundColor: '#ffd310ff', marginRight: '10px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => handleDelete(asset.id)} style={{padding: '10px', backgroundColor: '#bb0000ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Excluir</button>
                  {console.log(asset.id)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AssetList;