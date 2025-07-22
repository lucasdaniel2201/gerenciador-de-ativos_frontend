import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPremium, setIsPremium] = useState(null); // Estado para plano premium
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook para navegação

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o recarregamento da página
    setMessage(''); // Limpa mensagens anteriores

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username,
        email,
        password,
        isPremium
      });
      setMessage(response.data.message);
      navigate('/login'); 
    } catch (error) {
      console.error('Erro no registro:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Erro ao registrar. Tente novamente.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Registrar</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.label}>Usuário:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
          <div className={styles.planContainer}>
          <input
            type="radio"
            id="isPremium"
            name="plan"
            checked={isPremium === true}
            onChange={() => setIsPremium(true)}
            required
            className={styles.planRadio}
          />
          <label htmlFor="isPremium" className={styles.plan}>Premium - Max. 150 ativos</label>
          </div>
          <div className={styles.planContainer}>
          <input
            type="radio"
            name="plan"
            id="isNotPremium"
            checked={isPremium === false}
            onChange={() => setIsPremium(false)}
            required
            className={styles.planRadio}
          />
          <label htmlFor="isNotPremium" className={styles.plan}>Gratuito - Max. 10 ativos</label> 
          </div>
        </div>
        {!isPremium ? (
          <button type="submit" className={styles.submitButton}>Registrar</button>
        ): (
          <button type="button" onClick={() => navigate('/login')} className={styles.submitButton}>Ir para pagamento</button>
        )}
      </form>
      {message && (
        <p className={`${styles.message} ${message.includes('sucesso') ? styles.success : styles.error}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Register;