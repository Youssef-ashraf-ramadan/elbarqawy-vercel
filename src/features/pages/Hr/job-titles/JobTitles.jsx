import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getJobTitles, deleteJobTitle, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaSearch, FaPlus, FaBriefcase, FaFileAlt, FaCalendarAlt, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

const JobTitles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jobTitles, isLoading, error, success } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobTitleToDelete, setJobTitleToDelete] = useState(null);

  useEffect(() => {
    dispatch(getJobTitles());
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

  const filteredData = jobTitles.filter(job => 
    job.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    return status === 'نشط' ? '#AC2000' : '#dc3545';
  };

  const handleEdit = (id) => {
    navigate(`/job-titles/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/job-titles/details/${id}`);
  };

  const handleDelete = (jobTitle) => {
    setJobTitleToDelete(jobTitle);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (jobTitleToDelete) {
      await dispatch(deleteJobTitle(jobTitleToDelete.id));
      dispatch(getJobTitles()); // Refresh the list
      setShowDeleteModal(false);
      setJobTitleToDelete(null);
    }
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
          المسميات الوظيفية
        </h1>

        {/* شريط البحث والفلتر */}
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
              placeholder="بحث سريع عن المسمى الوظيفي"
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
            onClick={() => navigate('/add-job-title')}
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
            اضافة مسمى جديد
          </button>
        </div>
      </div>

      {/* جدول المسميات الوظيفية */}
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
                  #
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
                  <FaBriefcase className="mx-2" />
                  المسمى الوظيفي
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
                  <FaFileAlt className="mx-2" />
                  الوصف
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
                  <FaCalendarAlt className="mx-2" />
                  تاريخ الإنشاء
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
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((job, index) => (
                  <tr key={job.id} style={{ 
                    borderBottom: '1px solid #333'
                  }}>
                    <td style={{ 
                      padding: '15px', 
                      color: 'white',
                      fontWeight: '500',
                      textAlign: 'center'
                    }}>
                      {index + 1}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      color: 'white',
                      fontWeight: '500',
                      textAlign: 'center'
                    }}>
                      {job.name}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      color: 'white',
                      opacity: 0.9,
                      maxWidth: '300px',
                      wordWrap: 'break-word',
                      textAlign: 'center'
                    }}>
                      {job.description}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      color: 'white',
                      opacity: 0.9,
                      textAlign: 'center'
                    }}>
                      {formatDate(job.created_at)}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleView(job.id)}
                          style={{
                            backgroundColor: '#17a2b8',
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
                          title="عرض التفاصيل"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(job.id)}
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
                          onClick={() => handleDelete(job)}
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
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-white py-5">
                    لا توجد مسميات وظيفية
                  </td>
                </tr>
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
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{
              backgroundColor: '#202938',
              border: '1px solid #333',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <div className="modal-header" style={{ border: 'none', borderBottom: '1px solid #333' }}>
                <h5 className="modal-title text-white">تأكيد الحذف</h5>
              </div>
              <div className="modal-body text-white">
                <p>هل أنت متأكد من حذف المسمى الوظيفي "{jobTitleToDelete?.name}"؟</p>
                <p  style={{ color: 'white' }}>هذا الإجراء لا يمكن التراجع عنه.</p>
              </div>
              <div className="modal-footer" style={{ border: 'none' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    backgroundColor: '#6c757d',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 20px'
                  }}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  style={{
                    backgroundColor: '#dc3545',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 20px'
                  }}
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTitles;
