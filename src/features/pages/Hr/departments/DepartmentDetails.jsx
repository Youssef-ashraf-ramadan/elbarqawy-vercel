import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDepartmentDetails, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft, FaEdit, FaTrash, FaBuilding, FaCalendarAlt, FaInfoCircle, FaFileAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DepartmentDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { departmentDetails, isLoading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getDepartmentDetails(id));
    }
  }, [id, dispatch]);

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
    navigate(`/edit-department/${id}`);
  };

  const handleDelete = () => {
    navigate(`/departments`);
  };

  const handleBack = () => {
    navigate('/departments');
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
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!departmentDetails) {
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
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#ffc107', marginBottom: '20px' }}></i>
          <h5 style={{ color: 'white', marginBottom: '10px' }}>لم يتم العثور على القسم</h5>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>قد يكون القسم غير موجود أو تم حذفه</p>
          <button
            onClick={handleBack}
            style={{
              backgroundColor: '#AC2000',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto'
            }}
          >
            <FaArrowLeft />
            العودة للأقسام
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
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: '#202938',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #333'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #333',
            backgroundColor: '#1a1f2e'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ 
                margin: 0, 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: 'white'
              }}>
                تفاصيل القسم
              </h1>
              <button
                onClick={handleBack}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaArrowLeft />
                رجوع
              </button>
            </div>
          </div>

          <div style={{ padding: '30px' }}>
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                backgroundColor: '#1a1f2e',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #333'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <FaBuilding style={{ fontSize: '1.2rem', color: '#AC2000', marginLeft: '10px' }} />
                  <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>معلومات القسم</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      اسم القسم
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: 'white', 
                      fontSize: '16px', 
                      fontWeight: 'bold' 
                    }}>
                      {departmentDetails.name}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      تاريخ الإنشاء
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: 'white', 
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <FaCalendarAlt />
                      {new Date(departmentDetails.created_at).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <div style={{
                backgroundColor: '#1a1f2e',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #333'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <FaFileAlt style={{ fontSize: '1.2rem', color: '#17a2b8', marginLeft: '10px' }} />
                  <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>وصف القسم</h3>
                </div>
                <p style={{ 
                  margin: 0, 
                  color: 'white', 
                  lineHeight: '1.6',
                  fontSize: '14px'
                }}>
                  {departmentDetails.description}
                </p>
              </div>
            </div>

            <div>
              <div style={{
                backgroundColor: '#1a1f2e',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #333'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>الإجراءات</h3>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    onClick={handleEdit}
                    style={{
                      backgroundColor: '#B3B3B3',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FaEdit />
                    تعديل القسم
                  </button>
                  <button
                    onClick={handleDelete}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FaTrash />
                    حذف القسم
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;
