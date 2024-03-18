// pages/index.tsx
import React from 'react';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const Home: React.FC = () => (
  <div>
    <Header />
    <MainContent />
    <CallToAction />
    <Footer />
  </div>
);

export default Home;
