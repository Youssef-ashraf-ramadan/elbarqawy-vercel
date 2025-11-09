import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getFinancialPeriods,
  deleteFinancialPeriod,
  closeFinancialPeriod,
  clearError,
  clearSuccess,
} from '../../../../redux/Slices/authSlice';
import { FaPlus, FaEye, FaEdit, FaTrash, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const FinancialPeriods = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { financialPeriods, financialPeriodsPagination, isLoading, error, success } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [periodToDelete, setPeriodToDelete] = useState(null);
  const [periodToClose, setPeriodToClose] = useState(null);

  const lastErrorRef = useRef({ message: null, time: 0 });
  const lastSuccessRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getFinancialPeriods({ page: currentPage, per_page: 15 }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (success) {
      const now = Date.now();
      const last = lastSuccessRef.current;
      if (!last.message || last.message !== success || now - last.time > 2000) {
        toast.success(success, { rtl: true });
        lastSuccessRef.current = { message: success, time: now };
      }
      dispatch(clearSuccess());
      dispatch(getFinancialPeriods({ page: currentPage, per_page: 15 }));
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

  const handleDelete = (period) => {
    setPeriodToDelete(period);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!periodToDelete) return;
    await dispatch(deleteFinancialPeriod(periodToDelete.id));
    setShowDeleteModal(false);
    setPeriodToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPeriodToDelete(null);
  };

  const handleClosePeriod = (period) => {
    setPeriodToClose(period);
    setShowCloseModal(true);
  };

  const confirmClose = async () => {
    if (!periodToClose) return;
    await dispatch(closeFinancialPeriod(periodToClose.id));
    setShowCloseModal(false);
    setPeriodToClose(null);
  };

  const cancelClose = () => {
    setShowCloseModal(false);
    setPeriodToClose(null);
  };

  const statusColors = {
    open: '#0d6efd',
    closed: '#dc3545',
    'soft closed': '#845ef7',
    pending: '#f59f00',
    default: '#6c757d',
  };

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

  const isClosable = (status) => {
    if (!status) return false;
    return status.toLowerCase() === 'open';
  };

  const pagination = financialPeriodsPagination || {
      current_page: currentPage,
      last_page: 1,
      per_page: 15,
      total: financialPeriods?.length || 0,
    };

  if (isLoading && (!financialPeriods || financialPeriods.length === 0)) {
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '15px',
        }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>الفترات المالية</h1>
        <button
          onClick={() => navigate('/financial-periods/add')}
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
            gap: '8px',
          }}
        >
          <FaPlus /> إضافة فترة مالية
        </button>
      </div>

      {financialPeriods && financialPeriods.length > 0 ? (
        <div
          style={{
            backgroundColor: '#202938',
            border: '1px solid #333',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
                minWidth: '1000px',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#AC2000' }}>
                  {[
                    { label: '#', width: '60px' },
                    { label: 'اسم الفترة', width: '220px' },
                    { label: 'تاريخ البداية', width: '160px' },
                    { label: 'تاريخ النهاية', width: '160px' },
                    { label: 'الحالة', width: '140px' },
                    { label: 'أنشئت بواسطة', width: '180px' },
                    { label: 'تاريخ الإنشاء', width: '180px' },
                    { label: 'الإجراءات', width: '240px' },
                  ].map((col) => (
                    <th
                      key={col.label}
                      style={{
                        padding: '18px 16px',
                        textAlign: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        width: col.width,
                        minWidth: col.width,
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {financialPeriods.map((period, index) => (
                  <tr
                    key={period.id}
                    style={{
                      borderBottom: '1px solid #333',
                      backgroundColor: index % 2 === 0 ? '#202938' : '#1a1f2e',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(ev) => {
                      const row = ev.target.closest('tr');
                      if (row) row.style.backgroundColor = '#2a3441';
                    }}
                    onMouseLeave={(ev) => {
                      const row = ev.target.closest('tr');
                      if (row) row.style.backgroundColor = index % 2 === 0 ? '#202938' : '#1a1f2e';
                    }}
                  >
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                      {(pagination.current_page - 1) * (pagination.per_page || 15) + index + 1}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                      {period.name || '-'}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                      {period.start_date || '-'}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                      {period.end_date || '-'}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                      {renderStatusBadge(period.status)}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                      {period.created_by || '-'}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                      {period.created_at || '-'}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          title="عرض"
                          onClick={() => navigate(`/financial-periods/view/${period.id}`)}
                          style={{
                            backgroundColor: '#666',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <FaEye />
                        </button>
                        <button
                          title="تعديل"
                          onClick={() => navigate(`/financial-periods/edit/${period.id}`)}
                          style={{
                            backgroundColor: '#0bb564',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          title="إغلاق الفترة"
                          onClick={() => handleClosePeriod(period)}
                          disabled={!isClosable(period.status)}
                          style={{
                            backgroundColor: isClosable(period.status) ? '#845ef7' : '#555',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            cursor: isClosable(period.status) ? 'pointer' : 'not-allowed',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            opacity: isClosable(period.status) ? 1 : 0.6,
                          }}
                        >
                          <FaLock />
                        </button>
                        <button
                          title="حذف"
                          onClick={() => handleDelete(period)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.last_page > 1 && (
            <div
              style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                borderTop: '1px solid #333',
              }}
            >
              {pagination.current_page > 1 && (
                <button
                  onClick={() => setCurrentPage(pagination.current_page - 1)}
                  style={{
                    backgroundColor: '#202938',
                    color: 'white',
                    border: '1px solid #333',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  &lt;&lt;
                </button>
              )}

              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    backgroundColor: page === pagination.current_page ? '#AC2000' : '#202938',
                    color: 'white',
                    border: page === pagination.current_page ? 'none' : '1px solid #333',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: page === pagination.current_page ? 'bold' : 'normal',
                  }}
                >
                  {page}
                </button>
              ))}

              {pagination.current_page < pagination.last_page && (
                <button
                  onClick={() => setCurrentPage(pagination.current_page + 1)}
                  style={{
                    backgroundColor: '#202938',
                    color: 'white',
                    border: '1px solid #333',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  &gt;&gt;
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
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
          لا توجد فترات مالية حتى الآن.
        </div>
      )}

      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: '#1f2937',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '420px',
            }}
          >
            <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '18px' }}>تأكيد الحذف</h3>
            <p style={{ color: '#ccc', marginBottom: '8px', fontSize: '14px' }}>
              هل أنت متأكد من حذف الفترة المالية {periodToDelete?.name}؟
            </p>
            <p style={{ color: '#ef4444', marginBottom: '20px', fontSize: '12px' }}>لا يمكن التراجع عن هذا الإجراء.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={cancelDelete}
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
                onClick={confirmDelete}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                }}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {showCloseModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: '#1f2937',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '420px',
            }}
          >
            <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '18px' }}>إقفال الفترة المالية</h3>
            <p style={{ color: '#ccc', marginBottom: '8px', fontSize: '14px' }}>
              هل أنت متأكد من إقفال الفترة المالية {periodToClose?.name}؟
            </p>
            <p style={{ color: '#f59f00', marginBottom: '20px', fontSize: '12px' }}>
              بعد الإقفال لن تتمكن من تسجيل معاملات جديدة داخل هذه الفترة.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={cancelClose}
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
                onClick={confirmClose}
                style={{
                  backgroundColor: '#845ef7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                }}
              >
                إقفال
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialPeriods;


