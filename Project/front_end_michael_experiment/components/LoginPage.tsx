import React from 'react';
import styles from './LoginPage.module.css'; // Import corresponding styles

const LoginPage: React.FC = () => (
  <div className={styles.loginContainer}>
    <form className={styles.loginForm}>
      <h1 className={styles.loginTitle}>Log in</h1>
      <input type="text" placeholder="Enter your login or email" className={styles.inputField} />
      <input type="password" placeholder="Enter your password" className={styles.inputField} />
      <button type="submit" className={styles.loginButton}>Log in</button>

      <div className={styles.divider}>or</div>

      <button type="button" className={`${styles.socialButton} ${styles.google}`}>Google</button>
      <button type="button" className={`${styles.socialButton} ${styles.apple}`}>Apple</button>
      <button type="button" className={`${styles.socialButton} ${styles.facebook}`}>Facebook</button>

      <p className={styles.registerPrompt}>
        Not yet registered? <a href="/register" className={styles.registerLink}>Register now!</a>
      </p>
    </form>
  </div>
);

export default LoginPage;
