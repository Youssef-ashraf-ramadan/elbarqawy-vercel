import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getJobTitleDetails, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft, FaEdit, FaTrash, FaBriefcase, FaFileAlt, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const JobTitleDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { jobTitleDetails, isLoading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getJobTitleDetails(id));
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
    navigate(`/job-titles/edit/${id}`);
  };

  const handleDelete = () => {
    navigate(`/job-titles`);
  };

  const handleBack = () => {
    navigate('/job-titles');
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

  if (!jobTitleDetails) {
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
          <h5 style={{ color: 'white', marginBottom: '10px' }}>لم يتم العثور على المسمى الوظيفي</h5>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>قد يكون المسمى الوظيفي غير موجود أو تم حذفه</p>
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
            العودة للمسميات الوظيفية
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
                تفاصيل المسمى الوظيفي
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
                  <FaBriefcase style={{ fontSize: '1.2rem', color: '#AC2000', marginLeft: '10px' }} />
                  <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>معلومات المسمى الوظيفي</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      الاسم بالعربية
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: 'white', 
                      fontSize: '16px', 
                      fontWeight: 'bold' 
                    }}>
                      {jobTitleDetails.name_ar || jobTitleDetails.name}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      الاسم بالإنجليزية
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: 'white', 
                      fontSize: '16px', 
                      fontWeight: 'bold' 
                    }}>
                      {jobTitleDetails.name_en || jobTitleDetails.name}
                    </p>
                  </div>
                </div>
                <div style={{ marginTop: '15px' }}>
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
                    {new Date(jobTitleDetails.created_at).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
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
                  <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>الوصف</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      الوصف بالعربية
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: 'white', 
                      lineHeight: '1.6',
                      fontSize: '14px'
                    }}>
                      {jobTitleDetails.description_ar || jobTitleDetails.description}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      الوصف بالإنجليزية
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: 'white', 
                      lineHeight: '1.6',
                      fontSize: '14px'
                    }}>
                      {jobTitleDetails.description_en || jobTitleDetails.description}
                    </p>
                  </div>
                </div>
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
                    تعديل المسمى الوظيفي
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
                    حذف المسمى الوظيفي
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

export default JobTitleDetails;
