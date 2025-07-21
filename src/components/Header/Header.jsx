import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Ajuste o caminho conforme sua estrutura
import styles from './Header.module.css';

function Header() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
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
        {user?.username ? (
          <p>Olá, {user.username}</p>
        ) : (
          <p>Olá, usuário</p>
        )}
      </div>
      <div className={styles.navDiv}>
        {!isAuthenticated() ? (
          <>
            <Link to="/register" className={styles.navItems}>Registrar</Link>
            <Link to="/login" className={styles.navItems}>Login</Link>
          </>
        ) : (
          <>
            <Link to="/assets" className={styles.navItems}>Ativos</Link>
            <button onClick={handleLogout} className={styles.navLogout}>Sair</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;