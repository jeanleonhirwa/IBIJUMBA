import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { API } = useAuth();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ FirstName: '', LastName: '', Email: '', PhoneNumber: '', Status: 'Active' });

  useEffect(() => {
    if (isEdit) {
      API.get(`/customers/${id}`).then(res => setForm(res.data)).catch(() => {});
    }
  }, [id, isEdit, API]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await API.put(`/customers/${id}`, form);
        toast.success('Customer updated');
      } else {
        await API.post('/customers', form);
        toast.success('Customer created');
      }
      navigate('/customers');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header bg-primary text-white">{isEdit ? 'Edit Customer' : 'Add Customer'}</div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col"><label className="form-label">First Name</label><input name="FirstName" className="form-control" value={form.FirstName} onChange={handleChange} required /></div>
                <div className="col"><label className="form-label">Last Name</label><input name="LastName" className="form-control" value={form.LastName} onChange={handleChange} required /></div>
              </div>
              <div className="mb-3"><label className="form-label">Email</label><input name="Email" type="email" className="form-control" value={form.Email} onChange={handleChange} required /></div>
              <div className="mb-3"><label className="form-label">Phone Number</label><input name="PhoneNumber" className="form-control" value={form.PhoneNumber} onChange={handleChange} required /></div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select name="Status" className="form-select" value={form.Status} onChange={handleChange}>
                  <option>Active</option><option>Inactive</option><option>Blocked</option>
                </select>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" type="submit">{isEdit ? 'Update' : 'Save'}</button>
                <button className="btn btn-secondary" type="button" onClick={() => navigate('/customers')}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerForm;
