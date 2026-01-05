import styles from './Login.module.css';
import LoginComponent from '../../components/loginComponent/LoginComponent';

function LoginPage({  }) {
  return (
    <div className={styles.container}>
      <LoginComponent />
    </div>
  )
}

export default LoginPage;