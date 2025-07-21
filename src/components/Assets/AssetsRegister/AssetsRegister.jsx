import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './AssetsRegister.module.css';

function AssetsRegister() {
  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [responsible, setResponsible] = useState('');
  const [condition, setCondition] = useState('');
  const [notes, setNotes] = useState('');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/assets',
        {
          name,
          serialNumber,
          responsible,
          condition,
          notes,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message || 'Ativo registrado com sucesso.');
      navigate('/assets');
    } catch (error) {
      console.error('Erro no cadastro de Ativo:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Erro ao cadastrar ativo.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Registrar Ativo</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Nome:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="serialNumber" className={styles.label}>Número de Série:</label>
          <input
            type="text"
            id="serialNumber"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="responsible" className={styles.label}>Responsável:</label>
          <input
            type="text"
            id="responsible"
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="condition" className={styles.label}>Condição:</label>
          <input
            type="text"
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="notes" className={styles.label}>Observações:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={styles.textarea}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Registrar
        </button>
        <button type="button" className={styles.backButton} onClick={() => navigate('/assets')}> Voltar </button>

        
      </form>

      {message && (
        <div className={`${styles.message} ${message.includes('sucesso') ? styles.messageSuccess : styles.messageError}`}>
          {message}
        </div>
      )}
    </div>
  );
}
  export default AssetsRegister;
