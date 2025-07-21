import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import styles from './AssetUpdate.module.css';

function AssetsUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    responsible: '',
    condition: '',
    notes: '',
    userId: ''
  })
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setFormData(prev => ({
        ...prev,
        userId: parsedUser.id
      }));
    }
    const loadData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/assets/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ) 
        ;
        setFormData(prev => ({
          ...response.data, userId: prev.userId
        }));
        console.log(response.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setMessage('Erro ao carregar dados.');
        setTimeout(() => navigate('/assets'), 2000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      setSaving(true);

      const response = await axios.put(
        `http://localhost:3000/api/assets/${id}`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response.data);
      setMessage(response.data.message || 'Ativo atualizado com sucesso.');
      
      setTimeout(() => {
        navigate('/assets');
      }, 1000);

    } catch (error) {
      console.error('Erro na atualização de Ativo:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Erro ao atualizar ativo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Atualizar Ativo</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="serialNumber" className={styles.label}>Número de Série:</label>
          <input
            type="text"
            id="serialNumber"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="responsible" className={styles.label}>Responsável:</label>
          <input
            type="text"
            id="responsible"
            name="responsible"
            value={formData.responsible}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="condition" className={styles.label}>Condição:</label>
          <input
            type="text"
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="notes" className={styles.label}>Observações:</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className={styles.textarea}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            disabled={saving}
            className={styles.updateButton}
          >
            {saving ? 'Atualizando...' : 'Atualizar'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/assets')}
            disabled={saving}
            className={styles.backButton}
          >
            Voltar
          </button>
        </div>
      </form>

      {message && (
        <div className={`${styles.message} ${message.includes('sucesso') ? styles.messageSuccess : styles.messageError}`}>
          {message}
        </div>
      )}
    </div>
  );
}
  export default AssetsUpdate;
