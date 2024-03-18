// src/components/Sidebar/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const getActiveClass = ({ isActive }: { isActive: boolean }) => isActive ? 'active' : '';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="logo-container">
        {/* Logo or image can go here */}
      </div>
      <nav className="navigation">
        <ul>
          <li><NavLink to="/my-info" className={getActiveClass}>My Info</NavLink></li>
          <li><NavLink to="/upcoming" className={getActiveClass}>Upcoming Appointments</NavLink></li>
          <li><NavLink to="/book-appointment" className={getActiveClass}>Book an Appointment</NavLink></li>
          <li><NavLink to="/billing" className={getActiveClass}>Billing & Payments</NavLink></li>
          <li><NavLink to="/support" className={getActiveClass}>Help/Support</NavLink></li>
          <li><NavLink to="/sign-out" className={getActiveClass}>Sign Out</NavLink></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
