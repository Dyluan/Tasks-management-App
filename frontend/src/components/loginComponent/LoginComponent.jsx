import styles from './Login.module.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useState } from 'react';

function LoginComponent({ userHasAnAccount=true }) {

  const [displayLogin, setDisplayLogin] = useState(userHasAnAccount);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.logo}>
          My logo
        </div>
        <div className={styles.title}>
          Login
        </div>
        <div className={styles.emailField}>
          <div className={styles.emailTitle}>Email</div>
          <TextField label='Email' variant='outlined' size='small' sx={{width: '100%'}} />
        </div>
        <div className={styles.passwordField}>
          <div className={styles.passwordTitle}>Password</div>
          <TextField label='Password' type='password' size='small' sx={{width: '100%'}} />
        </div>
        <div className={styles.signField}>
          <Button 
            variant="contained" 
            sx={{
              width: '100%',
              backgroundColor: '#003465',
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '16px'
            }}
          >Sign in</Button>
        </div>
        <div className={styles.continue}>
          or continue with
        </div>
        <div className={styles.socials}>
          <button><GoogleIcon /></button>
          <button><FacebookIcon /></button>
          <button><GitHubIcon /></button>
        </div>
        <div className={styles.bottomText}>
          Don't have an account yet? <a className={styles.registerLink} onClick={() => setDisplayLogin(false)}>Register</a> for free
        </div>
      </div>
    </div>
  )
}

export default LoginComponent;