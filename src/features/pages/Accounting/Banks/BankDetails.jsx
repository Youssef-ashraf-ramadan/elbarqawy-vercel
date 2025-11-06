import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getBankDetails, clearBankDetails } from '../../../../redux/Slices/authSlice';
import { FaArrowRight, FaEdit } from 'react-icons/fa';

const BankDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { bankDetails, isLoading } = useSelector((s) => s.auth);

  useEffect(() => {
    if (id) {
      dispatch(getBankDetails(id));
    }
    return () => {
      dispatch(clearBankDetails());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        جاري التحميل...
      </div>
    );
  }

  if (!bankDetails) {
    return (
      <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white' }}>
        <button onClick={() => navigate('/banks')} style={{ background: '#666', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', marginBottom: '12px' }}>رجوع</button>
        <p>لا توجد بيانات</p>
      </div>
    );
  }

  const bank = bankDetails.data || bankDetails;

  return (
    <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/banks')} style={{ background: '#666', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaArrowRight /> الرجوع
        </button>
        <button
          onClick={() => navigate(`/banks/edit/${id}`)}
          style={{
            backgroundColor: '#B3B3B3',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaEdit /> تعديل البنك
        </button>
      </div>
      
      <div style={{ backgroundColor: '#202938', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #333', backgroundColor: '#1a1f2e' }}>
          <strong style={{ fontSize: '18px', color: 'white' }}>تفاصيل البنك #{bank.id}</strong>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>ID</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>{bank.id || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>الاسم بالإنجليزية</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>{bank.name_en || bank.name || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>الاسم بالعربية</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>{bank.name_ar || bank.name || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>رقم الحساب</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>{bank.account_number || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>IBAN</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>{bank.iban || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>SWIFT Code</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>{bank.swift_code || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>الحالة</div>
              <span style={{
                backgroundColor: bank.is_active ? '#AC2000' : '#dc3545',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                {bank.is_active ? 'نشط' : 'غير نشط'}
              </span>
            </div>
            {bank.notes && (
              <div style={{ gridColumn: '1 / span 2' }}>
                <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>ملاحظات</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>{bank.notes}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;

