import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function VehicleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { API } = useAuth();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ Plate_Number: '', Brand: '', Model: '', Year: '', Vehicle_Type: '', Purchase_Price: '', Status: 'Available' });

  useEffect(() => {
    if (isEdit) {
      API.get(`/vehicles/${id}`).then(res => setForm(res.data)).catch(() => {});
    }
  }, [id, isEdit, API]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await API.put(`/vehicles/${id}`, form);
        toast.success('Vehicle updated');
      } else {
        await API.post('/vehicles', form);
        toast.success('Vehicle created');
      }
      navigate('/vehicles');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header bg-primary text-white">{isEdit ? 'Edit Vehicle' : 'Add Vehicle'}</div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Plate Number</label>
                <input name="Plate_Number" className="form-control" value={form.Plate_Number} onChange={handleChange} required disabled={isEdit} />
              </div>
              <div className="row mb-3">
                <div className="col"><label className="form-label">Brand</label><input name="Brand" className="form-control" value={form.Brand} onChange={handleChange} required /></div>
                <div className="col"><label className="form-label">Model</label><input name="Model" className="form-control" value={form.Model} onChange={handleChange} required /></div>
              </div>
              <div className="row mb-3">
                <div className="col"><label className="form-label">Year</label><input name="Year" type="number" className="form-control" value={form.Year} onChange={handleChange} required /></div>
                <div className="col"><label className="form-label">Vehicle Type</label>
                  <select name="Vehicle_Type" className="form-select" value={form.Vehicle_Type} onChange={handleChange} required>
                    <option value="">Select...</option>
                    <option>Sedan</option><option>SUV</option><option>Truck</option><option>Hatchback</option><option>Van</option>
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col"><label className="form-label">Purchase Price (RWF)</label><input name="Purchase_Price" type="number" className="form-control" value={form.Purchase_Price} onChange={handleChange} required /></div>
                <div className="col"><label className="form-label">Status</label>
                  <select name="Status" className="form-select" value={form.Status} onChange={handleChange}>
                    <option>Available</option><option>Sold</option><option>Pending</option>
                  </select>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" type="submit">{isEdit ? 'Update' : 'Save'}</button>
                <button className="btn btn-secondary" type="button" onClick={() => navigate('/vehicles')}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleForm;
