import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function Customers() {
  const { API } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => {
    API.get('/customers', { params: { search: search || undefined } })
      .then(res => setCustomers(res.data))
      .catch(() => toast.error('Failed to load customers'));
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await API.delete(`/customers/${id}`);
      toast.success('Customer deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const statusBadge = (s) => {
    const map = { Active: 'success', Inactive: 'warning', Blocked: 'danger' };
    return <span className={`badge bg-${map[s] || 'secondary'}`}>{s}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h3>Customers</h3>
        <Link to="/customers/new" className="btn btn-primary btn-sm">+ Add Customer</Link>
      </div>
      <div className="card">
        <div className="card-body">
          <input className="form-control search-box mb-3" placeholder="Search by name, email, phone..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="table-responsive">
            <table className="table table-hover">
              <thead><tr>
                <th>#</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={c.CustomerID}>
                    <td>{i + 1}</td>
                    <td>{c.FirstName}</td>
                    <td>{c.LastName}</td>
                    <td>{c.Email}</td>
                    <td>{c.PhoneNumber}</td>
                    <td>{statusBadge(c.Status)}</td>
                    <td>
                      <Link to={`/customers/edit/${c.CustomerID}`} className="btn btn-sm btn-warning me-1">Edit</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.CustomerID)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && <tr><td colSpan="7" className="text-center text-muted">No customers found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customers;
