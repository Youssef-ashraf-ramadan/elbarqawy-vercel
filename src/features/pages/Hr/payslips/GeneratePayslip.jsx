import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { generatePayslip, getEmployees, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const GeneratePayslip = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employees, isLoading, error, success } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    employee_id: '',
    year: '',
    month: ''
  });

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      navigate('/payslips');
    }
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [success, error, dispatch, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.employee_id) {
      toast.error('ÙŠØ±Ø¬Ù‰ Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ù…ÙˆØ¸Ù', { rtl: true });
      return;
    }
    
    if (!formData.year) {
      toast.error('ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø§Ù„Ø³Ù†Ø©', { rtl: true });
      return;
    }


    const payslipData = {
      employee_id: parseInt(formData.employee_id),
      year: parseInt(formData.year),
      month: parseInt(formData.month)
    };

    dispatch(generatePayslip(payslipData));
  };


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
            ØªÙˆÙ„ÙŠØ¯ ÙƒØ´Ù Ø±Ø§ØªØ¨
          </h1>
        </div>
      </div>

      {/* Ø§Ù„Ù†Ù…ÙˆØ°Ø¬ */}
      <div style={{
        backgroundColor: '#202938',
        borderRadius: '12px',
        padding: '30px',
        border: '1px solid #333',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <form onSubmit={handleSubmit}>
          {/* Ø§Ù„Ù…ÙˆØ¸Ù */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'white',
              fontWeight: '500'
            }}>
              Ø§Ù„Ù…ÙˆØ¸Ù *
            </label>
            <select
              name="employee_id"
              value={formData.employee_id}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px 15px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px'
              }}
            >
              <option value="" style={{ backgroundColor: '#1a1f2e' }}>Ø§Ø®ØªØ± Ø§Ù„Ù…ÙˆØ¸Ù</option>
              {employees?.map(employee => (
                <option key={employee.id} value={employee.id} style={{ backgroundColor: '#1a1f2e' }}>
                  {employee.name} - {employee.employee_code}
                </option>
              ))}
            </select>
          </div>

          {/* Ø§Ù„Ø³Ù†Ø© */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'white',
              fontWeight: '500'
            }}>
              Ø§Ù„Ø³Ù†Ø© *
            </label>
            <input
              type="month"
              name="year"
              value={formData.year ? `${formData.year}-${formData.month?.padStart(2, '0') || '01'}` : ''}
              onChange={(e) => {
                const [year, month] = e.target.value.split('-');
                setFormData(prev => ({
                  ...prev,
                  year: year,
                  month: month
                }));
              }}
              style={{
                width: '100%',
                padding: '12px 15px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px'
              }}
              className="month-input-white"
            />
          </div>


          {/* Ø£Ø²Ø±Ø§Ø± Ø§Ù„Ø¥Ø¬Ø±Ø§Ø¡ */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate('/payslips')}
              style={{
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Ø¥Ù„ØºØ§Ø¡
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: isLoading ? '#666' : '#AC2000',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              {isLoading ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªÙˆÙ„ÙŠØ¯...' : 'ØªÙˆÙ„ÙŠØ¯ ÙƒØ´Ù Ø§Ù„Ø±Ø§ØªØ¨'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratePayslip;


