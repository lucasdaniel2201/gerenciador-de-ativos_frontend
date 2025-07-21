import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const updateUserFromStorage = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsername(parsedUser.username);
    } else {
      setUsername('');
    }
  };

  useEffect(() => {
    // Atualizar na montagem do componente
    updateUserFromStorage();

    // Listener para mudanças no localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        updateUserFromStorage();
      }
    };

    // Adicionar listener para mudanças entre abas
    window.addEventListener('storage', handleStorageChange);

    // Listener customizado para mudanças na mesma aba
    const handleAuthChange = () => {
      updateUserFromStorage();
    };

    window.addEventListener('authStateChanged', handleAuthChange);

    // Cleanup dos listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUsername('');

    // Disparar evento customizado para atualizar outros componentes se necessário
    window.dispatchEvent(new CustomEvent('authStateChanged'));

    navigate('/login');
  };

  return (
    <nav className={styles.header}>
      <div className={styles.navProfile}>
        <img
          src='https://cdn-icons-png.flaticon.com/512/149/149071.png'
          alt='Profile'
          width='30px'
        />
        {username ? <p>Olá, {username}</p> : <p>Olá, usuário</p>}
      </div>
      <div className={styles.navDiv}>
        {!username ? (
          <>
            <Link to="/register" className={styles.navItems}>Registrar</Link>
            <Link to="/login" className={styles.navItems}>Login</Link>
          </>
        ) : (
          <>
            <button onClick={handleLogout} className={styles.navItems}>Sair</button>
            <Link to="/assets" className={styles.navItems}>Ativos</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;