import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { API } = useAuth();
  const [stats, setStats] = useState({ vehicles: 0, customers: 0, promotions: 0, activePromotions: 0 });

  useEffect(() => {
    Promise.all([
      API.get('/vehicles'),
      API.get('/customers'),
      API.get('/promotions')
    ]).then(([v, c, p]) => {
      setStats({
        vehicles: v.data.length,
        customers: c.data.length,
        promotions: p.data.length,
        activePromotions: p.data.filter(prom => prom.Status === 'Active').length
      });
    }).catch(() => {});
  }, [API]);

  return (
    <div>
      <div className="page-header">
        <h3>Dashboard</h3>
      </div>
      <div className="row g-4">
        <div className="col-md-3 col-6">
          <div className="card stat-card border-start border-4 border-primary">
            <div className="stat-number">{stats.vehicles}</div>
            <div className="stat-label">Total Vehicles</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card stat-card border-start border-4 border-success">
            <div className="stat-number">{stats.customers}</div>
            <div className="stat-label">Total Customers</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card stat-card border-start border-4 border-warning">
            <div className="stat-number">{stats.promotions}</div>
            <div className="stat-label">Total Promotions</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card stat-card border-start border-4 border-info">
            <div className="stat-number">{stats.activePromotions}</div>
            <div className="stat-label">Active Promotions</div>
          </div>
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-header bg-white text-dark border-bottom">Welcome to PMS</div>
        <div className="card-body">
          <p className="mb-0 text-muted">
            Promotion and Marketing Subsystem for <strong>SwiftWheels</strong>. 
            Manage vehicles, customers, promotions, and generate reports all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
