import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out');
    navigate('/login');
  };

  const linkClass = ({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : ''}`;

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-start" style={{ width: 260, minHeight: '100vh', flexDirection: 'column', alignItems: 'stretch', paddingTop: 20 }}>
      <div className="text-center mb-4">
        <h5 className="text-white mb-0">SwiftWheels</h5>
        <small className="text-secondary">PMS System</small>
      </div>
      <div className="navbar-nav flex-column px-3">
        <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
        <NavLink to="/vehicles" className={linkClass}>Vehicles</NavLink>
        <NavLink to="/customers" className={linkClass}>Customers</NavLink>
        <NavLink to="/promotions" className={linkClass}>Promotions</NavLink>
        <NavLink to="/promotion-vehicles" className={linkClass}>Promotion-Vehicle</NavLink>
        <NavLink to="/reports" className={linkClass}>Reports</NavLink>
      </div>
      <div className="mt-auto px-3 pb-3" style={{ marginTop: 'auto' }}>
        <div className="text-white small mb-2">
          <span className="badge bg-info me-1">{user?.role}</span> {user?.username}
        </div>
        <button className="btn btn-outline-light btn-sm w-100" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
