import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrencyDetails } from '../../../../redux/Slices/authSlice';

const CurrencyDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currencyDetails, isLoading } = useSelector((s) => s.auth);

  useEffect(() => {
    if (id) dispatch(getCurrencyDetails(id));
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        جاري التحميل...
      </div>
    );
  }

  if (!currencyDetails) {
    return (
      <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white' }}>
        <button onClick={() => navigate('/currencies')} style={{ background: '#666', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', marginBottom: '12px' }}>رجوع</button>
        <p>لا توجد بيانات</p>
      </div>
    );
  }

  const c = currencyDetails.data || currencyDetails;

  return (
    <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white' }}>
      <button onClick={() => navigate('/currencies')} style={{ background: '#666', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', marginBottom: '12px' }}>رجوع</button>
      <div style={{ backgroundColor: '#202938', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #333', backgroundColor: '#1a1f2e' }}>
          <strong style={{ fontSize: '18px' }}>تفاصيل العملة #{c.id}</strong>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>الاسم بالإنجليزية</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{c.name_en || c.name || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>الاسم بالعربية</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{c.name_ar || c.name || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>الكود</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{c.code || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>الرمز</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{c.symbol || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>الحالة</div>
              <span style={{
                backgroundColor: c.is_active ? '#AC2000' : '#dc3545',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                {c.is_active ? 'نشط' : 'غير نشط'}
              </span>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>العملة الأساسية</div>
              <span style={{
                backgroundColor: c.is_base_currency ? '#007bff' : '#666',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                {c.is_base_currency ? 'نعم' : 'لا'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyDetails;

