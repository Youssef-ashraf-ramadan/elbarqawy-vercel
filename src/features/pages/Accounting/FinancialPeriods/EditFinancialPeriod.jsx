import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  getFinancialPeriodDetails,
  updateFinancialPeriod,
  clearError,
  clearSuccess,
  clearFinancialPeriodDetails,
} from '../../../../redux/Slices/authSlice';

const statusOptions = ['Open', 'Closed', 'Pending'];

const EditFinancialPeriod = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { financialPeriodDetails, isLoading, error, success } = useSelector((state) => state.auth);

  const lastErrorRef = useRef({ message: null, time: 0 });
  const lastSuccessRef = useRef({ message: null, time: 0 });

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    dispatch(getFinancialPeriodDetails(id));
    return () => {
      dispatch(clearFinancialPeriodDetails());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (financialPeriodDetails) {
      setFormData({
        name: financialPeriodDetails.name || '',
        start_date: financialPeriodDetails.start_date || '',
        end_date: financialPeriodDetails.end_date || '',
        status: financialPeriodDetails.status || 'Open',
      });
    }
  }, [financialPeriodDetails]);

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
        navigate('/financial-periods');
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;
    if (!formData.name || !formData.start_date || !formData.end_date) {
      toast.error('برجاء إدخال جميع الحقول المطلوبة', { rtl: true });
      return;
    }
    dispatch(updateFinancialPeriod({ id, data: formData }));
  };

  if (!formData) {
    return (
      <div
        style={{
          padding: '30px',
          backgroundColor: '#121828',
          minHeight: 'calc(100vh - 80px)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        جاري التحميل...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '30px',
        backgroundColor: '#121828',
        minHeight: 'calc(100vh - 80px)',
        color: 'white',
      }}
    >
      <div style={{ marginBottom: '30px', maxWidth: '900px', marginInline: 'auto' }}>
        <button
          onClick={() => navigate('/financial-periods')}
          style={{
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            fontSize: '14px',
          }}
        >
          <FaArrowRight />
          الرجوع
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>تعديل الفترة المالية</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#202938',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '32px',
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: 'white' }}>
              اسم الفترة <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: 'white' }}>
                تاريخ البداية <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
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
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: 'white' }}>
                تاريخ النهاية <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
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
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: 'white' }}>
              حالة الفترة
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box',
                cursor: 'pointer',
              }}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/financial-periods')}
            style={{
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
            }}
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: '#AC2000',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFinancialPeriod;


