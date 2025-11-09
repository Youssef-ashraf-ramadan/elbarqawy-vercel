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
    return parseFloat(amount).toLocaleString('ar-EG') + ' Ø¬Ù†ÙŠÙ‡';
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
        <div>Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ­Ù…ÙŠÙ„...</div>
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
        <div>Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¨ÙŠØ§Ù†Ø§Øª</div>
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
      {/* Ø§Ù„Ø¹Ù†ÙˆØ§Ù† */}
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
            Ø§Ù„Ø¹ÙˆØ¯Ø©
          </button>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: 'white',
            margin: 0
          }}>
            ØªÙØ§ØµÙŠÙ„ ÙƒØ´Ù Ø§Ù„Ø±Ø§ØªØ¨
          </h1>
        </div>
      </div>

      {/* ØªÙØ§ØµÙŠÙ„ Ø§Ù„ÙƒØ´Ù */}
      <div style={{
        backgroundColor: '#202938',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #333'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* ÙØªØ±Ø© Ø§Ù„Ø±Ø§ØªØ¨ */}
          <div>
            <h3 style={{ 
              color: '#AC2000',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              ÙØªØ±Ø© Ø§Ù„Ø±Ø§ØªØ¨
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
                {payslipDetails.pay_period || 'ØºÙŠØ± Ù…ØªÙˆÙØ±'}
              </div>
            </div>
          </div>

          {/* ØªØ§Ø±ÙŠØ® Ø§Ù„ØªÙˆÙ„ÙŠØ¯ */}
          <div>
            <h3 style={{ 
              color: '#AC2000',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              ØªØ§Ø±ÙŠØ® Ø§Ù„ØªÙˆÙ„ÙŠØ¯
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
                {payslipDetails.generated_at ? formatDate(payslipDetails.generated_at) : 'ØºÙŠØ± Ù…ØªÙˆÙØ±'}
              </div>
            </div>
          </div>

          {/* Ø§Ù„Ù…ÙˆØ¸Ù */}
          <div>
            <h3 style={{ 
              color: '#AC2000',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Ø§Ù„Ù…ÙˆØ¸Ù
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
                {payslipDetails.employee?.name || 'ØºÙŠØ± Ù…ØªÙˆÙØ±'}
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

          {/* Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø±Ø§ØªØ¨ */}
          <div>
            <h3 style={{ 
              color: '#AC2000',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø±Ø§ØªØ¨
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
                {payslipDetails.gross_salary ? formatCurrency(payslipDetails.gross_salary) : 'ØºÙŠØ± Ù…ØªÙˆÙØ±'}
              </div>
            </div>
          </div>

          {/* ØµØ§ÙÙŠ Ø§Ù„Ø±Ø§ØªØ¨ */}
          <div>
            <h3 style={{ 
              color: '#AC2000',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              ØµØ§ÙÙŠ Ø§Ù„Ø±Ø§ØªØ¨
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
                color: '#AC2000'
              }}>
                {payslipDetails.net_salary ? formatCurrency(payslipDetails.net_salary) : 'ØºÙŠØ± Ù…ØªÙˆÙØ±'}
              </div>
            </div>
          </div>
        </div>

        {/* ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø­Ø³Ø§Ø¨ */}
        {payslipDetails.breakdown && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#1a1f2e',
            borderRadius: '8px',
            border: '1px solid #333'
          }}>
            <h3 style={{ 
              color: '#AC2000',
              marginBottom: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø­Ø³Ø§Ø¨
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {payslipDetails.breakdown.base_salary && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>Ø§Ù„Ø±Ø§ØªØ¨ Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ</div>
                  <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                    {formatCurrency(payslipDetails.breakdown.base_salary)}
                  </div>
                </div>
              )}
              {payslipDetails.breakdown.allowances && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø¨Ø¯Ù„Ø§Øª</div>
                  <div style={{ color: '#AC2000', fontSize: '16px', fontWeight: 'bold' }}>
                    {formatCurrency(
                      (payslipDetails.breakdown.allowances?.housing || 0) + 
                      (payslipDetails.breakdown.allowances?.transportation || 0)
                    )}
                  </div>
                </div>
              )}
              {payslipDetails.breakdown.fixed_deductions && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>Ø§Ù„Ø®ØµÙˆÙ…Ø§Øª Ø§Ù„Ø«Ø§Ø¨ØªØ©</div>
                  <div style={{ color: '#dc3545', fontSize: '16px', fontWeight: 'bold' }}>
                    {formatCurrency(payslipDetails.breakdown.fixed_deductions?.social_insurance || 0)}
                  </div>
                </div>
              )}
              {payslipDetails.breakdown.calculation_details && (
                <>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø£ÙŠØ§Ù… Ø§Ù„Ø¹Ù…Ù„</div>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                      {payslipDetails.breakdown.calculation_details.total_work_days || 0}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>Ø£ÙŠØ§Ù… Ø§Ù„Ø­Ø¶ÙˆØ±</div>
                    <div style={{ color: '#AC2000', fontSize: '16px', fontWeight: 'bold' }}>
                      {payslipDetails.breakdown.calculation_details.attended_days || 0}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>Ø£ÙŠØ§Ù… Ø§Ù„ØºÙŠØ§Ø¨</div>
                    <div style={{ color: '#dc3545', fontSize: '16px', fontWeight: 'bold' }}>
                      {payslipDetails.breakdown.calculation_details.absent_days || 0}
                    </div>
                  </div>
                  {payslipDetails.breakdown.calculation_details.absence_deduction && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '4px' }}>Ø®ØµÙ… Ø§Ù„ØºÙŠØ§Ø¨</div>
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


