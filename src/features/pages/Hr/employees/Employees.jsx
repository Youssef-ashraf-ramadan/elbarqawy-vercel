import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEmployees, deleteEmployee, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Employees = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employees, employeesPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Fetch employees on component mount
  useEffect(() => {
    dispatch(getEmployees({ page: currentPage }));
  }, [dispatch, currentPage]);

  // Handle success and error messages
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


  const filteredEmployees = employees?.filter(employee => 
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employee_code?.includes(searchTerm) ||
    employee.position?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (employeeToDelete) {
      await dispatch(deleteEmployee(employeeToDelete.id));
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
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
          الموظفين
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
              placeholder="بحث سريع عن موظف"
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
            onClick={() => navigate('/add-employee')}
            style={{
              backgroundColor: '#0CAD5D',
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
            اضافة موظف جديد
          </button>
        </div>
      </div>

      {/* جدول الموظفين */}
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
          <h3 style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: 'bold',
            color: 'white'
          }}>
            جميع الموظفين
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            minWidth: '1400px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1a1f2e' }}>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333'
                }}>
                  الصورة
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333'
                }}>
                  اسم الموظف
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333'
                }}>
                  كود الموظف
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333'
                }}>
                  البريد الإلكتروني
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333'
                }}>
                  رقم الهاتف
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333'
                }}>
                  تاريخ الميلاد
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333'
                }}>
                  الجنس
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333'
                }}>
                  القسم
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333'
                }}>
                  المسمى الوظيفي
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333'
                }}>
                  الوردية
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333'
                }}>
                  الحالة
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid #333'
                }}>
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr key={employee.id} style={{ 
                  borderBottom: '1px solid #333',
                  '&:hover': {
                    backgroundColor: '#1a1f2e'
                  }
                }}>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    {employee.images && employee.images.length > 0 ? (
                    <img 
                        src={employee.images[0].url} 
                      alt={employee.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    ) : (
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                      }}>
                        <span style={{ color: '#666', fontSize: '12px' }}>IMG</span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '15px', color: 'white', textAlign: 'center' }}>
                    {employee.name}
                  </td>
                  <td style={{ padding: '15px', color: 'white', textAlign: 'center' }}>
                    {employee.employee_code}
                  </td>
                  <td style={{ padding: '15px', color: 'white', textAlign: 'center' }}>
                    {employee.email}
                  </td>
                  <td style={{ padding: '15px', color: 'white', textAlign: 'center' }}>
                    {employee.phone}
                  </td>
                  <td style={{ padding: '15px', color: 'white', textAlign: 'center' }}>
                    {employee.birth_date ? new Date(employee.birth_date).toLocaleDateString('ar-EG') : '-'}
                  </td>
                  <td style={{ padding: '15px', color: 'white', textAlign: 'center' }}>
                    {employee.gender === 'male' ? 'ذكر' : 'أنثى'}
                  </td>
                  <td style={{ padding: '15px', color: 'white', textAlign: 'center' }}>
                    {employee.department}
                  </td>
                  <td style={{ padding: '15px', color: 'white', textAlign: 'center' }}>
                    {employee.position}
                  </td>
                  <td style={{ padding: '15px', color: 'white', textAlign: 'center' }}>
                    {employee.work_shift ? employee.work_shift.name : '-'}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span style={{
                      backgroundColor: employee.is_active ? '#0CAD5D' : '#dc3545',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      minWidth: '60px'
                    }}>
                      {employee.is_active ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => navigate(`/edit-employee/${employee.id}`)}
                        style={{
                          backgroundColor: '#0CAD5D',
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
                        onClick={() => navigate(`/employees/view/${employee.id}`)}
                        style={{
                          backgroundColor: '#666',
                          color: 'white',
                          border: 'none',
                          padding: '8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                        title="عرض"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDelete(employee)}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* الترقيم */}
        {employeesPagination && (
        <div style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          borderTop: '1px solid #333'
        }}>
          {/* Previous Button */}
          {employeesPagination.current_page > 1 && (
            <button 
              onClick={() => setCurrentPage(employeesPagination.current_page - 1)}
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
          {Array.from({ length: employeesPagination.last_page }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                backgroundColor: page === employeesPagination.current_page ? '#0CAD5D' : '#202938',
            color: 'white',
                border: page === employeesPagination.current_page ? 'none' : '1px solid #333',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
                fontSize: '14px',
                fontWeight: page === employeesPagination.current_page ? 'bold' : 'normal'
              }}
            >
              {page}
          </button>
          ))}

          {/* Next Button */}
          {employeesPagination.current_page < employeesPagination.last_page && (
            <button 
              onClick={() => setCurrentPage(employeesPagination.current_page + 1)}
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
                  <p>هل أنت متأكد من حذف الموظف "{employeeToDelete?.name}"؟</p>
                  <p style={{ color: 'white' }}>هذا الإجراء لا يمكن التراجع عنه.</p>
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
    </div>
  );
};

export default Employees;
