import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addExchangeRate, getCurrencies, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { toast } from 'react-toastify';

const AddExchangeRate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currencies, isLoading, error, success } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    currency_id: '',
    date: '',
    rate: ''
  });
  const lastErrorRef = useRef({ message: null, time: 0 });
  const lastSuccessRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getCurrencies({ page: 1, per_page: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const now = Date.now();
      const last = lastSuccessRef.current;
      if (!last.message || last.message !== success || now - last.time > 2000) {
        toast.success(success, { rtl: true });
        lastSuccessRef.current = { message: success, time: now };
      }
      setTimeout(() => {
        dispatch(clearSuccess());
        navigate('/exchange-rates');
      }, 1500);
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      const now = Date.now();
      const last = lastErrorRef.current;
      if (!last.message || last.message !== error || now - last.time > 2000) {
        toast.error(error, { rtl: true });
        lastErrorRef.current = { message: error, time: now };
      }
      setTimeout(() => dispatch(clearError()), 3000);
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'rate' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      currency_id: parseInt(form.currency_id),
      date: form.date,
      rate: parseFloat(form.rate)
    };
    await dispatch(addExchangeRate(submitData));
  };

  return (
    <div style={{ 
      padding: '30px',
      backgroundColor: '#121828',
      minHeight: 'calc(100vh - 80px)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px' }}>إضافة سعر صرف</h1>
      
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: '#202938',
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '32px',
        width: '100%',
        maxWidth: '750px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            العملة <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <select
            name="currency_id"
            value={form.currency_id}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#1a1f2e',
              border: '1px solid #333',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            <option value="">اختر العملة</option>
            {(currencies || []).map((currency) => (
              <option key={currency.id} value={currency.id}>
                {currency.code} - {currency.name_ar || currency.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            التاريخ <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#1a1f2e',
              border: '1px solid #333',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            سعر الصرف <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="rate"
            value={form.rate}
            onChange={handleChange}
            required
            placeholder="أدخل سعر الصرف"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#1a1f2e',
              border: '1px solid #333',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '30px' }}>
          <button
            type="button"
            onClick={() => navigate('/exchange-rates')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#AC2000',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExchangeRate;

