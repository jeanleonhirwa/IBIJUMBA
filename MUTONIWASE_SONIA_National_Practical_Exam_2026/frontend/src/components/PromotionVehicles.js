import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function PromotionVehicles() {
  const { API } = useAuth();
  const [links, setLinks] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ PromotionID: '', Plate_Number: '', Performance: 'Medium' });
  const [editing, setEditing] = useState(null);

  const load = () => {
    API.get('/promotion-vehicles').then(res => setLinks(res.data)).catch(() => {});
    API.get('/promotions').then(res => setPromotions(res.data.filter(p => p.Status === 'Active'))).catch(() => {});
    API.get('/vehicles').then(res => setVehicles(res.data.filter(v => v.Status === 'Available'))).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/promotion-vehicles', form);
      toast.success('Vehicle linked to promotion');
      setForm({ PromotionID: '', Plate_Number: '', Performance: 'Medium' });
      load();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const handleUpdate = async (link) => {
    try {
      await API.put('/promotion-vehicles', {
        PromotionID: link.PromotionID,
        Plate_Number: link.Plate_Number,
        Performance: link.Performance
      });
      toast.success('Performance updated');
      setEditing(null);
      load();
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (promotionId, plateNumber) => {
    if (!window.confirm('Remove this link?')) return;
    try {
      await API.delete('/promotion-vehicles', { data: { PromotionID: promotionId, Plate_Number: plateNumber } });
      toast.success('Link removed');
      load();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="page-header">
        <h3>Promotion-Vehicle Links</h3>
      </div>
      <div className="card">
        <div className="card-header bg-white fw-bold border-bottom">Link Vehicle to Promotion</div>
        <div className="card-body">
          <form onSubmit={handleAdd} className="row g-2">
            <div className="col-md-4">
              <select className="form-select" value={form.PromotionID} onChange={e => setForm({...form, PromotionID: e.target.value})} required>
                <option value="">Select Promotion</option>
                {promotions.map(p => <option key={p.PromotionID} value={p.PromotionID}>{p.Title}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={form.Plate_Number} onChange={e => setForm({...form, Plate_Number: e.target.value})} required>
                <option value="">Select Vehicle</option>
                {vehicles.map(v => <option key={v.Plate_Number} value={v.Plate_Number}>{v.Plate_Number} - {v.Brand} {v.Model}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={form.Performance} onChange={e => setForm({...form, Performance: e.target.value})}>
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary w-100" type="submit">Link</button>
            </div>
          </form>
        </div>
      </div>
      <div className="card mt-3">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead><tr>
                <th>Promotion</th><th>Vehicle</th><th>Performance</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {links.map((l, i) => (
                  <tr key={`${l.PromotionID}-${l.Plate_Number}-${i}`}>
                    <td>{l.promotionTitle}</td>
                    <td>{l.Brand} {l.Model} ({l.Plate_Number})</td>
                    <td>
                      {editing === `${l.PromotionID}-${l.Plate_Number}` ? (
                        <select className="form-select form-select-sm d-inline w-auto" value={l.Performance}
                          onChange={e => { const nl = [...links]; nl[i].Performance = e.target.value; setLinks(nl); }}>
                          <option>High</option><option>Medium</option><option>Low</option>
                        </select>
                      ) : (
                        <span className={`badge bg-${l.Performance === 'High' ? 'success' : l.Performance === 'Medium' ? 'warning' : 'secondary'}`}>{l.Performance}</span>
                      )}
                    </td>
                    <td>
                      {editing === `${l.PromotionID}-${l.Plate_Number}` ? (
                        <>
                          <button className="btn btn-sm btn-success me-1" onClick={() => handleUpdate(l)}>Save</button>
                          <button className="btn btn-sm btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-sm btn-warning me-1" onClick={() => setEditing(`${l.PromotionID}-${l.Plate_Number}`)}>Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(l.PromotionID, l.Plate_Number)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {links.length === 0 && <tr><td colSpan="4" className="text-center text-muted">No links found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromotionVehicles;
