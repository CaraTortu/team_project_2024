// Header.tsx
import React from 'react';
import styles from './Header.module.css';
import Link from 'next/link';

const Header: React.FC = () => (
  <header className={styles.header}>
    <img src="/public/logo.png" className={styles.logo} alt="Clinic Logo" />
    <nav className={styles.nav}>
      <Link href="/services"><a className={styles.navItem}>Services</a></Link>
      <Link href="/about"><a className={styles.navItem}>About</a></Link>
      <Link href="/contact"><a className={styles.navItem}>Contact</a></Link>
      <Link href="/login"><a href="/login" className={`${styles.navItem} ${styles.loginButton}`}>Login/Register</a></Link>
    </nav>
  </header>
);


export default Header;
