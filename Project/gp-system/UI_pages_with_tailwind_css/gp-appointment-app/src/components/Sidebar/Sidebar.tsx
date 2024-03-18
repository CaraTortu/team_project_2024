import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-64 h-full overflow-auto bg-blue-800 text-white flex flex-col z-10">
      <div className="w-64 h-full bg-blue-800 text-white flex flex-col">
        <div className="px-4 py-6">
            <div>
              <img src="/logo.png" alt="GP Appointment System Logo" className="h-12 w-12" /> {/* will need to find logo soon */}
            </div>
          </div>
        <div className="flex-grow">
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/my-info" className="block py-2 px-4 hover:bg-blue-700">My Info</Link>
            </li>
            <li>
              <Link to="/upcoming-appointments" className="block py-2 px-4 bg-blue-700">Upcoming Appointments</Link>
            </li>
            <li>
              <Link to="/book-appointment" className="block py-2 px-4 hover:bg-blue-700">Book an Appointment</Link>
            </li>
            <li>
              <Link to="/billing" className="block py-2 px-4 hover:bg-blue-700">Billing & Payments</Link>
            </li>
            <li>
              <Link to="/help" className="block py-2 px-4 hover:bg-blue-700">Help/Support</Link>
            </li>
          </ul>
        </div>
        <div>
          <Link to="/sign-out" className="block py-2 px-4 hover:bg-blue-700">Sign Out</Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
