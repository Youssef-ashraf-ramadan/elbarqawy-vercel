import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSalaries, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Salaries = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { salaries, salariesPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getSalaries({ page: currentPage }));
  }, [dispatch, currentPage]);

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

  const filteredData = salaries?.filter(salary => 
    salary.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salary.employee?.employee_code?.includes(searchTerm) ||
    salary.employee?.phone?.includes(searchTerm)
  ) || [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    dispatch(getSalaries({ page }));
  };

  const getStatusColor = (status) => {
    return status === 'مدفوع' ? '#AC2000' : '#dc3545';
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
          المرتبات
        </h1>

        {/* شريط البحث */}
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
            onClick={() => navigate('/salaries/add')}
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
            اضافة راتب جديد
          </button>
        </div>
      </div>

      {/* جدول المرتبات */}
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
            مرتبات الموظفين
          </h3>
        </div>

        {isLoading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            color: 'white'
          }}>
            <div>جاري التحميل...</div>
          </div>
        ) : filteredData && filteredData.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              minWidth: '1000px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#1a1f2e' }}>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '1px solid #333'
                  }}>
                    #
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '1px solid #333'
                  }}>
                    الموظف
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '1px solid #333'
                  }}>
                    الراتب الأساسي
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '1px solid #333'
                  }}>
                    البدلات
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '1px solid #333'
                  }}>
                    الخصومات
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '1px solid #333'
                  }}>
                    تاريخ السريان
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '1px solid #333'
                  }}>
                    الإجراء
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((salary, index) => (
                  <tr key={salary.id} style={{ 
                    borderBottom: '2px solid #444',
                    borderTop: index === 0 ? '2px solid #444' : 'none'
                  }}>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: 'white'
                    }}>
                      {index + 1}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: 'white'
                    }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{salary.employee?.name}</div>
                        <div style={{ fontSize: '12px', color: '#ccc' }}>{salary.employee?.employee_code}</div>
                        <div style={{ fontSize: '12px', color: '#ccc' }}>{salary.employee?.phone}</div>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: 'white'
                    }}>
                      {parseFloat(salary.base_salary).toLocaleString('ar-EG')} جنيه
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '12px' }}>
                        {salary.allowances?.housing && (
                          <div>سكن: {salary.allowances.housing.toLocaleString('ar-EG')} جنيه</div>
                        )}
                        {salary.allowances?.transportation && (
                          <div>مواصلات: {salary.allowances.transportation.toLocaleString('ar-EG')} جنيه</div>
                        )}
                      </div>
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '12px' }}>
                        {salary.deductions?.social_insurance && (
                          <div>تأمين اجتماعي: {salary.deductions.social_insurance.toLocaleString('ar-EG')} جنيه</div>
                        )}
                      </div>
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: 'white'
                    }}>
                      {new Date(salary.effective_date).toLocaleDateString('ar-EG')}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => navigate(`/salaries/details/${salary.employee?.id}`)}
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666'
          }}>
            لا توجد رواتب
          </div>
        )}

        {/* الباجينيشن */}
        {salariesPagination && salariesPagination.last_page > 1 && (
          <div style={{
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            borderTop: '1px solid #333',
            flexWrap: 'wrap'
          }}>
            {/* زر السابق */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px',
                margin: '0 2px',
                backgroundColor: currentPage === 1 ? '#666' : '#AC2000',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              السابق
            </button>

            {/* أرقام الصفحات */}
            {Array.from({ length: salariesPagination.last_page }, (_, i) => i + 1).map(page => {
              if (page === 1 || page === salariesPagination.last_page || 
                  (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    style={{
                      padding: '8px 12px',
                      margin: '0 2px',
                      backgroundColor: page === currentPage ? '#AC2000' : '#333',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: page === currentPage ? 'bold' : 'normal'
                    }}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={`ellipsis-${page}`} style={{ color: 'white', padding: '0 4px' }}>
                    ...
                  </span>
                );
              }
              return null;
            })}

            {/* زر التالي */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === salariesPagination.last_page}
              style={{
                padding: '8px 12px',
                margin: '0 2px',
                backgroundColor: currentPage === salariesPagination.last_page ? '#666' : '#AC2000',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === salariesPagination.last_page ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Salaries;
