import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getWorkShifts, deleteWorkShift, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Shifts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { workShifts, isLoading, error, success } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState(null);

  // Fetch work shifts on component mount
  useEffect(() => {
    dispatch(getWorkShifts());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
    }
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [success, error, dispatch]);

  // Filter work shifts based on search term
  const filteredData = workShifts?.filter(shift => 
    shift.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status) => {
    return status === 'نشط' ? '#AC2000' : '#dc3545';
  };

  const handleAdd = () => {
    navigate('/shifts/add');
  };

  const handleEdit = (id) => {
    navigate(`/shifts/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/shifts/details/${id}`);
  };

  const handleDelete = (shift) => {
    setShiftToDelete(shift);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (shiftToDelete) {
      await dispatch(deleteWorkShift(shiftToDelete.id));
      setShowDeleteModal(false);
      setShiftToDelete(null);
    }
  };

  return (
    <div style={{ 
      padding: '30px',
      backgroundColor: '#121828',
      minHeight: 'calc(100vh - 80px)',
      color: 'white'
    }}>
      {/* العنوان والبحث */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: 'white'
        }}>
          الورديات
        </h1>

        {/* شريط البحث والتاريخ */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap'
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
              placeholder="بحث سريع عن نوع الاجازة"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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


          <button
            onClick={handleAdd}
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
            <FaPlus />
            إضافة وردية
          </button>
        </div>
      </div>

      {/* جدول الورديات */}
      <div style={{
        backgroundColor: '#202938',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #333'
      }}>
      

        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            minWidth: '800px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#AC2000' }}>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333',
                  backgroundColor: '#AC2000'
                }}>
                  اسم الوردية
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333',
                  backgroundColor: '#AC2000'
                }}>
                  عدد أيام العمل
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333',
                  backgroundColor: '#AC2000'
                }}>
                  أيام الإجازة
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333',
                  backgroundColor: '#AC2000'
                }}>
                  أنشى من
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333',
                  backgroundColor: '#AC2000'
                }}>
                  الحالة
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333',
                  backgroundColor: '#AC2000'
                }}>
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'white' }}>
                    جاري التحميل...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'white' }}>
                    لا توجد ورديات
                  </td>
                </tr>
              ) : (
                filteredData.map((shift, index) => (
                <tr key={shift.id} style={{ 
                  borderBottom: '1px solid #333'
                }}>
                    <td style={{ 
                      padding: '15px', 
                      color: 'white',
                      fontWeight: '500',
                      textAlign: 'center'
                    }}>
                      {shift.name_ar || shift.name}
                    </td>
                    <td style={{ padding: '15px', color: 'white', textAlign: 'center' }}>
                      {shift.work_days_count ? `${shift.work_days_count} أيام` : '--'}
                    </td>
                    <td style={{ padding: '15px', color: 'white', textAlign: 'center' }}>
                      {shift.details && shift.details.length > 0 ? 
                        shift.details.filter(d => d.is_off_day).map(d => {
                          const dayNames = {
                            'saturday': 'السبت',
                            'sunday': 'الأحد', 
                            'monday': 'الاثنين',
                            'tuesday': 'الثلاثاء',
                            'wednesday': 'الأربعاء',
                            'thursday': 'الخميس',
                            'friday': 'الجمعة'
                          };
                          return dayNames[d.day_of_week] || d.day_of_week;
                        }).join(', ') || 'لا توجد' : 
                        'لا توجد'
                      }
                    </td>
                    <td style={{ padding: '15px', color: 'white', textAlign: 'center' }}>
                      {shift.created_at ? new Date(shift.created_at).toLocaleDateString('ar-EG') : '--'}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{
                        backgroundColor: shift.is_active ? '#AC2000' : '#dc3545',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {shift.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                          onClick={() => handleView(shift.id)}
                          style={{
                            backgroundColor: '#666',
                            color: 'white',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                          title="عرض التفاصيل"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(shift.id)}
                        style={{
                          backgroundColor: '#AC2000',
                          color: 'white',
                          border: 'none',
                          padding: '8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                        title="تعديل"
                      >
                        <FaEdit />
                      </button>
                      <button
                          onClick={() => handleDelete(shift)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                        title="حذف"
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

        {/* الترقيم */}
        <div style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          borderTop: '1px solid #333'
        }}>
          <button style={{
            backgroundColor: '#AC2000',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            1
          </button>
          <button style={{
            backgroundColor: '#202938',
            color: 'white',
            border: '1px solid #333',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            2
          </button>
          <button style={{
            backgroundColor: '#202938',
            color: 'white',
            border: '1px solid #333',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            3
          </button>
          <button style={{
            backgroundColor: '#202938',
            color: 'white',
            border: '1px solid #333',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            4
          </button>
          <button style={{
            backgroundColor: '#202938',
            color: 'white',
            border: '1px solid #333',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            5
          </button>
          <button style={{
            backgroundColor: '#202938',
            color: 'white',
            border: '1px solid #333',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            &gt;&gt;
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#202938',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            border: '1px solid #333'
          }}>
            <h3 style={{
              color: 'white',
              marginBottom: '20px',
              fontSize: '18px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              تأكيد الحذف
            </h3>
            <p style={{
              color: 'white',
              marginBottom: '10px',
              textAlign: 'center',
              fontSize: '16px'
            }}>
              هل أنت متأكد من حذف الوردية "{shiftToDelete?.name_ar || shiftToDelete?.name}"؟
            </p>
            <p style={{
              color: 'white',
              marginBottom: '30px',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
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
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
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

export default Shifts;
