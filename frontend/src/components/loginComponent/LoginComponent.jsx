import styles from './Login.module.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import siteLogo from '../../assets/site_logo.svg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

function LoginComponent({ userHasAnAccount=true }) {

  const [displayLogin, setDisplayLogin] = useState(userHasAnAccount);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [userName, setUsername] = useState('');
  
  // Error states
  const [emailError, setEmailError] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [tempPasswordError, setTempPasswordError] = useState('');
  
  // Track if fields have been touched
  const [emailTouched, setEmailTouched] = useState(false);
  const [userNameTouched, setUserNameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [tempPasswordTouched, setTempPasswordTouched] = useState(false);

  const navigate = useNavigate();
  const { updateUser, createWorkspace } = useUser();

  // Password strength validation
  const validatePasswordStrength = (pwd) => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  // Email validation
  const validateEmail = (emailAddress) => {
    if (!emailAddress.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Validate email field on blur
  const handleEmailBlur = () => {
    setEmailTouched(true);
    const emailValidationError = validateEmail(email);
    setEmailError(emailValidationError);
  };

  // Validate username field on blur
  const handleUsernameBlur = () => {
    setUserNameTouched(true);
    if (!userName.trim()) {
      setUserNameError('Username is required');
    } else {
      setUserNameError('');
    }
  };

  // Validate password on blur
  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    const strengthError = validatePasswordStrength(password);
    setPasswordError(strengthError);
  };

  // Validate password match on blur
  const handleTempPasswordBlur = () => {
    setTempPasswordTouched(true);
    if (tempPassword !== password) {
      setTempPasswordError('Passwords do not match');
    } else {
      setTempPasswordError('');
    }
  };

  const handleLoginClick = () => {
    const homePath = '/home';
    navigate(homePath);
  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.logo}>
          <img src={siteLogo} alt="logo" />
        </div>
        {displayLogin ? (
          <>
            <div className={styles.title}>
              Login
            </div>
            <div className={styles.emailField}>
              <div className={styles.emailTitle}>Email</div>
              <TextField 
                label='Email' 
                variant='outlined' 
                size='small' 
                sx={{width: '100%'}} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div className={styles.passwordField}>
              <div className={styles.passwordTitle}>Password</div>
              <TextField 
                label='Password' 
                type='password' 
                size='small' 
                sx={{width: '100%'}} 
                onChange={(e) => setPassword(e.target.value)} 
              />
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
                onClick={() => handleLoginClick()}
              >Sign in</Button>
            </div>
            <div className={styles.continue}>
              or continue with
            </div>
            <div className={styles.socials}>
              <button><GoogleIcon onClick={() => {
                window.location.href = 'http://localhost:5500/auth/google/login'
              }} /></button>
              <button><FacebookIcon onClick={() => {
                window.location.href = 'http://localhost:5500/auth/facebook/login'
              }}/></button>
              <button><GitHubIcon onClick={() => {
                window.location.href = 'http://localhost:5500/auth/github/login'  
              }} />
              </button>
            </div>
            <div className={styles.bottomText}>
              Don't have an account yet? <a className={styles.registerLink} onClick={() => setDisplayLogin(false)}>Register</a> for free
            </div>
          </>
        ) : (
          <>
            <div className={styles.title}>
              Create a new account
            </div>
            <div className={styles.emailField}>
              <div className={styles.emailTitle}>Username</div>
              <TextField 
                label='Username' 
                variant='outlined' 
                size='small' 
                sx={{width: '100%'}} 
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (userNameTouched && !e.target.value.trim()) {
                    setUserNameError('Username is required');
                  } else if (userNameTouched) {
                    setUserNameError('');
                  }
                }}
                onBlur={handleUsernameBlur}
                error={!!userNameError}
                helperText={userNameError}
              />
            </div>
            <div className={styles.emailField}>
              <div className={styles.emailTitle}>Email</div>
              <TextField 
                label='Email' 
                variant='outlined' 
                size='small' 
                sx={{width: '100%'}} 
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailTouched) {
                    const emailValidationError = validateEmail(e.target.value);
                    setEmailError(emailValidationError);
                  }
                }}
                onBlur={handleEmailBlur}
                error={!!emailError}
                helperText={emailError}
              />
            </div>
            <div className={styles.passwordField}>
              <div className={styles.passwordTitle}>Password</div>
              <TextField 
                label='Password' 
                type='password' 
                size='small' 
                sx={{width: '100%'}} 
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordTouched) {
                    const strengthError = validatePasswordStrength(e.target.value);
                    setPasswordError(strengthError);
                  }
                  // Re-validate tempPassword match if it's been touched
                  if (tempPasswordTouched && tempPassword) {
                    if (tempPassword !== e.target.value) {
                      setTempPasswordError('Passwords do not match');
                    } else {
                      setTempPasswordError('');
                    }
                  }
                }}
                onBlur={handlePasswordBlur}
                error={!!passwordError}
                helperText={passwordError}
              />
            </div>
            <div className={styles.passwordField}>
              <div className={styles.passwordTitle}>Repeat password</div>
              <TextField 
                label='Password' 
                type='password' 
                size='small' 
                sx={{width: '100%'}} 
                onChange={(e) => {
                  setTempPassword(e.target.value);
                  if (tempPasswordTouched) {
                    if (e.target.value !== password) {
                      setTempPasswordError('Passwords do not match');
                    } else {
                      setTempPasswordError('');
                    }
                  }
                }}
                onBlur={handleTempPasswordBlur}
                error={!!tempPasswordError}
                helperText={tempPasswordError}
              />
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
                onClick={() => handleLoginClick()}
              >Register</Button>
            </div>
          </>
        )}
        
      </div>
    </div>
  )
}

export default LoginComponent;