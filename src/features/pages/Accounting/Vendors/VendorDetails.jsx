import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getVendorDetails, clearVendorDetails } from '../../../../redux/Slices/authSlice';

const VendorDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { vendorDetails, isLoading } = useSelector((s) => s.auth);

  useEffect(() => {
    if (id) {
      dispatch(getVendorDetails(id));
    }
    return () => {
      dispatch(clearVendorDetails());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        جاري التحميل...
      </div>
    );
  }

  if (!vendorDetails) {
    return (
      <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white' }}>
        <button onClick={() => navigate('/vendors')} style={{ background: '#666', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', marginBottom: '12px' }}>رجوع</button>
        <p>لا توجد بيانات</p>
      </div>
    );
  }

  const vendor = vendorDetails.data || vendorDetails;

  return (
    <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white' }}>
      <button onClick={() => navigate('/vendors')} style={{ background: '#666', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', marginBottom: '20px' }}>رجوع</button>
      <div style={{ backgroundColor: '#202938', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #333', backgroundColor: '#1a1f2e' }}>
          <strong style={{ fontSize: '18px' }}>تفاصيل المورد #{vendor.id}</strong>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>ID</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{vendor.id || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>الكود</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{vendor.code || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>الاسم بالإنجليزية</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{vendor.name_en || vendor.name || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>الاسم بالعربية</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{vendor.name_ar || vendor.name || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>الشخص المسؤول</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{vendor.contact_person || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>البريد الإلكتروني</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{vendor.email || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>الهاتف</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{vendor.phone || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>الرقم الضريبي</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{vendor.tax_number || '-'}</div>
            </div>
            <div style={{ gridColumn: '1 / span 2' }}>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>العنوان</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{vendor.address || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>الحالة</div>
              <span style={{
                backgroundColor: vendor.is_active ? '#AC2000' : '#dc3545',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                {vendor.is_active ? 'نشط' : 'غير نشط'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;

