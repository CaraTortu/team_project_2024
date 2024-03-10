import React from 'react';
import Sidebar from '../../components/SideBar';


const Upcoming: React.FC = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        <section className="upcoming-appointments">
          <h2>Upcoming</h2>
          <div className="appointment-item">
            <span className="appointment-date">24/02/2024, 10:30 AM</span>
            <span className="appointment-name">Blood Test</span>
          </div>
          <div className="appointment-item">
            <span className="appointment-date">18/02/2024, 3:15 PM</span>
            <span className="appointment-name">Breast X-ray</span>
          </div>
          {/* More appointments can be added here */}
        </section>
      </main>
    </div>
  );
};

export default Upcoming;
