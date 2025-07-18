import { Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
    return (
        <nav className={styles.header}>
            <div className={styles.navProfile}>
                <img src='https://cdn-icons-png.flaticon.com/512/149/149071.png' alt='Profile' width='30px' />
                <p>Olá, Lucas</p>
            </div>
            <div className={styles.navDiv}>
                <Link to="/register" className={styles.navItems}>Registrar</Link>
                <Link to="/login" className={styles.navItems}>Login</Link>
                <Link to="/assets" className={styles.navItems}>Ativos</Link>
            </div>

        </nav>
    )
};

export default Header;