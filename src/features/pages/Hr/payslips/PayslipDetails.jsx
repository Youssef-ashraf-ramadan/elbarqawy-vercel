import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPayslipDetails, clearError } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft, FaFilePdf } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PayslipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { payslipDetails, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getPayslipDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('ar-EG') + ' جنيه';
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
        <div>جاري التحميل...</div>
      </div>
    );
  }

  if (!payslipDetails) {
    return (
      <div style={{ 
        padding: '30px',
        backgroundColor: '#121828',
        minHeight: 'calc(100vh - 80px)',
        color: 'white',
        textAlign: 'center'
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
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => navigate('/payslips')}
            style={{
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaArrowLeft />
            العودة
          </button>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: 'white',
            margin: 0
          }}>
            تفاصيل كشف الراتب
          </h1>
        </div>
      </div>

      {/* تفاصيل الكشف */}
      <div style={{
        backgroundColor: '#202938',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #333'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* فترة الراتب */}
          <div>
            <h3 style={{ 
              color: '#0CAD5D',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              فترة الراتب
            </h3>
            <div style={{
              backgroundColor: '#1a1f2e',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #333',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: 'white'
              }}>
                {payslipDetails.pay_period || 'غير متوفر'}
              </div>
            </div>
          </div>

          {/* تاريخ التوليد */}
          <div>
            <h3 style={{ 
              color: '#0CAD5D',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              تاريخ التوليد
            </h3>
            <div style={{
              backgroundColor: '#1a1f2e',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #333',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: 'white'
              }}>
                {payslipDetails.generated_at ? formatDate(payslipDetails.generated_at) : 'غير متوفر'}
              </div>
            </div>
          </div>

          {/* الموظف */}
          <div>
            <h3 style={{ 
              color: '#0CAD5D',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              الموظف
            </h3>
            <div style={{
              backgroundColor: '#1a1f2e',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #333',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: 'white'
              }}>
                {payslipDetails.employee?.name || 'غير متوفر'}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#ccc',
                marginTop: '5px'
              }}>
                {payslipDetails.employee?.employee_code || '-'}
              </div>
            </div>
          </div>

          {/* إجمالي الراتب */}
          <div>
            <h3 style={{ 
              color: '#0CAD5D',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              إجمالي الراتب
            </h3>
            <div style={{
              backgroundColor: '#1a1f2e',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #333',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: 'bold',
                color: 'white'
              }}>
                {payslipDetails.gross_salary ? formatCurrency(payslipDetails.gross_salary) : 'غير متوفر'}
              </div>
            </div>
          </div>

          {/* صافي الراتب */}
          <div>
            <h3 style={{ 
              color: '#0CAD5D',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              صافي الراتب
            </h3>
            <div style={{
              backgroundColor: '#1a1f2e',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #333',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold',
                color: '#0CAD5D'
              }}>
                {payslipDetails.net_salary ? formatCurrency(payslipDetails.net_salary) : 'غير متوفر'}
              </div>
            </div>
          </div>
        </div>

        {/* تفاصيل الحساب */}
        {payslipDetails.breakdown && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#1a1f2e',
            borderRadius: '8px',
            border: '1px solid #333'
          }}>
            <h3 style={{ 
              color: '#0CAD5D',
              marginBottom: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              تفاصيل الحساب
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {payslipDetails.breakdown.base_salary && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>الراتب الأساسي</div>
                  <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                    {formatCurrency(payslipDetails.breakdown.base_salary)}
                  </div>
                </div>
              )}
              {payslipDetails.breakdown.allowances && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>إجمالي البدلات</div>
                  <div style={{ color: '#0CAD5D', fontSize: '16px', fontWeight: 'bold' }}>
                    {formatCurrency(
                      (payslipDetails.breakdown.allowances?.housing || 0) + 
                      (payslipDetails.breakdown.allowances?.transportation || 0)
                    )}
                  </div>
                </div>
              )}
              {payslipDetails.breakdown.fixed_deductions && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>الخصومات الثابتة</div>
                  <div style={{ color: '#dc3545', fontSize: '16px', fontWeight: 'bold' }}>
                    {formatCurrency(payslipDetails.breakdown.fixed_deductions?.social_insurance || 0)}
                  </div>
                </div>
              )}
              {payslipDetails.breakdown.calculation_details && (
                <>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>إجمالي أيام العمل</div>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                      {payslipDetails.breakdown.calculation_details.total_work_days || 0}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>أيام الحضور</div>
                    <div style={{ color: '#0CAD5D', fontSize: '16px', fontWeight: 'bold' }}>
                      {payslipDetails.breakdown.calculation_details.attended_days || 0}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>أيام الغياب</div>
                    <div style={{ color: '#dc3545', fontSize: '16px', fontWeight: 'bold' }}>
                      {payslipDetails.breakdown.calculation_details.absent_days || 0}
                    </div>
                  </div>
                  {payslipDetails.breakdown.calculation_details.absence_deduction && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>خصم الغياب</div>
                      <div style={{ color: '#dc3545', fontSize: '16px', fontWeight: 'bold' }}>
                        {formatCurrency(payslipDetails.breakdown.calculation_details.absence_deduction)}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayslipDetails;

