import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function Report() {
  const { API } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/reports/customer-promotions')
      .then(res => setData(res.data))
      .catch(() => toast.error('Failed to load report'))
      .finally(() => setLoading(false));
  }, [API]);

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div>
      <div className="page-header">
        <h3>Customer-Promotion Report</h3>
        <button className="btn btn-success btn-sm" onClick={() => window.print()}>Print Report</button>
      </div>
      <div className="card">
        <div className="card-header bg-primary text-white">All Customers & Applicable Promotions</div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Customer Name</th>
                  <th>Vehicle Brand</th>
                  <th>Vehicle Model</th>
                  <th>Promotion Title</th>
                  <th>Discount Value</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {data.map((r, i) => (
                  <tr key={i}>
                    <td>{r.CustomerName}</td>
                    <td>{r.Brand}</td>
                    <td>{r.Model}</td>
                    <td>{r.PromotionTitle}</td>
                    <td>{r.DiscountValue}</td>
                    <td>
                      <span className={`badge bg-${r.Performance === 'High' ? 'success' : r.Performance === 'Medium' ? 'warning' : 'secondary'}`}>
                        {r.Performance}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr><td colSpan="6" className="text-center text-muted">No report data available</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {data.length > 0 && (
            <div className="text-muted small mt-2">Total records: {data.length}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Report;
