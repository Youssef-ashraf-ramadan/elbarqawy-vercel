import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getLeaveTypeDetails, deleteLeaveType, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const VacationDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { leaveTypeDetails, isLoading, error, success } = useSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getLeaveTypeDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      navigate('/vacations');
    }
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [success, error, navigate, dispatch]);

  const handleEdit = () => {
    navigate(`/vacations/edit/${id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteLeaveType(id));
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: 'white'
      }}>
        <div>جاري التحميل...</div>
      </div>
    );
  }

  if (!leaveTypeDetails) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: 'white'
      }}>
        <div>لا توجد بيانات</div>
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
      {/* العنوان */}
      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => navigate('/vacations')}
          style={{
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}
        >
          <FaArrowLeft />
          الرجوع
        </button>
        
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: 'white',
          margin: 0
        }}>
          تفاصيل نوع الإجازة
        </h1>
      </div>

      {/* تفاصيل الإجازة */}
      <div style={{
        backgroundColor: '#202938',
        borderRadius: '12px',
        padding: '30px',
        border: '1px solid #333'
      }}>
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          {/* العمود الأيسر */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                الاسم بالعربي
              </label>
              <div style={{
                padding: '12px 15px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}>
                {leaveTypeDetails.name_ar || leaveTypeDetails.name || 'غير محدد'}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                الاسم بالإنجليزي
              </label>
              <div style={{
                padding: '12px 15px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}>
                {leaveTypeDetails.name_en || leaveTypeDetails.name || 'غير محدد'}
              </div>
            </div>
          </div>

          {/* العمود الأيمن */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                الرصيد الافتراضي
              </label>
              <div style={{
                padding: '12px 15px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}>
                {leaveTypeDetails.default_balance} يوم
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                الحالة
              </label>
              <div style={{
                padding: '12px 15px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}>
                <span style={{
                  backgroundColor: leaveTypeDetails.is_active ? '#28a745' : '#dc3545',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {leaveTypeDetails.is_active ? 'نشط' : 'غير نشط'}
                </span>
              </div>
            </div>
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
            onClick={handleEdit}
            style={{
              backgroundColor: '#B3B3B3',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
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
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
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

      {/* Modal حذف */}
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
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid #333',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              color: 'white', 
              marginBottom: '20px',
              fontSize: '18px'
            }}>
              تأكيد الحذف
            </h3>
            <p style={{ 
              color: '#ccc', 
              marginBottom: '30px',
              fontSize: '14px'
            }}>
              هل أنت متأكد من حذف نوع الإجازة "{leaveTypeDetails.name_ar || leaveTypeDetails.name}"؟
            </p>
            <p style={{ 
              color: 'white', 
              marginBottom: '30px',
              fontSize: '12px'
            }}>
              هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              justifyContent: 'center' 
            }}>
              <button
                onClick={cancelDelete}
                style={{
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
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
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
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

export default VacationDetails;
