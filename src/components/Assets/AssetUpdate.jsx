import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';

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
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>Atualizar Ativo</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="serialNumber" style={{ display: 'block', marginBottom: '5px' }}>Número de Série:</label>
          <input
            type="text"
            id="serialNumber"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="responsible" style={{ display: 'block', marginBottom: '5px' }}>Responsável:</label>
          <input
            type="text"
            id="responsible"
            name="responsible"
            value={formData.responsible}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="condition" style={{ display: 'block', marginBottom: '5px' }}>Condição:</label>
          <input
            type="text"
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="notes" style={{ display: 'block', marginBottom: '5px' }}>Observações:</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: saving ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          {saving ? 'Atualizando...' : 'Atualizar'}
        </button>
        <button type='button' onClick={() => navigate('/assets')} style={{
          width: '100%',
          marginTop: '10px',
          padding: '10px',
          backgroundColor: saving ? '#6c757d' : '#ff0000ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: saving ? 'not-allowed' : 'pointer'
        }}>voltar</button>
      </form>

      {message && (
        <p style={{ marginTop: '20px', color: message.includes('sucesso') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default AssetsUpdate;