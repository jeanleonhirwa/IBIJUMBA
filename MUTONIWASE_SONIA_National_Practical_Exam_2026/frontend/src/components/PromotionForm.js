import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const TITLES = ['New Year Sale', 'Holiday Price Slash', 'Weekend Flash Sale', 'Clearance Discount Offer', 'Seasonal Price Drop'];
const DISCOUNT_TYPES = ['free', 'percentage', 'FLAT_RATE', 'CASHBACK', 'BUY_ONE_GET_ONE', 'Bundle', 'amount'];

function PromotionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { API } = useAuth();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ Title: '', Description: '', Discount_Type: '', Discount_Value: '', Start_Date: '', End_Date: '', Status: 'Active' });

  useEffect(() => {
    if (isEdit) {
      API.get(`/promotions/${id}`).then(res => {
        const d = res.data;
        setForm({
          ...d,
          Start_Date: d.Start_Date ? d.Start_Date.split('T')[0] : '',
          End_Date: d.End_Date ? d.End_Date.split('T')[0] : ''
        });
      }).catch(() => {});
    }
  }, [id, isEdit, API]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await API.put(`/promotions/${id}`, form);
        toast.success('Promotion updated');
      } else {
        await API.post('/promotions', form);
        toast.success('Promotion created');
      }
      navigate('/promotions');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header bg-primary text-white">{isEdit ? 'Edit Promotion' : 'Add Promotion'}</div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <select name="Title" className="form-select" value={form.Title} onChange={handleChange} required>
                  <option value="">Select title...</option>
                  {TITLES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea name="Description" className="form-control" rows="3" value={form.Description} onChange={handleChange}></textarea>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Discount Type</label>
                  <select name="Discount_Type" className="form-select" value={form.Discount_Type} onChange={handleChange} required>
                    <option value="">Select...</option>
                    {DISCOUNT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col">
                  <label className="form-label">Discount Value</label>
                  <input name="Discount_Value" type="number" step="0.01" className="form-control" value={form.Discount_Value} onChange={handleChange} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col"><label className="form-label">Start Date</label><input name="Start_Date" type="date" className="form-control" value={form.Start_Date} onChange={handleChange} required /></div>
                <div className="col"><label className="form-label">End Date</label><input name="End_Date" type="date" className="form-control" value={form.End_Date} onChange={handleChange} required /></div>
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select name="Status" className="form-select" value={form.Status} onChange={handleChange}>
                  <option>Active</option><option>Inactive</option><option>Expired</option>
                </select>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" type="submit">{isEdit ? 'Update' : 'Save'}</button>
                <button className="btn btn-secondary" type="button" onClick={() => navigate('/promotions')}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromotionForm;
