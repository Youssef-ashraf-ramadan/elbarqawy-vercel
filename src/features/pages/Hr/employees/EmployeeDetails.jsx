import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEmployeeDetails, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft, FaEdit, FaTrash, FaUser, FaCalendarAlt, FaEnvelope, FaPhone, FaBuilding, FaBriefcase, FaClock, FaImage, FaIdCard } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { employeeDetails, isLoading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getEmployeeDetails(id));
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
    navigate(`/edit-employee/${id}`);
  };

  const handleDelete = () => {
    navigate(`/employees`);
  };

  const handleBack = () => {
    navigate('/employees');
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

  if (!employeeDetails) {
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
          <h5 style={{ color: 'white', marginBottom: '10px' }}>لم يتم العثور على الموظف</h5>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>قد يكون الموظف غير موجود أو تم حذفه</p>
          <button
            onClick={handleBack}
            style={{
              backgroundColor: '#0CAD5D',
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
            العودة للموظفين
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
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
                تفاصيل الموظف
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
            {/* صورة الموظف والمعلومات الأساسية */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                backgroundColor: '#1a1f2e',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #333'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <FaUser style={{ fontSize: '1.2rem', color: '#0CAD5D', marginLeft: '10px' }} />
                  <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>المعلومات الشخصية</h3>
                </div>
                
                <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                  {/* صورة الموظف */}
                  <div style={{ textAlign: 'center' }}>
                    {employeeDetails.images && employeeDetails.images.length > 0 ? (
                      <img 
                        src={employeeDetails.images[0].url} 
                        alt="صورة الموظف"
                        style={{
                          width: '120px',
                          height: '120px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid #0CAD5D'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        backgroundColor: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '3px solid #0CAD5D'
                      }}>
                        <FaImage style={{ fontSize: '2rem', color: '#666' }} />
                      </div>
                    )}
                  </div>

                  {/* المعلومات الأساسية */}
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '5px',
                        color: '#6c757d',
                        fontSize: '14px'
                      }}>
                        اسم الموظف
                      </label>
                      <p style={{ 
                        margin: 0, 
                        color: '#0CAD5D', 
                        fontSize: '18px', 
                        fontWeight: 'bold' 
                      }}>
                        {employeeDetails.name}
                      </p>
                    </div>
                    
                    <div>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '5px',
                        color: '#6c757d',
                        fontSize: '14px'
                      }}>
                        كود الموظف
                      </label>
                      <p style={{ 
                        margin: 0, 
                        color: 'white', 
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaIdCard />
                        {employeeDetails.employee_code}
                      </p>
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '5px',
                        color: '#6c757d',
                        fontSize: '14px'
                      }}>
                        البريد الإلكتروني
                      </label>
                      <p style={{ 
                        margin: 0, 
                        color: 'white', 
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaEnvelope />
                        {employeeDetails.email}
                      </p>
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '5px',
                        color: '#6c757d',
                        fontSize: '14px'
                      }}>
                        رقم الهاتف
                      </label>
                      <p style={{ 
                        margin: 0, 
                        color: 'white', 
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaPhone />
                        {employeeDetails.phone}
                      </p>
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '5px',
                        color: '#6c757d',
                        fontSize: '14px'
                      }}>
                        تاريخ الميلاد
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
                        {new Date(employeeDetails.birth_date).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '5px',
                        color: '#6c757d',
                        fontSize: '14px'
                      }}>
                        الجنس
                      </label>
                      <p style={{ 
                        margin: 0, 
                        color: 'white', 
                        fontSize: '14px'
                      }}>
                        {employeeDetails.gender === 'male' ? 'ذكر' : 'أنثى'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* المعلومات الوظيفية */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                backgroundColor: '#1a1f2e',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #333'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <FaBriefcase style={{ fontSize: '1.2rem', color: '#17a2b8', marginLeft: '10px' }} />
                  <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>المعلومات الوظيفية</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      القسم
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: '#0CAD5D', 
                      fontSize: '16px', 
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <FaBuilding />
                      {employeeDetails.department}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      المسمى الوظيفي
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: 'white', 
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <FaBriefcase />
                      {employeeDetails.position}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      الوردية
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: 'white', 
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <FaClock />
                      {employeeDetails.work_shift ? employeeDetails.work_shift.name : 'غير محدد'}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      الحالة
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: employeeDetails.is_active ? '#0CAD5D' : '#dc3545', 
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {employeeDetails.is_active ? 'نشط' : 'غير نشط'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* تاريخ الإنشاء */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                backgroundColor: '#1a1f2e',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #333'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <FaCalendarAlt style={{ fontSize: '1.2rem', color: '#ffc107', marginLeft: '10px' }} />
                  <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>معلومات إضافية</h3>
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
                    {new Date(employeeDetails.created_at).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* الإجراءات */}
            <div>
              <div style={{
                backgroundColor: '#1a1f2e',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #333'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <i className="fas fa-cogs" style={{ fontSize: '1.2rem', color: '#ffc107', marginLeft: '10px' }}></i>
                  <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>الإجراءات</h3>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    onClick={handleEdit}
                    style={{
                      backgroundColor: '#ffc107',
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
                    تعديل الموظف
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
                    حذف الموظف
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

export default EmployeeDetails;
