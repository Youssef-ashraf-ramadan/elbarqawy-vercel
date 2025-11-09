import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSafes, deleteSafe, toggleSafeStatus, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaPlus, FaEdit, FaTrash, FaEye, FaPowerOff, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Safes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { safes, safesPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [safeToDelete, setSafeToDelete] = useState(null);
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
    dispatch(getSafes(params));
  }, [dispatch, currentPage, searchTerm, isActiveFilter]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      dispatch(getSafes({ page: currentPage, per_page: 10, search: searchTerm || undefined, is_active: isActiveFilter !== '' ? isActiveFilter : undefined }));
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
    setCurrentPage(1);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      // Search will be triggered by useEffect
    }, 500);
  };

  const handleFilterChange = (e) => {
    setIsActiveFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (safe) => {
    setSafeToDelete(safe);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (safeToDelete) {
      await dispatch(deleteSafe(safeToDelete.id));
      setShowDeleteModal(false);
      setSafeToDelete(null);
    }
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleSafeStatus(id));
  };

  if (isLoading && (!safes || safes.length === 0)) {
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
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>الخزائن</h1>
        <button
          onClick={() => navigate('/safes/add')}
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
          <FaPlus /> إضافة خزنة
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
            placeholder="بحث بالاسم..."
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

      {safes && safes.length > 0 ? (
        <>
          <div style={{ 
            backgroundColor: '#202938', 
            border: '1px solid #333', 
            borderRadius: '12px', 
            overflow: 'hidden' 
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'separate', 
                borderSpacing: 0,
                minWidth: '800px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#AC2000' }}>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '60px' }}>#</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '250px' }}>الاسم</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '100px' }}>الحالة</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '200px' }}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {safes.map((safe, index) => (
                    <tr 
                      key={safe.id} 
                      style={{ 
                        borderBottom: '1px solid #333',
                        backgroundColor: index % 2 === 0 ? '#202938' : '#1a1f2e',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(ev) => ev.target.closest('tr').style.backgroundColor = '#2a3441'}
                      onMouseLeave={(ev) => ev.target.closest('tr').style.backgroundColor = index % 2 === 0 ? '#202938' : '#1a1f2e'}
                    >
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                        {(safesPagination?.current_page - 1) * (safesPagination?.per_page || 10) + index + 1}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>{safe.name_ar || safe.name}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                        <span style={{
                          backgroundColor: safe.is_active ? '#AC2000' : '#dc3545',
                          color: 'white',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          display: 'inline-block'
                        }}>
                          {safe.is_active ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => navigate(`/safes/view/${safe.id}`)}
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
                              gap: '4px'
                            }}
                            title="عرض"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => navigate(`/safes/edit/${safe.id}`)}
                            style={{
                              backgroundColor: '#B3B3B3',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="تعديل"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(safe.id)}
                            style={{
                              backgroundColor: safe.is_active ? '#F6630d' : '#AC2000',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title={safe.is_active ? 'تعطيل' : 'تفعيل'}
                          >
                            <FaPowerOff />
                          </button>
                          <button
                            onClick={() => handleDelete(safe)}
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
                              gap: '4px'
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
            {safesPagination && safesPagination.last_page > 1 && (
              <div style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                borderTop: '1px solid #333'
              }}>
                {safesPagination.current_page > 1 && (
                  <button 
                    onClick={() => setCurrentPage(safesPagination.current_page - 1)}
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

                {Array.from({ length: safesPagination.last_page }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      backgroundColor: page === safesPagination.current_page ? '#AC2000' : '#202938',
                      color: 'white',
                      border: page === safesPagination.current_page ? 'none' : '1px solid #333',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: page === safesPagination.current_page ? 'bold' : 'normal'
                    }}
                  >
                    {page}
                  </button>
                ))}

                {safesPagination.current_page < safesPagination.last_page && (
                  <button 
                    onClick={() => setCurrentPage(safesPagination.current_page + 1)}
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
          </div>
        </>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#888',
          backgroundColor: '#202938',
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          لا توجد خزائن
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
              هل أنت متأكد من حذف الخزنة "{safeToDelete?.name_ar || safeToDelete?.name}"؟
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSafeToDelete(null);
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

export default Safes;

