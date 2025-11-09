import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrencyDetails, updateCurrency, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { toast } from 'react-toastify';

const EditCurrency = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currencyDetails, isLoading, error, success } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name_en: '', name_ar: '', code: '', symbol: '', is_base_currency: false });
  const lastErrorRef = useRef({ message: null, time: 0 });
  const lastSuccessRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    if (id) dispatch(getCurrencyDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currencyDetails) {
      setForm({
        name_en: currencyDetails.name_en || currencyDetails.name || '',
        name_ar: currencyDetails.name_ar || currencyDetails.name || '',
        code: currencyDetails.code || '',
        symbol: currencyDetails.symbol || '',
        is_base_currency: currencyDetails.is_base_currency || false
      });
    }
  }, [currencyDetails]);

  useEffect(() => {
    if (success) {
      const now = Date.now();
      const last = lastSuccessRef.current;
      if (!last.message || last.message !== success || now - last.time > 2000) {
        toast.success(success, { rtl: true });
        lastSuccessRef.current = { message: success, time: now };
        setTimeout(() => {
          dispatch(clearSuccess());
          navigate('/currencies');
        }, 1500);
      }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCurrency({ id, data: form }));
  };

  if (isLoading && !currencyDetails) {
    return (
      <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        جاري التحميل...
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '30px' }}>تعديل العملة</h1>
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#202938', border: '1px solid #333', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '750px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>الاسم بالإنجليزية *</label>
          <input
            type="text"
            value={form.name_en}
            onChange={(e) => setForm({ ...form, name_en: e.target.value })}
            required
            style={{ width: '100%', padding: '12px', backgroundColor: '#1a1f2e', border: '1px solid #333', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>الاسم بالعربية *</label>
          <input
            type="text"
            value={form.name_ar}
            onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
            required
            style={{ width: '100%', padding: '12px', backgroundColor: '#1a1f2e', border: '1px solid #333', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>الكود *</label>
          <input
            type="text"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            required
            style={{ width: '100%', padding: '12px', backgroundColor: '#1a1f2e', border: '1px solid #333', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>الرمز *</label>
          <input
            type="text"
            value={form.symbol}
            onChange={(e) => setForm({ ...form, symbol: e.target.value })}
            required
            style={{ width: '100%', padding: '12px', backgroundColor: '#1a1f2e', border: '1px solid #333', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.is_base_currency}
              onChange={(e) => setForm({ ...form, is_base_currency: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px' }}>عملة أساسية</span>
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
          <button type="button" onClick={() => navigate('/currencies')} style={{ background: '#666', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer' }}>إلغاء</button>
          <button type="submit" disabled={isLoading} style={{ background: '#AC2000', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', opacity: isLoading ? 0.7 : 1 }}>{isLoading ? 'جاري الحفظ...' : 'حفظ'}</button>
        </div>
      </form>
    </div>
  );
};

export default EditCurrency;

