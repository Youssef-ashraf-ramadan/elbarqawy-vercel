import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getExchangeRateDetails, getEffectiveExchangeRate, clearExchangeRateDetails, getCurrencies } from '../../../../redux/Slices/authSlice';

const ExchangeRateDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { exchangeRateDetails, effectiveExchangeRate, isLoading, currencies } = useSelector((s) => s.auth);
  const [showEffective, setShowEffective] = useState(false);
  const [effectiveParams, setEffectiveParams] = useState({
    currency_id: '',
    date: ''
  });

  useEffect(() => {
    if (id) {
      dispatch(getExchangeRateDetails(id));
    }
    dispatch(getCurrencies({ page: 1, per_page: 100 }));
    return () => {
      dispatch(clearExchangeRateDetails());
    };
  }, [dispatch, id]);

  const handleGetEffective = () => {
    if (effectiveParams.currency_id && effectiveParams.date) {
      dispatch(getEffectiveExchangeRate({
        currency_id: effectiveParams.currency_id,
        date: effectiveParams.date
      }));
      setShowEffective(true);
    }
  };

  if (isLoading && !exchangeRateDetails) {
    return (
      <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        جاري التحميل...
      </div>
    );
  }

  if (!exchangeRateDetails) {
    return (
      <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white' }}>
        <button onClick={() => navigate('/exchange-rates')} style={{ background: '#666', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', marginBottom: '12px' }}>رجوع</button>
        <p>لا توجد بيانات</p>
      </div>
    );
  }

  const rate = exchangeRateDetails.data || exchangeRateDetails;

  return (
    <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white' }}>
      <button onClick={() => navigate('/exchange-rates')} style={{ background: '#666', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', marginBottom: '20px' }}>رجوع</button>
      
      <div style={{ backgroundColor: '#202938', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #333', backgroundColor: '#1a1f2e' }}>
          <strong style={{ fontSize: '18px' }}>تفاصيل سعر الصرف #{rate.id}</strong>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>ID</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{rate.id || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>التاريخ</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{rate.date || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>سعر الصرف</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{rate.rate || '-'}</div>
            </div>
            {rate.currency && (
              <>
                <div>
                  <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>اسم العملة</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{rate.currency.name_ar || rate.currency.name || '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>كود العملة</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{rate.currency.code || '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>رمز العملة</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{rate.currency.symbol || '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>حالة العملة</div>
                  <span style={{
                    backgroundColor: rate.currency.is_active ? '#AC2000' : '#dc3545',
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'inline-block'
                  }}>
                    {rate.currency.is_active ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Effective Exchange Rate Section */}
      <div style={{ backgroundColor: '#202938', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #333', backgroundColor: '#1a1f2e' }}>
          <strong style={{ fontSize: '18px' }}>عرض السعر الفعلي</strong>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                العملة
              </label>
              <select
                value={effectiveParams.currency_id}
                onChange={(e) => setEffectiveParams(prev => ({ ...prev, currency_id: e.target.value }))}
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
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                التاريخ
              </label>
              <input
                type="date"
                value={effectiveParams.date}
                onChange={(e) => setEffectiveParams(prev => ({ ...prev, date: e.target.value }))}
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
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={handleGetEffective}
                disabled={!effectiveParams.currency_id || !effectiveParams.date}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: effectiveParams.currency_id && effectiveParams.date ? '#AC2000' : '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: effectiveParams.currency_id && effectiveParams.date ? 'pointer' : 'not-allowed',
                  opacity: effectiveParams.currency_id && effectiveParams.date ? 1 : 0.6
                }}
              >
                عرض السعر الفعلي
              </button>
            </div>
          </div>
          
          {showEffective && effectiveExchangeRate && (
            <div style={{ 
              marginTop: '20px', 
              padding: '16px', 
              backgroundColor: '#1a1f2e', 
              borderRadius: '8px',
              border: '1px solid #333'
            }}>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>السعر الفعلي</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#AC2000' }}>
                {effectiveExchangeRate.rate || effectiveExchangeRate.data?.rate || 'N/A'}
              </div>
              {effectiveExchangeRate.currency && (
                <div style={{ marginTop: '12px', fontSize: '14px', color: '#ccc' }}>
                  العملة: {effectiveExchangeRate.currency.name_ar || effectiveExchangeRate.currency.name || 'N/A'}
                </div>
              )}
              {effectiveExchangeRate.date && (
                <div style={{ marginTop: '8px', fontSize: '14px', color: '#ccc' }}>
                  التاريخ: {effectiveExchangeRate.date}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExchangeRateDetails;

