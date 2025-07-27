import { useNavigate } from 'react-router-dom';
import styles from './Success.module.css';


function Success() {
    const navigate = useNavigate();

    return (
        <div className={styles.successPage}>
            <div className={styles.container}>
                <div className={styles.iconContainer}>
                    <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none" />
                        <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                </div>
                <h1 className={styles.title}>Pagamento Aprovado!</h1>
                <p className={styles.message}>Sua conta premium foi ativada. Agora você pode fazer login.</p>
                <button onClick={() => navigate('/login')} className={styles.loginButton}>
                    Ir para o Login
                </button>
            </div>
        </div>
    )
}


export default Success;

