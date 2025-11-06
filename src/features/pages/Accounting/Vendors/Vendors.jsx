import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getVendors, deleteVendor, toggleVendorStatus, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaPlus, FaEdit, FaTrash, FaEye, FaPowerOff } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Vendors = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { vendors, vendorsPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const lastErrorRef = useRef({ message: null, time: 0 });
  const shouldNavigateToLastPageRef = useRef(false);

  useEffect(() => {
    dispatch(getVendors({ page: currentPage, per_page: 10 }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      // التحقق إذا كانت الرسالة تتعلق بإضافة مورد جديد
      if (success.includes('إضافة') || success.includes('تم إضافة')) {
        shouldNavigateToLastPageRef.current = true;
      }
      dispatch(clearSuccess());
      // إعادة جلب البيانات للحصول على آخر pagination
      dispatch(getVendors({ page: 1, per_page: 10 }));
    }
  }, [success, dispatch]);

  // عند تحديث vendorsPagination بعد إضافة مورد جديد، انتقل إلى آخر صفحة
  useEffect(() => {
    if (vendorsPagination && vendorsPagination.last_page > 0 && shouldNavigateToLastPageRef.current) {
      const lastPage = vendorsPagination.last_page;
      if (currentPage !== lastPage) {
        setCurrentPage(lastPage);
      }
      shouldNavigateToLastPageRef.current = false; // إعادة تعيين الـ flag
    }
  }, [vendorsPagination, currentPage]);

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

  const handleDelete = (vendor) => {
    setVendorToDelete(vendor);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (vendorToDelete) {
      await dispatch(deleteVendor(vendorToDelete.id));
      setShowDeleteModal(false);
      setVendorToDelete(null);
    }
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleVendorStatus(id));
  };

  const renderPagination = () => {
    if (!vendorsPagination) return null;
    
    const { current_page, last_page } = vendorsPagination;
    const pages = [];
    
    for (let i = 1; i <= last_page; i++) {
      if (
        i === 1 ||
        i === last_page ||
        (i >= current_page - 2 && i <= current_page + 2)
      ) {
        pages.push(i);
      } else if (i === current_page - 3 || i === current_page + 3) {
        pages.push('...');
      }
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
        <button
          onClick={() => setCurrentPage(current_page - 1)}
          disabled={current_page === 1}
          style={{
            padding: '8px 12px',
            backgroundColor: current_page === 1 ? '#333' : '#AC2000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: current_page === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          السابق
        </button>
        {pages.map((page, idx) => (
          page === '...' ? (
            <span key={`ellipsis-${idx}`} style={{ padding: '8px', color: 'white' }}>...</span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: '8px 12px',
                backgroundColor: page === current_page ? '#AC2000' : '#1a1f2e',
                color: 'white',
                border: '1px solid #333',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {page}
            </button>
          )
        ))}
        <button
          onClick={() => setCurrentPage(current_page + 1)}
          disabled={current_page === last_page}
          style={{
            padding: '8px 12px',
            backgroundColor: current_page === last_page ? '#333' : '#AC2000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: current_page === last_page ? 'not-allowed' : 'pointer'
          }}
        >
          التالي
        </button>
      </div>
    );
  };

  if (isLoading && (!vendors || vendors.length === 0)) {
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
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>الموردون</h1>
        <button
          onClick={() => navigate('/vendors/add')}
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
          <FaPlus /> إضافة مورد
        </button>
      </div>

      {vendors && vendors.length > 0 ? (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'separate', 
              borderSpacing: 0,
              backgroundColor: '#1a1f2e',
              borderRadius: '8px',
              overflow: 'hidden',
              minWidth: '1200px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#AC2000' }}>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '6%' }}>ID</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '12%' }}>الكود</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '15%' }}>الاسم</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '18%', minWidth: '180px' }}>الشخص المسؤول</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '15%' }}>البريد الإلكتروني</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '12%' }}>الهاتف</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '8%' }}>الحالة</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '14%' }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor, index) => (
                  <tr key={vendor.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px' }}>
                      {(vendorsPagination?.current_page - 1) * (vendorsPagination?.per_page || 10) + index + 1}
                    </td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px' }}>{vendor.code}</td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px' }}>{vendor.name}</td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px' }}>{vendor.contact_person || 'N/A'}</td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px' }}>{vendor.email || 'N/A'}</td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px' }}>{vendor.phone || 'N/A'}</td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px' }}>
                      <span style={{
                        backgroundColor: vendor.is_active ? '#AC2000' : '#dc3545',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        display: 'inline-block'
                      }}>
                        {vendor.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => navigate(`/vendors/view/${vendor.id}`)}
                          style={{
                            backgroundColor: '#AC2000',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <FaEye /> عرض
                        </button>
                        <button
                          onClick={() => navigate(`/vendors/edit/${vendor.id}`)}
                          style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <FaEdit /> تعديل
                        </button>
                        <button
                          onClick={() => handleToggleStatus(vendor.id)}
                          style={{
                            backgroundColor: vendor.is_active ? '#f59e0b' : '#AC2000',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <FaPowerOff /> {vendor.is_active ? 'تعطيل' : 'تفعيل'}
                        </button>
                        <button
                          onClick={() => handleDelete(vendor)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <FaTrash /> حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#888',
          backgroundColor: '#1a1f2e',
          borderRadius: '8px'
        }}>
          لا توجد موردين
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999999
        }}>
          <div style={{
            backgroundColor: '#1a1f2e',
            padding: '30px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '400px',
            border: '1px solid #333'
          }}>
            <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '20px' }}>تأكيد الحذف</h2>
            <p style={{ color: '#ccc', marginBottom: '30px' }}>
              هل أنت متأكد من حذف المورد "{vendorToDelete?.name}"؟
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setVendorToDelete(null);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
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

export default Vendors;

