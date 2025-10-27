import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPayslips, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaSearch, FaEye, FaFilePdf, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Payslips = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { payslips, payslipsPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getPayslips({ page: currentPage }));
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

  const filteredData = payslips?.filter(payslip => 
    payslip.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payslip.employee?.employee_code?.includes(searchTerm) ||
    payslip.pay_period?.includes(searchTerm)
  ) || [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    dispatch(getPayslips({ page }));
  };

  return (
    <div style={{ 
      padding: '30px',
      backgroundColor: '#121828',
      minHeight: 'calc(100vh - 80px)',
      color: 'white'
    }}>
      {/* العنوان */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '20px'
        }}>
          كشف الرواتب
        </h1>

        {/* شريط البحث وأزرار الإجراءات */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1', maxWidth: '400px', position: 'relative' }}>
            <FaSearch style={{ 
              position: 'absolute', 
              right: '15px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#666',
              fontSize: '18px'
            }} />
            <input
              type="text"
              placeholder="ابحث بالاسم أو كود الموظف أو فترة الراتب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 45px 12px 15px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px'
              }}
            />
          </div>
          <button
            onClick={() => navigate('/payslips/generate')}
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
            <FaPlus />
            توليد كشف راتب جديد
          </button>
        </div>
      </div>

      {/* الجدول */}
      <div style={{
        backgroundColor: '#202938',
        borderRadius: '12px',
        border: '1px solid #333',
        overflow: 'hidden'
      }}>
        {filteredData.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#1a1f2e', borderBottom: '2px solid #0CAD5D' }}>
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
                    فترة الراتب
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '1px solid #333'
                  }}>
                    إجمالي الراتب
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '1px solid #333'
                  }}>
                    صافي الراتب
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '1px solid #333'
                  }}>
                    الحالة
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
                {filteredData.map((payslip, index) => (
                  <tr key={payslip.id} style={{ 
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
                        <div style={{ fontWeight: 'bold' }}>{payslip.employee?.name || 'غير متوفر'}</div>
                        <div style={{ fontSize: '12px', color: '#ccc' }}>{payslip.employee?.employee_code || '-'}</div>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: 'white'
                    }}>
                      {payslip.pay_period || 'غير متوفر'}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {payslip.gross_salary ? `${parseFloat(payslip.gross_salary).toLocaleString('ar-EG')} جنيه` : 'غير متوفر'}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#0CAD5D',
                      fontWeight: 'bold'
                    }}>
                      {payslip.net_salary ? `${parseFloat(payslip.net_salary).toLocaleString('ar-EG')} جنيه` : 'غير متوفر'}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: 'white'
                    }}>
                      <span style={{
                        padding: '5px 15px',
                        borderRadius: '20px',
                        backgroundColor: payslip.status === 'generated' ? 'rgba(12, 173, 93, 0.2)' : payslip.status === 'paid' ? 'rgba(0, 123, 255, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                        color: payslip.status === 'generated' ? '#0CAD5D' : payslip.status === 'paid' ? '#007bff' : '#dc3545',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {payslip.status === 'generated' ? 'تم التوليد' : payslip.status === 'paid' ? 'مدفوع' : payslip.status || 'غير متوفر'}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => navigate(`/payslips/${payslip.id}`)}
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
            لا توجد كشوف رواتب
          </div>
        )}

        {/* الباجينيشن */}
        {payslipsPagination && payslipsPagination.last_page > 1 && (
          <div style={{
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            borderTop: '1px solid #333',
            flexWrap: 'wrap'
          }}>
            {payslipsPagination.current_page > 1 && (
              <button
                onClick={() => handlePageChange(payslipsPagination.current_page - 1)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                السابق
              </button>
            )}
            
            {Array.from({ length: payslipsPagination.last_page }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: page === payslipsPagination.current_page ? '#0CAD5D' : '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: page === payslipsPagination.current_page ? 'bold' : 'normal'
                }}
              >
                {page}
              </button>
            ))}
            
            {payslipsPagination.current_page < payslipsPagination.last_page && (
              <button
                onClick={() => handlePageChange(payslipsPagination.current_page + 1)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                التالي
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Payslips;

