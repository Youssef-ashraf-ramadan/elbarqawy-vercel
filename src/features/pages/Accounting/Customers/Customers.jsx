import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCustomers, deleteCustomer, toggleCustomerStatus, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaPlus, FaEdit, FaTrash, FaEye, FaPowerOff, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Customers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customers, customersPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const lastErrorRef = useRef({ message: null, time: 0 });
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const params = {
      page: currentPage,
      per_page: 10
    };
    if (searchTerm) {
      params.search = searchTerm;
    }
    if (isActiveFilter !== '') {
      params.is_active = isActiveFilter;
    }
    dispatch(getCustomers(params));
  }, [dispatch, currentPage, searchTerm, isActiveFilter]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      dispatch(getCustomers({ page: currentPage, per_page: 10, search: searchTerm || undefined, is_active: isActiveFilter !== '' ? isActiveFilter : undefined }));
    }
  }, [success, dispatch, currentPage, searchTerm, isActiveFilter]);

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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
    
    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      // Search will be triggered by useEffect
    }, 500);
  };

  const handleFilterChange = (e) => {
    setIsActiveFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      await dispatch(deleteCustomer(customerToDelete.id));
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    }
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleCustomerStatus(id));
  };

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
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>العملاء</h1>
        <button
          onClick={() => navigate('/customers/add')}
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
          <FaPlus /> إضافة عميل
        </button>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
          <FaSearch style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#666',
            fontSize: '16px'
          }} />
          <input
            type="text"
            placeholder="بحث بالاسم، الكود، البريد الإلكتروني..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '12px 45px 12px 15px',
              backgroundColor: '#202938',
              border: '1px solid #333',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px'
            }}
          />
        </div>
        <select
          value={isActiveFilter}
          onChange={handleFilterChange}
          style={{
            padding: '12px 15px',
            backgroundColor: '#202938',
            border: '1px solid #333',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            minWidth: '150px',
            cursor: 'pointer'
          }}
        >
          <option value="">جميع الحالات</option>
          <option value="1">نشط</option>
          <option value="0">غير نشط</option>
        </select>
      </div>

      <div style={{ 
        backgroundColor: '#202938', 
        border: '1px solid #333', 
        borderRadius: '12px', 
        overflow: 'hidden',
        position: 'relative'
      }}>
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(18, 24, 40, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            borderRadius: '12px'
          }}>
            <div style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              جاري التحميل...
            </div>
          </div>
        )}
        {customers && customers.length > 0 ? (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'separate', 
                borderSpacing: 0,
                minWidth: '1400px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#AC2000' }}>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '60px' }}>#</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '140px' }}>الكود</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '200px' }}>الاسم</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '180px' }}>الشخص المسؤول</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '200px' }}>البريد الإلكتروني</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '140px' }}>الهاتف</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '180px' }}>حد الائتمان</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '100px' }}>الحالة</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '200px' }}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <tr 
                      key={customer.id} 
                      style={{ 
                        borderBottom: '1px solid #333',
                        backgroundColor: index % 2 === 0 ? '#202938' : '#1a1f2e',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(ev) => ev.target.closest('tr').style.backgroundColor = '#2a3441'}
                      onMouseLeave={(ev) => ev.target.closest('tr').style.backgroundColor = index % 2 === 0 ? '#202938' : '#1a1f2e'}
                    >
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                        {(customersPagination?.current_page - 1) * (customersPagination?.per_page || 10) + index + 1}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>{customer.code}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>{customer.name_ar || customer.name}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>{customer.contact_person || '-'}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>{customer.email || '-'}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>{customer.phone || '-'}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                        {customer.credit_limit ? customer.credit_limit.toLocaleString('ar-EG') : '-'}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                        <span style={{
                          backgroundColor: customer.is_active ? '#AC2000' : '#dc3545',
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          display: 'inline-block',
                          whiteSpace: 'nowrap'
                        }}>
                          {customer.is_active ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'nowrap' }}>
                          <button
                            onClick={() => navigate(`/customers/view/${customer.id}`)}
                            style={{
                              backgroundColor: '#666',
                              color: 'white',
                              border: 'none',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: '36px',
                              height: '36px'
                            }}
                            title="عرض"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => navigate(`/customers/edit/${customer.id}`)}
                            style={{
                              backgroundColor: '#B3B3B3',
                              color: 'white',
                              border: 'none',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: '36px',
                              height: '36px'
                            }}
                            title="تعديل"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(customer.id)}
                            style={{
                              backgroundColor: customer.is_active ? '#F6630d' : '#AC2000',
                              color: 'white',
                              border: 'none',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '36px',
                              height: '36px',
                              flexShrink: 0
                            }}
                            title={customer.is_active ? 'تعطيل' : 'تفعيل'}
                          >
                            <FaPowerOff style={{ fontSize: '14px' }} />
                          </button>
                          <button
                            onClick={() => handleDelete(customer)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: '36px',
                              height: '36px'
                            }}
                            title="حذف"
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

            {/* Pagination */}
            {customersPagination && customersPagination.last_page > 1 && (
              <div style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                borderTop: '1px solid #333'
              }}>
                {/* Previous Button */}
                {customersPagination.current_page > 1 && (
                  <button 
                    onClick={() => setCurrentPage(customersPagination.current_page - 1)}
                    style={{
                      backgroundColor: '#202938',
                      color: 'white',
                      border: '1px solid #333',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    &lt;&lt;
                  </button>
                )}

                {/* Page Numbers */}
                {Array.from({ length: customersPagination.last_page }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      backgroundColor: page === customersPagination.current_page ? '#AC2000' : '#202938',
                      color: 'white',
                      border: page === customersPagination.current_page ? 'none' : '1px solid #333',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: page === customersPagination.current_page ? 'bold' : 'normal'
                    }}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                {customersPagination.current_page < customersPagination.last_page && (
                  <button 
                    onClick={() => setCurrentPage(customersPagination.current_page + 1)}
                    style={{
                      backgroundColor: '#202938',
                      color: 'white',
                      border: '1px solid #333',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    &gt;&gt;
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#888',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isLoading ? 'جاري التحميل...' : 'لا توجد عملاء'}
          </div>
        )}
      </div>

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
              هل أنت متأكد من حذف العميل "{customerToDelete?.name_ar || customerToDelete?.name}"؟
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCustomerToDelete(null);
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

export default Customers;

