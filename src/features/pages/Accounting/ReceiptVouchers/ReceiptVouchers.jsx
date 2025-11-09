import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEye, FaPaperPlane, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  getReceiptVouchers,
  postReceiptVoucher,
  deleteReceiptVoucher,
  clearError,
  clearSuccess,
} from '../../../../redux/Slices/authSlice';

const ReceiptVouchers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    receiptVouchers,
    receiptVouchersPagination,
    isLoading,
    error,
    success,
  } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  const lastErrorRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getReceiptVouchers({ page: currentPage, per_page: 10 }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      dispatch(getReceiptVouchers({ page: currentPage, per_page: 10 }));
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

  const openDeleteModal = (voucher) => {
    setVoucherToDelete(voucher);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setVoucherToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = () => {
    if (!voucherToDelete) return;
    dispatch(deleteReceiptVoucher(voucherToDelete.id));
    closeDeleteModal();
  };

  const handlePost = (id) => {
    dispatch(postReceiptVoucher(id));
  };

  const statusLabel = (status) => {
    switch (status) {
      case 'posted':
        return 'مرحل';
      case 'draft':
        return 'مسودة';
      default:
        return status || '-';
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'posted':
        return '#AC2000';
      case 'draft':
        return '#666';
      default:
        return '#0d6efd';
    }
  };

  const renderPagination = () => {
    if (!receiptVouchersPagination || (receiptVouchers || []).length === 0) {
      return null;
    }

    const current = receiptVouchersPagination.current_page || 1;
    const last = receiptVouchersPagination.last_page || 1;

    return (
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
        {current > 1 && (
          <button
            onClick={() => setCurrentPage(current - 1)}
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
        {Array.from({ length: last }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              backgroundColor: page === current ? '#AC2000' : '#202938',
              color: 'white',
              border: page === current ? 'none' : '1px solid #333',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: page === current ? 'bold' : 'normal',
            }}
          >
            {page}
          </button>
        ))}
        {current < last && (
          <button
            onClick={() => setCurrentPage(current + 1)}
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
    );
  };

  if (isLoading && (!receiptVouchers || receiptVouchers.length === 0)) {
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
    <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '20px', margin: 0 }}>إيصال استلام نقدية</h1>
        <button
          onClick={() => navigate('/receipt-vouchers/add')}
          style={{
            backgroundColor: '#AC2000',
            border: 'none',
            color: 'white',
            padding: '10px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <FaPlus /> إضافة إيصال
        </button>
      </div>

      <div style={{ backgroundColor: '#202938', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ backgroundColor: '#AC2000' }}>
                {[
                  { label: '#', width: '60px' },
                  { label: 'التاريخ', width: '120px' },
                  { label: 'المرجع', width: '150px' },
                  { label: 'الحساب', width: '220px' },
                  { label: 'القيمة', width: '140px' },
                  { label: 'الحالة', width: '120px' },
                  { label: 'المنشئ', width: '140px' },
                  { label: 'تاريخ الترحيل', width: '160px' },
                  { label: 'الإجراءات', width: '220px' },
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
                      backgroundColor: '#AC2000',
                    }}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(receiptVouchers || []).length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    style={{
                      padding: '40px',
                      textAlign: 'center',
                      color: '#9ca3af',
                      fontSize: '16px',
                    }}
                  >
                    لا توجد إيصالات متاحة
                  </td>
                </tr>
              ) : (
                (receiptVouchers || []).map((voucher, idx) => {
                  const isDraft = voucher.status === 'draft';
                  const isPosted = voucher.status === 'posted';
                  const totalAmount = Number(voucher.total_amount || 0);
                  const paginationMeta = receiptVouchersPagination || {};
                  const baseIndex = ((paginationMeta.current_page || 1) - 1) * (paginationMeta.per_page || 10);

                  return (
                    <tr
                      key={voucher.id}
                      style={{
                        borderBottom: '1px solid #333',
                        backgroundColor: idx % 2 === 0 ? '#202938' : '#1a1f2e',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(ev) => {
                        const row = ev.target.closest('tr');
                        if (row) row.style.backgroundColor = '#2a3441';
                      }}
                      onMouseLeave={(ev) => {
                        const row = ev.target.closest('tr');
                        if (row) row.style.backgroundColor = idx % 2 === 0 ? '#202938' : '#1a1f2e';
                      }}
                    >
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                        {baseIndex + idx + 1}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                        {voucher.voucher_date || '-'}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                        {voucher.reference || '-'}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                        {voucher.account
                          ? `${voucher.account.code ? `${voucher.account.code} - ` : ''}${voucher.account.name_ar || voucher.account.name || ''}`
                          : '-'}
                      </td>
                      <td
                        style={{
                          padding: '18px 16px',
                          textAlign: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {totalAmount.toLocaleString('ar-EG', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                        <span
                          style={{
                            backgroundColor: statusColor(voucher.status),
                            color: 'white',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            display: 'inline-block',
                          }}
                        >
                          {statusLabel(voucher.status)}
                        </span>
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                        {voucher.created_by || voucher.creator || '-'}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                        {voucher.posted_at || '-'}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'nowrap',
                          }}
                        >
                          <button
                            title="عرض"
                            onClick={() => navigate(`/receipt-vouchers/view/${voucher.id}`)}
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
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(ev) => {
                              ev.target.style.backgroundColor = '#777';
                              ev.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(ev) => {
                              ev.target.style.backgroundColor = '#666';
                              ev.target.style.transform = 'scale(1)';
                            }}
                          >
                            <FaEye />
                          </button>
                          {isDraft && (
                            <button
                              title="ترحيل"
                              onClick={() => handlePost(voucher.id)}
                              style={{
                                backgroundColor: '#845ef7',
                                color: 'white',
                                border: 'none',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(ev) => {
                                ev.target.style.backgroundColor = '#7950f2';
                                ev.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(ev) => {
                                ev.target.style.backgroundColor = '#845ef7';
                                ev.target.style.transform = 'scale(1)';
                              }}
                            >
                              <FaPaperPlane />
                            </button>
                          )}
                          {isDraft && (
                            <button
                              title="حذف"
                              onClick={() => openDeleteModal(voucher)}
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
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(ev) => {
                                ev.target.style.backgroundColor = '#bb2d3b';
                                ev.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(ev) => {
                                ev.target.style.backgroundColor = '#dc3545';
                                ev.target.style.transform = 'scale(1)';
                              }}
                            >
                              <FaTrash />
                            </button>
                          )}
                          {isPosted && (
                            <span style={{ fontSize: '12px', color: '#9ca3af' }}>تم ترحيله</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {renderPagination()}
      </div>

      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
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
              هل أنت متأكد من حذف هذا الإيصال؟
            </p>
            {voucherToDelete && (
              <div style={{ color: 'white', fontSize: '14px', marginBottom: '16px' }}>
                المرجع: {voucherToDelete.reference || '-'}
              </div>
            )}
            <p style={{ color: '#ef4444', marginBottom: '20px', fontSize: '12px' }}>هذا الإجراء لا يمكن التراجع عنه.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={closeDeleteModal}
                style={{ backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer' }}
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer' }}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptVouchers;

