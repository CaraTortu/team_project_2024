// components/MainContent.tsx
import React from 'react';
import styles from './MainContent.module.css';

const MainContent: React.FC = () => {
  return (
    <div className={styles.mainContent}>
      <h1>Welcome to Our Website</h1>
      <p>Providing high-quality care for all your healthcare needs.</p>
    </div>
  );
};

export default MainContent;
