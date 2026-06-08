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

  const linkClass = ({ isActive }) =>
    `nav-link px-3 py-2 rounded mb-1 ${isActive ? 'active fw-semibold text-white bg-primary' : 'text-white-50'}`;

  return (
    <div className="sidebar d-flex flex-column">
      <div className="text-center py-4 border-bottom border-secondary">
        <h5 className="text-white mb-0 fw-bold">SwiftWheels</h5>
        <small className="text-secondary">PMS System</small>
      </div>
      <nav className="navbar-nav flex-column px-2 py-3">
        <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
        <NavLink to="/vehicles" className={linkClass}>Vehicles</NavLink>
        <NavLink to="/customers" className={linkClass}>Customers</NavLink>
        <NavLink to="/promotions" className={linkClass}>Promotions</NavLink>
        <NavLink to="/promotion-vehicles" className={linkClass}>Promotion-Vehicle</NavLink>
        <NavLink to="/reports" className={linkClass}>Reports</NavLink>
      </nav>
      <div className="mt-auto px-3 pb-4 border-top border-secondary pt-3">
        <div className="d-flex align-items-center text-white mb-2 small">
          <span className="badge bg-info me-2">{user?.role}</span>
          <span className="text-truncate">{user?.username}</span>
        </div>
        <button className="btn btn-outline-light btn-sm w-100" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
