import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import removeAsset from '../../../services/assetsService.jsx';
import styles from './AssetList.module.css';

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Meus Ativos</h2>

        <div className={styles.buttonGroup}>
          <button onClick={handleRegister} className={styles.newAssetButton}>
            Novo Ativo
          </button>
        </div>
      </div>

      {message && <p className={styles.errorMessage}>{message}</p>}

      {assets.length === 0 && !message ? (
        <p className={styles.noAssetsMessage}>Nenhum ativo encontrado. Crie um novo ativo!</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.tableHeaderCell}>Nome</th>
              <th className={styles.tableHeaderCell}>Nº Série</th>
              <th className={styles.tableHeaderCell}>Responsável</th>
              <th className={styles.tableHeaderCell}>Condição</th>
              <th className={styles.tableHeaderCell}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td className={styles.tableCell}>{asset.name}</td>
                <td className={styles.tableCell}>{asset.serialNumber}</td>
                <td className={styles.tableCell}>{asset.responsible}</td>
                <td className={styles.tableCell}>{asset.condition}</td>
                <td className={styles.actionsCell}>
                  <button
                    onClick={() => handleUpdate(asset.id)}
                    className={styles.editButton}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className={styles.deleteButton}
                  >
                    Excluir
                  </button>
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