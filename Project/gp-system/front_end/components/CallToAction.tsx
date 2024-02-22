// CallToAction.tsx
import React from 'react';
import styles from './CallToAction.module.css';
import Link from 'next/link';

const CallToAction: React.FC = () => (
  <div className={styles.callToAction}>
    <Link href="/login">
      <a href="/login" className={styles.ctaButton}>Sign Up / Login</a>
    </Link>
  </div>
);


export default CallToAction;
