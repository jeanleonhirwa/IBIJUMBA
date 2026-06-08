import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function Vehicles() {
  const { API } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => {
    API.get('/vehicles', { params: { search: search || undefined } })
      .then(res => setVehicles(res.data))
      .catch(() => toast.error('Failed to load vehicles'));
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await API.delete(`/vehicles/${id}`);
      toast.success('Vehicle deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Vehicles</h3>
        <Link to="/vehicles/new" className="btn btn-primary btn-sm">+ Add Vehicle</Link>
      </div>
      <div className="card">
        <div className="card-body">
          <input className="form-control search-box mb-3" placeholder="Search by plate, brand, model..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="table-responsive">
            <table className="table table-hover">
              <thead><tr>
                <th>Plate #</th><th>Brand</th><th>Model</th><th>Year</th><th>Type</th><th>Price</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v.Plate_Number}>
                    <td>{v.Plate_Number}</td>
                    <td>{v.Brand}</td>
                    <td>{v.Model}</td>
                    <td>{v.Year}</td>
                    <td>{v.Vehicle_Type}</td>
                    <td>{Number(v.Purchase_Price).toLocaleString()} RWF</td>
                    <td><span className={`badge bg-${v.Status === 'Available' ? 'success' : v.Status === 'Sold' ? 'secondary' : 'warning'}`}>{v.Status}</span></td>
                    <td>
                      <Link to={`/vehicles/edit/${v.Plate_Number}`} className="btn btn-sm btn-warning me-1">Edit</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(v.Plate_Number)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {vehicles.length === 0 && <tr><td colSpan="8" className="text-center text-muted">No vehicles found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vehicles;
