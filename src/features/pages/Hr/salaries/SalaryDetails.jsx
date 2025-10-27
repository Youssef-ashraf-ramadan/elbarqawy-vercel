import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSalaryDetails, clearError } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SalaryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { salaryDetails, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getSalaryDetails(id));
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

  if (!salaryDetails) {
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
            onClick={() => navigate('/salaries')}
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
            تفاصيل الراتب
          </h1>
        </div>
      </div>

      {/* تفاصيل الراتب */}
      <div style={{
        backgroundColor: '#202938',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #333'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* الراتب الأساسي */}
          <div>
            <h3 style={{ 
              color: '#0CAD5D',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              الراتب الأساسي
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
                {formatCurrency(salaryDetails.base_salary)}
              </div>
            </div>
          </div>

          {/* تاريخ السريان */}
          <div>
            <h3 style={{ 
              color: '#0CAD5D',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              تاريخ السريان
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
                {formatDate(salaryDetails.effective_date)}
              </div>
            </div>
          </div>

          {/* البدلات */}
          <div>
            <h3 style={{ 
              color: '#0CAD5D',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              البدلات
            </h3>
            <div style={{
              backgroundColor: '#1a1f2e',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #333'
            }}>
              {salaryDetails.allowances?.housing && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  padding: '8px',
                  backgroundColor: 'rgba(12, 173, 93, 0.1)',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#0CAD5D', fontWeight: 'bold' }}>بدل السكن:</span>
                  <span>{formatCurrency(salaryDetails.allowances.housing)}</span>
                </div>
              )}
              {salaryDetails.allowances?.transportation && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  padding: '8px',
                  backgroundColor: 'rgba(12, 173, 93, 0.1)',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#0CAD5D', fontWeight: 'bold' }}>بدل المواصلات:</span>
                  <span>{formatCurrency(salaryDetails.allowances.transportation)}</span>
                </div>
              )}
              {(!salaryDetails.allowances?.housing && !salaryDetails.allowances?.transportation) && (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#666',
                  fontStyle: 'italic',
                  fontSize: '14px'
                }}>
                  لا توجد بدلات
                </div>
              )}
            </div>
          </div>

          {/* الخصومات */}
          <div>
            <h3 style={{ 
              color: '#0CAD5D',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              الخصومات
            </h3>
            <div style={{
              backgroundColor: '#1a1f2e',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #333'
            }}>
              {salaryDetails.deductions?.social_insurance && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  padding: '8px',
                  backgroundColor: 'rgba(220, 53, 69, 0.1)',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#dc3545', fontWeight: 'bold' }}>التأمين الاجتماعي:</span>
                  <span>{formatCurrency(salaryDetails.deductions.social_insurance)}</span>
                </div>
              )}
              {!salaryDetails.deductions?.social_insurance && (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#666',
                  fontStyle: 'italic',
                  fontSize: '14px'
                }}>
                  لا توجد خصومات
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ملخص الراتب */}
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
            ملخص الراتب
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>الراتب الأساسي</div>
              <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                {formatCurrency(salaryDetails.base_salary)}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>إجمالي البدلات</div>
              <div style={{ color: '#0CAD5D', fontSize: '16px', fontWeight: 'bold' }}>
                {formatCurrency((salaryDetails.allowances?.housing || 0) + (salaryDetails.allowances?.transportation || 0))}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>إجمالي الخصومات</div>
              <div style={{ color: '#dc3545', fontSize: '16px', fontWeight: 'bold' }}>
                {formatCurrency(salaryDetails.deductions?.social_insurance || 0)}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>صافي الراتب</div>
              <div style={{ 
                color: '#0CAD5D', 
                fontSize: '18px', 
                fontWeight: 'bold',
                padding: '8px 16px',
                backgroundColor: 'rgba(12, 173, 93, 0.1)',
                borderRadius: '8px',
                border: '2px solid #0CAD5D'
              }}>
                {formatCurrency(
                  parseFloat(salaryDetails.base_salary) + 
                  (salaryDetails.allowances?.housing || 0) + 
                  (salaryDetails.allowances?.transportation || 0) - 
                  (salaryDetails.deductions?.social_insurance || 0)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryDetails;
