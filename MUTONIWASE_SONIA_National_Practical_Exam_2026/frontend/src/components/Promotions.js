import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function Promotions() {
  const { API } = useAuth();
  const [promotions, setPromotions] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => {
    API.get('/promotions', { params: { search: search || undefined } })
      .then(res => setPromotions(res.data))
      .catch(() => toast.error('Failed to load promotions'));
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promotion?')) return;
    try {
      await API.delete(`/promotions/${id}`);
      toast.success('Promotion deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const statusBadge = (s) => {
    const map = { Active: 'success', Inactive: 'warning', Expired: 'danger' };
    return <span className={`badge bg-${map[s] || 'secondary'}`}>{s}</span>;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Promotions</h3>
        <Link to="/promotions/new" className="btn btn-primary btn-sm">+ Add Promotion</Link>
      </div>
      <div className="card">
        <div className="card-body">
          <input className="form-control search-box mb-3" placeholder="Search by title..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="table-responsive">
            <table className="table table-hover">
              <thead><tr>
                <th>#</th><th>Title</th><th>Discount Type</th><th>Discount Value</th><th>Start</th><th>End</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {promotions.map((p, i) => (
                  <tr key={p.PromotionID}>
                    <td>{i + 1}</td>
                    <td>{p.Title}</td>
                    <td>{p.Discount_Type}</td>
                    <td>{p.Discount_Value}</td>
                    <td>{new Date(p.Start_Date).toLocaleDateString()}</td>
                    <td>{new Date(p.End_Date).toLocaleDateString()}</td>
                    <td>{statusBadge(p.Status)}</td>
                    <td>
                      <Link to={`/promotions/edit/${p.PromotionID}`} className="btn btn-sm btn-warning me-1">Edit</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.PromotionID)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {promotions.length === 0 && <tr><td colSpan="8" className="text-center text-muted">No promotions found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Promotions;
