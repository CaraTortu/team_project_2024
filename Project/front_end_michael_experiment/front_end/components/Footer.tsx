// Footer.tsx
import React from 'react';
import styles from './Footer.module.css'; // Import corresponding styles

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <p>Contact us at: <a href="mailto:info@clinic.com">info@clinic.com</a></p>
    <p>Follow us on <a href="#social-media">social media</a>.</p>
    <p>&copy; {new Date().getFullYear()} Clinic Name. All rights reserved.</p>
  </footer>
);
export default Footer; // Use default export