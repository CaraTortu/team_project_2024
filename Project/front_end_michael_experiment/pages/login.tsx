// pages/login.tsx
import React from 'react';
import Link from 'next/link';
import styles from './Login.module.css'; // Make sure this path is correct

const Login: React.FC = () => {
  return (
    <div className={styles.loginContainer}>
    <form className={styles.loginForm}>
        <h1>Log in</h1>
        <input type="text" placeholder="Enter your login or email" />
        <input type="password" placeholder="Enter your password" />
        <button type="submit">Log in</button>
        <div className={styles.socialButtons}>
            <button>Google</button>
            <button>Apple</button>
            <button>Facebook</button>
        </div>
        <p>
            Not yet registered? 
            <Link href="/register" passHref><a href="/register">Register now!</a></Link>
        </p>
    </form>
    </div>
  );
};

export default Login;
