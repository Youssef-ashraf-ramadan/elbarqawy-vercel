import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrencies, deleteCurrency, toggleCurrencyStatus, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaPlus, FaEdit, FaTrash, FaEye, FaPowerOff } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Currencies = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currencies, currenciesPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState(null);
  const lastErrorRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getCurrencies({ page: currentPage, per_page: 10 }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      dispatch(getCurrencies({ page: currentPage, per_page: 10 }));
    }
  }, [success, dispatch, currentPage]);

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

  const handleDelete = (currency) => {
    setCurrencyToDelete(currency);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (currencyToDelete) {
      await dispatch(deleteCurrency(currencyToDelete.id));
      setShowDeleteModal(false);
      setCurrencyToDelete(null);
    }
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleCurrencyStatus(id));
  };

  if (isLoading && (!currencies || currencies.length === 0)) {
    return (
      <div style={{ 
        padding: '30px', 
        backgroundColor: '#121828', 
        minHeight: 'calc(100vh - 80px)', 
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        جاري التحميل...
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '30px',
      backgroundColor: '#121828',
      minHeight: 'calc(100vh - 80px)',
      color: 'white'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>العملات</h1>
        <button
          onClick={() => navigate('/currencies/add')}
          style={{
            backgroundColor: '#AC2000',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaPlus /> إضافة عملة
        </button>
      </div>

      <div style={{
        backgroundColor: '#202938',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #333'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'separate',
            borderSpacing: 0
          }}>
            <thead>
              <tr style={{ backgroundColor: '#AC2000' }}>
                {[
                  { label: '#', width: '80px' },
                  { label: 'الاسم', width: '200px' },
                  { label: 'الكود', width: '120px' },
                  { label: 'الرمز', width: '120px' },
                  { label: 'الحالة', width: '120px' },
                  { label: 'العملة الأساسية', width: '150px' },
                  { label: 'الإجراءات', width: '220px' }
                ].map((h) => (
                  <th 
                    key={h.label} 
                    style={{ 
                      padding: '18px 16px', 
                      color: 'white', 
                      borderBottom: '2px solid #333', 
                      fontSize: '14px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      width: h.width,
                      minWidth: h.width,
                      backgroundColor: '#AC2000'
                    }}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(currencies || []).length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '16px' }}>
                    لا توجد عملات متاحة
                  </td>
                </tr>
              ) : (
                (currencies || []).map((currency, idx) => (
                  <tr 
                    key={currency.id} 
                    style={{ 
                      borderBottom: '1px solid #333',
                      backgroundColor: idx % 2 === 0 ? '#202938' : '#1a1f2e',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(ev) => ev.target.closest('tr').style.backgroundColor = '#2a3441'}
                    onMouseLeave={(ev) => ev.target.closest('tr').style.backgroundColor = idx % 2 === 0 ? '#202938' : '#1a1f2e'}
                  >
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                      {(currenciesPagination?.current_page - 1) * (currenciesPagination?.per_page || 10) + idx + 1}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                      {currency.name || '-'}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                      {currency.code || '-'}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                      {currency.symbol || '-'}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                      <span style={{ 
                        backgroundColor: currency.is_active ? '#AC2000' : '#dc3545', 
                        color: 'white', 
                        padding: '6px 14px', 
                        borderRadius: '20px', 
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}>
                        {currency.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                      <span style={{ 
                        backgroundColor: currency.is_base_currency ? '#007bff' : '#666', 
                        color: 'white', 
                        padding: '6px 14px', 
                        borderRadius: '20px', 
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}>
                        {currency.is_base_currency ? 'نعم' : 'لا'}
                      </span>
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
                        <button 
                          title="عرض" 
                          onClick={() => navigate(`/currencies/view/${currency.id}`)} 
                          style={{ 
                            backgroundColor: '#666', 
                            color: 'white', 
                            border: 'none', 
                            padding: '10px 12px', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(ev) => { ev.target.style.backgroundColor = '#777'; ev.target.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={(ev) => { ev.target.style.backgroundColor = '#666'; ev.target.style.transform = 'scale(1)'; }}
                        >
                          <FaEye />
                        </button>
                        <button 
                          title="تعديل" 
                          onClick={() => navigate(`/currencies/edit/${currency.id}`)} 
                          style={{ 
                            backgroundColor: '#AC2000', 
                            color: 'white', 
                            border: 'none', 
                            padding: '10px 12px', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(ev) => { ev.target.style.backgroundColor = '#0bb564'; ev.target.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={(ev) => { ev.target.style.backgroundColor = '#AC2000'; ev.target.style.transform = 'scale(1)'; }}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          title="تفعيل/تعطيل" 
                          onClick={() => handleToggleStatus(currency.id)} 
                          style={{ 
                            backgroundColor: '#ffc107', 
                            color: 'white', 
                            border: 'none', 
                            padding: '10px 12px', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(ev) => { ev.target.style.backgroundColor = '#e0a800'; ev.target.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={(ev) => { ev.target.style.backgroundColor = '#ffc107'; ev.target.style.transform = 'scale(1)'; }}
                        >
                          <FaPowerOff />
                        </button>
                        <button 
                          title="حذف" 
                          onClick={() => handleDelete(currency)} 
                          style={{ 
                            backgroundColor: '#dc3545', 
                            color: 'white', 
                            border: 'none', 
                            padding: '10px 12px', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(ev) => { ev.target.style.backgroundColor = '#bb2d3b'; ev.target.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={(ev) => { ev.target.style.backgroundColor = '#dc3545'; ev.target.style.transform = 'scale(1)'; }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {currenciesPagination && (currencies && currencies.length > 0) && currenciesPagination.last_page > 1 && (
          <div style={{ padding: '16px', borderTop: '1px solid #333', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {Array.from({ length: currenciesPagination.last_page }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)} style={{ backgroundColor: p === currenciesPagination.current_page ? '#AC2000' : '#202938', color: 'white', border: p === currenciesPagination.current_page ? 'none' : '1px solid #333', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          position: 'fixed',
          inset: 0,
          zIndex: 999999
        }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{
              backgroundColor: '#202938',
              border: '1px solid #333',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}>
              <div className="modal-header" style={{ border: 'none', borderBottom: '1px solid #333', width: '100%', textAlign: 'center', display: 'block' }}>
                <h5 className="modal-title text-white">تأكيد الحذف</h5>
              </div>
              <div className="modal-body text-white" style={{ textAlign: 'center' }}>
                <p>هل أنت متأكد من حذف العملة "{currencyToDelete?.name}"؟</p>
                <p style={{ color: '#dc3545', fontSize: '13px' }}>هذا الإجراء لا يمكن التراجع عنه.</p>
              </div>
              <div className="modal-footer" style={{ border: 'none', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    backgroundColor: '#666',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 20px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  style={{
                    backgroundColor: '#dc3545',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 20px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Currencies;

