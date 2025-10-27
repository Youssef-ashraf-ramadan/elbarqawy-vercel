import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getWorkShiftDetails, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { toast } from 'react-toastify';
import { FaArrowRight, FaEdit, FaTrash } from 'react-icons/fa';

const ShiftDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { workShiftDetails, isLoading, error, success } = useSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const daysOfWeek = [
    { key: 'saturday', label: 'السبت' },
    { key: 'sunday', label: 'الأحد' },
    { key: 'monday', label: 'الاثنين' },
    { key: 'tuesday', label: 'الثلاثاء' },
    { key: 'wednesday', label: 'الأربعاء' },
    { key: 'thursday', label: 'الخميس' },
    { key: 'friday', label: 'الجمعة' }
  ];

  useEffect(() => {
    if (id) {
      dispatch(getWorkShiftDetails(id));
    }
  }, [dispatch, id]);

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

  const handleEdit = () => {
    navigate(`/shifts/edit/${id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    // Implement delete functionality
    setShowDeleteModal(false);
  };

  if (isLoading) {
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
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #333',
            borderTop: '4px solid #0CAD5D',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!workShiftDetails) {
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
        <div style={{ textAlign: 'center' }}>
          <p>لا توجد بيانات</p>
          <button
            onClick={() => navigate('/shifts')}
            style={{
              backgroundColor: '#0CAD5D',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              marginTop: '20px'
            }}
          >
            العودة للقائمة
          </button>
        </div>
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
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: 'white'
        }}>
          تفاصيل الوردية
        </h1>
      </div>

      <div style={{
        backgroundColor: '#202938',
        borderRadius: '12px',
        padding: '30px',
        border: '1px solid #333',
        marginBottom: '30px'
      }}>
        {/* معلومات الوردية */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            color: '#0CAD5D',
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            معلومات الوردية
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#666',
                fontSize: '14px'
              }}>
                اسم الوردية (عربي)
              </label>
              <p style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                margin: 0
              }}>
                {workShiftDetails.name_ar || workShiftDetails.name}
              </p>
            </div>
            
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#666',
                fontSize: '14px'
              }}>
                اسم الوردية (إنجليزي)
              </label>
              <p style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                margin: 0
              }}>
                {workShiftDetails.name_en || workShiftDetails.name}
              </p>
            </div>
            
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#666',
                fontSize: '14px'
              }}>
                عدد أيام العمل
              </label>
              <p style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                margin: 0
              }}>
                {workShiftDetails.work_days_count ? `${workShiftDetails.work_days_count} أيام` : '--'}
              </p>
            </div>
            
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#666',
                fontSize: '14px'
              }}>
                الحالة
              </label>
              <span style={{
                backgroundColor: workShiftDetails.is_active ? '#0CAD5D' : '#dc3545',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {workShiftDetails.is_active ? 'نشط' : 'غير نشط'}
              </span>
            </div>
          </div>
        </div>

        {/* تفاصيل الأيام */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            color: '#0CAD5D',
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            تفاصيل الأيام
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {workShiftDetails.details && workShiftDetails.details.map((day, index) => (
              <div key={day.day_of_week} style={{
                backgroundColor: '#1a1f2e',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #333'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '15px'
                }}>
                  <h4 style={{
                    color: '#0CAD5D',
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    {daysOfWeek.find(d => d.key === day.day_of_week)?.label}
                  </h4>
                  
                  <span style={{
                    backgroundColor: day.is_off_day ? '#dc3545' : '#0CAD5D',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {day.is_off_day ? 'يوم إجازة' : 'يوم عمل'}
                  </span>
                </div>

                {!day.is_off_day && (
                  <div style={{
                    display: 'flex',
                    gap: '15px',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        color: '#666',
                        fontSize: '14px'
                      }}>
                        وقت البداية
                      </label>
                      <p style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        margin: 0
                      }}>
                        {day.start_time || '--'}
                      </p>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        color: '#666',
                        fontSize: '14px'
                      }}>
                        وقت النهاية
                      </label>
                      <p style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        margin: 0
                      }}>
                        {day.end_time || '--'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* أزرار التحكم */}
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          marginTop: '30px'
        }}>
          <button
            onClick={() => navigate('/shifts')}
            style={{
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaArrowRight />
            العودة للقائمة
          </button>
          
          <button
            onClick={handleEdit}
            style={{
              backgroundColor: '#0CAD5D',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaEdit />
            تعديل
          </button>
          
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaTrash />
            حذف
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
              هل أنت متأكد من حذف الوردية "{workShiftDetails.name_ar || workShiftDetails.name}"؟
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

export default ShiftDetails;
