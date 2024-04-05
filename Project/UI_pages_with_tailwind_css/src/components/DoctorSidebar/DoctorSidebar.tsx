import React from 'react';
import { Link } from 'react-router-dom';

const DoctorSidebar: React.FC = () => {
    return (
      <div className="fixed left-0 top-0 z-10 flex h-full w-64 flex-col overflow-auto bg-blue-800 text-white">
        <div className="flex h-full w-64 flex-col items-center bg-blue-800 text-white">
          <div className="px-4 py-6">
                      <img
                          src="/logo.png"
                          alt="GP Appointment System Logo"
                          className="h-32 w-32 rounded-full"
                      />
                  </div>
            <nav className="w-full flex-grow">
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/doctor-info" className="block py-2 px-4 hover:bg-blue-700">My Info</Link>
                </li>
                <li>
                  <Link to="/doctor-dashboard" className="block py-2 px-4 bg-blue-700">My Schedule</Link>
                </li>
                <li>
                  <Link to="/patient-info" className="block py-2 px-4 hover:bg-blue-700">Patient Records</Link>
                </li>       
                <li>
                  <Link to="/doctor-support" className="block py-2 px-4 hover:bg-blue-700">Help/Support</Link>
                </li>
              </ul>
            </nav>
        <div>
          <Link to="/sign-out" className="block py-2 px-4 hover:bg-blue-700">Sign Out</Link>
        </div>
      </div>
    </div>
        
        
    );
};

export default DoctorSidebar;
