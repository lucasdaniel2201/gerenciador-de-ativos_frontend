import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import removeAsset from "../../../services/assetsService";
import styles from "./AssetList.module.css";
import CancelSubscriptionButton from "../../SubscriptionCancel/SubscriptionCancel";
import { useAuth } from "../../../context/AuthContext";

function AssetList() {
  const [assets, setAssets] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Adicionado estado de carregamento
  const navigate = useNavigate();
  const { user, subscription, loading } = useAuth();

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true); // Inicia o carregamento
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/api/assets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAssets(response.data);
        setMessage("");
      } catch (error) {
        console.error(
          "Erro ao buscar ativos:",
          error.response?.data || error.message
        );
        setMessage(
          error.response?.data?.message ||
            "Erro ao carregar ativos. Faça login novamente."
        );
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [navigate]);

  const handleDelete = async (assetId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await removeAsset(assetId);
      setAssets((prevAssets) =>
        prevAssets.filter((asset) => asset.id !== assetId)
      );
      setMessage("Ativo excluído com sucesso!"); // Feedback de sucesso
      setTimeout(() => setMessage(""), 3000); // Limpa a mensagem após 3 segundos
    } catch (error) {
      console.error("Erro ao excluir asset:", error);
      setMessage("Erro ao excluir ativo. Tente novamente."); // Feedback de erro
      setTimeout(() => setMessage(""), 5000); // Limpa a mensagem após 5 segundos
    }
  };

  const handleRegister = () => {
    navigate("/assetsregister");
  };

  const handleUpdate = (assetId) => {
    navigate(`/assets/${assetId}`);
  };

  // Lógica de filtro: filtra os ativos com base no termo de pesquisa
  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Meus Ativos</h2>

        <div className={styles.buttonGroup}>
          {subscription && subscription?.status === "active" ? (
            <div>
              <p>Assinatura ativa</p>
              <CancelSubscriptionButton
                subscriptionId={subscription.id}
                userId={user.id}
              />
            </div>
          ) : (
            <p>Nenhuma assinatura ativa encontrada</p>
          )}
          <input
            type="search"
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button onClick={handleRegister} className={styles.newAssetButton}>
            Novo Ativo
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Carregando ativos...</p>
      ) : (
        <>
          {message && <p className={styles.message}>{message}</p>}

          {filteredAssets.length === 0 && !message && searchTerm === "" ? (
            <p className={styles.noAssetsMessage}>
              Nenhum ativo encontrado. Crie um novo ativo!
            </p>
          ) : filteredAssets.length === 0 && !message && searchTerm !== "" ? (
            <p className={styles.noAssetsMessage}>
              Nenhum ativo encontrado para a pesquisa "{searchTerm}".
            </p>
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
                {filteredAssets.map((asset) => (
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
        </>
      )}
    </div>
  );
}

export default AssetList;
