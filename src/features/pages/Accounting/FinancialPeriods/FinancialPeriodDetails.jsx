import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowRight, FaCalendarAlt, FaUser, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  getFinancialPeriodDetails,
  clearFinancialPeriodDetails,
  clearError,
} from '../../../../redux/Slices/authSlice';

const statusColors = {
  open: '#0d6efd',
  closed: '#dc3545',
  'soft closed': '#845ef7',
  pending: '#f59f00',
  default: '#6c757d',
};

const FinancialPeriodDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { financialPeriodDetails, isLoading, error } = useSelector((state) => state.auth);
  const lastErrorRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getFinancialPeriodDetails(id));
    return () => {
      dispatch(clearFinancialPeriodDetails());
    };
  }, [dispatch, id]);

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

  const renderStatusBadge = (status) => {
    if (!status) return '-';
    const key = status.toLowerCase();
    const backgroundColor = statusColors[key] || statusColors.default;
    return (
      <span
        style={{
          backgroundColor,
          color: 'white',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          display: 'inline-block',
        }}
      >
        {status}
      </span>
    );
  };

  if (isLoading && !financialPeriodDetails) {
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

  if (!financialPeriodDetails) {
    return (
      <div
        style={{
          padding: '30px',
          backgroundColor: '#121828',
          minHeight: 'calc(100vh - 80px)',
          color: 'white',
        }}
      >
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
        <div
          style={{
            backgroundColor: '#202938',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '16px',
          }}
        >
          لم يتم العثور على بيانات الفترة المالية.
        </div>
      </div>
    );
  }

  const period = financialPeriodDetails;

  return (
    <div
      style={{
        padding: '30px',
        backgroundColor: '#121828',
        minHeight: 'calc(100vh - 80px)',
        color: 'white',
      }}
    >
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

      <div
        style={{
          backgroundColor: '#202938',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '32px',
          width: '100%',
          maxWidth: '800px',
        }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px' }}>{period.name || `فترة #${id}`}</h1>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#1a1f2e',
              borderRadius: '10px',
              padding: '16px',
              border: '1px solid #2d3748',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <FaCalendarAlt style={{ color: '#AC2000' }} />
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>تاريخ البداية</span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{period.start_date || '-'}</div>
          </div>

          <div
            style={{
              backgroundColor: '#1a1f2e',
              borderRadius: '10px',
              padding: '16px',
              border: '1px solid #2d3748',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <FaCalendarAlt style={{ color: '#AC2000' }} />
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>تاريخ النهاية</span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{period.end_date || '-'}</div>
          </div>

          <div
            style={{
              backgroundColor: '#1a1f2e',
              borderRadius: '10px',
              padding: '16px',
              border: '1px solid #2d3748',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <FaLock style={{ color: '#AC2000' }} />
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>حالة الفترة</span>
            </div>
            <div>{renderStatusBadge(period.status)}</div>
          </div>

          <div
            style={{
              backgroundColor: '#1a1f2e',
              borderRadius: '10px',
              padding: '16px',
              border: '1px solid #2d3748',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <FaUser style={{ color: '#AC2000' }} />
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>أنشئت بواسطة</span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{period.created_by || '-'}</div>
          </div>
        </div>

        <div
          style={{
            marginTop: '30px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#1a1f2e',
              borderRadius: '10px',
              padding: '16px',
              border: '1px solid #2d3748',
            }}
          >
            <span style={{ fontSize: '14px', color: '#9ca3af' }}>تاريخ الإنشاء</span>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '6px' }}>{period.created_at || '-'}</div>
          </div>
          {period.updated_at && (
            <div
              style={{
                backgroundColor: '#1a1f2e',
                borderRadius: '10px',
                padding: '16px',
                border: '1px solid #2d3748',
              }}
            >
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>آخر تحديث</span>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '6px' }}>{period.updated_at}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialPeriodDetails;


