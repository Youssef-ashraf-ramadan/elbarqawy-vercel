import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getLeaveReports, getAttendanceReports, getPayrollReports, clearError } from '../../../../redux/Slices/authSlice';
import { FaSearch, FaCalendarAlt, FaClipboardList, FaFileInvoice } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Reports = () => {
  const dispatch = useDispatch();
  const { leaveReports, attendanceReports, payrollReports, isLoading, error } = useSelector((state) => state.auth);
  
  const [selectedReport, setSelectedReport] = useState(null);
  const [leaveDates, setLeaveDates] = useState({ start_date: '', end_date: '' });
  const [attendanceDate, setAttendanceDate] = useState('');
  const [payrollDate, setPayrollDate] = useState('');

  useEffect(() => {
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleLeaveReport = async () => {
    if (!leaveDates.start_date || !leaveDates.end_date) {
      toast.error('ÙŠØ±Ø¬Ù‰ Ø§Ø®ØªÙŠØ§Ø± ØªØ§Ø±ÙŠØ® Ø§Ù„Ø¨Ø¯Ø§ÙŠØ© ÙˆØ§Ù„Ù†Ù‡Ø§ÙŠØ©', { rtl: true });
      return;
    }
    await dispatch(getLeaveReports(leaveDates));
    setSelectedReport('leave');
  };

  const handleAttendanceReport = async () => {
    if (!attendanceDate) {
      toast.error('ÙŠØ±Ø¬Ù‰ Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ø³Ù†Ø© ÙˆØ§Ù„Ø´Ù‡Ø±', { rtl: true });
      return;
    }
    const [year, month] = attendanceDate.split('-');
    await dispatch(getAttendanceReports({ year: year, month: month }));
    setSelectedReport('attendance');
  };

  const handlePayrollReport = async () => {
    if (!payrollDate) {
      toast.error('ÙŠØ±Ø¬Ù‰ Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ø³Ù†Ø© ÙˆØ§Ù„Ø´Ù‡Ø±', { rtl: true });
      return;
    }
    const [year, month] = payrollDate.split('-');
    await dispatch(getPayrollReports({ year: year, month: month }));
    setSelectedReport('payroll');
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
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '20px'
        }}>
          Ø§Ù„ØªÙ‚Ø§Ø±ÙŠØ±
        </h1>
      </div>

      {/* Ø§Ù„ØªÙ‚Ø§Ø±ÙŠØ± */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* ØªÙ‚Ø±ÙŠØ± Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø¥Ø¬Ø§Ø²Ø© */}
        <div style={{
          backgroundColor: '#202938',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #333'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: 'rgba(236, 72, 153, 0.2)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#ec4899'
              }}>
                <FaCalendarAlt />
              </div>
              <h2 style={{ 
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>
                ØªÙ‚Ø±ÙŠØ± Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø¥Ø¬Ø§Ø²Ø©
              </h2>
            </div>
            <p style={{ color: '#ccc', fontSize: '14px', margin: 0 }}>
              ØªÙ‚Ø±ÙŠØ± Ø´Ø§Ù…Ù„ Ø¹Ù† Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø¥Ø¬Ø§Ø²Ø§Øª ÙÙŠ ÙØªØ±Ø© Ù…Ø­Ø¯Ø¯Ø©
            </p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'white',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ØªØ§Ø±ÙŠØ® Ø§Ù„Ø¨Ø¯Ø§ÙŠØ©
            </label>
            <input
              type="date"
              value={leaveDates.start_date}
              onChange={(e) => setLeaveDates({ ...leaveDates, start_date: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px',
                marginBottom: '15px'
              }}
            />
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'white',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ØªØ§Ø±ÙŠØ® Ø§Ù„Ù†Ù‡Ø§ÙŠØ©
            </label>
            <input
              type="date"
              value={leaveDates.end_date}
              onChange={(e) => setLeaveDates({ ...leaveDates, end_date: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            onClick={handleLeaveReport}
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#666' : '#ec4899',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªÙˆÙ„ÙŠØ¯...' : 'Ø¹Ø±Ø¶ Ø§Ù„ØªÙ‚Ø±ÙŠØ±'}
          </button>
        </div>

        {/* ØªÙ‚Ø±ÙŠØ± Ø§Ù„Ø­Ø¶ÙˆØ± ÙˆØ§Ù„Ø§Ù†ØµØ±Ø§Ù */}
        <div style={{
          backgroundColor: '#202938',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #333'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#3b82f6'
              }}>
                <FaClipboardList />
              </div>
              <h2 style={{ 
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>
                ØªÙ‚Ø±ÙŠØ± Ø§Ù„Ø­Ø¶ÙˆØ± ÙˆØ§Ù„Ø§Ù†ØµØ±Ø§Ù
              </h2>
            </div>
            <p style={{ color: '#ccc', fontSize: '14px', margin: 0 }}>
              ØªÙ‚Ø±ÙŠØ± ØªÙØµÙŠÙ„ÙŠ Ø¹Ù† Ø§Ù„Ø­Ø¶ÙˆØ± ÙˆØ§Ù„ØºÙŠØ§Ø¨ Ù„Ø´Ù‡Ø± Ù…Ø­Ø¯Ø¯
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'white',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Ø§Ù„Ø³Ù†Ø© ÙˆØ§Ù„Ø´Ù‡Ø±
            </label>
            <input
              type="month"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="month-input-white"
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            onClick={handleAttendanceReport}
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#666' : '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªÙˆÙ„ÙŠØ¯...' : 'Ø¹Ø±Ø¶ Ø§Ù„ØªÙ‚Ø±ÙŠØ±'}
          </button>
        </div>

        {/* ØªÙ‚Ø±ÙŠØ± ÙƒØ´Ù Ø§Ù„Ø±Ø§ØªØ¨ */}
        <div style={{
          backgroundColor: '#202938',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #333'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: 'rgba(172, 32, 0, 0.2)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#AC2000'
              }}>
                <FaFileInvoice />
              </div>
              <h2 style={{ 
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>
                ØªÙ‚Ø±ÙŠØ± ÙƒØ´Ù Ø§Ù„Ø±Ø§ØªØ¨
              </h2>
            </div>
            <p style={{ color: '#ccc', fontSize: '14px', margin: 0 }}>
              ØªÙ‚Ø±ÙŠØ± Ø´Ø§Ù…Ù„ Ø¹Ù† ÙƒØ´ÙˆÙ Ø§Ù„Ø±ÙˆØ§ØªØ¨ Ù„Ø´Ù‡Ø± Ù…Ø­Ø¯Ø¯
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'white',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Ø§Ù„Ø³Ù†Ø© ÙˆØ§Ù„Ø´Ù‡Ø±
            </label>
            <input
              type="month"
              value={payrollDate}
              onChange={(e) => setPayrollDate(e.target.value)}
              className="month-input-white"
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            onClick={handlePayrollReport}
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#666' : '#AC2000',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªÙˆÙ„ÙŠØ¯...' : 'Ø¹Ø±Ø¶ Ø§Ù„ØªÙ‚Ø±ÙŠØ±'}
          </button>
        </div>
      </div>

      {/* Ø¹Ø±Ø¶ Ø§Ù„Ù†ØªØ§Ø¦Ø¬ */}
      {selectedReport && (
        <div style={{
          marginTop: '30px',
          backgroundColor: '#202938',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #333'
        }}>
          <h3 style={{ 
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '20px'
          }}>
            Ù†ØªØ§Ø¦Ø¬ Ø§Ù„ØªÙ‚Ø±ÙŠØ±
          </h3>
          
          {selectedReport === 'leave' && leaveReports && (
            <div style={{ color: 'white' }}>
              <div style={{ 
                backgroundColor: '#1a1f2e',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #333',
                overflow: 'auto',
                maxHeight: '500px'
              }}>
                <pre style={{ 
                  color: 'white', 
                  fontSize: '12px', 
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                  fontFamily: 'Courier New, monospace'
                }}>
                  {JSON.stringify(leaveReports, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {selectedReport === 'attendance' && attendanceReports && (
            <div style={{ color: 'white' }}>
              <div style={{ 
                backgroundColor: '#1a1f2e',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #333',
                overflow: 'auto',
                maxHeight: '500px'
              }}>
                <pre style={{ 
                  color: 'white', 
                  fontSize: '12px', 
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                  fontFamily: 'Courier New, monospace'
                }}>
                  {JSON.stringify(attendanceReports, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {selectedReport === 'payroll' && payrollReports && payrollReports.data && payrollReports.data.length > 0 && (
            <div style={{ color: 'white' }}>
              <div style={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #AC2000' }}>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>#</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Ø§Ù„Ù…ÙˆØ¸Ù</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Ø§Ù„Ù‚Ø³Ù…</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Ø§Ù„Ø±Ø§ØªØ¨ Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Ø§Ù„Ø¨Ø¯Ù„Ø§Øª</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Ø§Ù„Ø®ØµÙˆÙ…Ø§Øª</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>ØµØ§ÙÙŠ Ø§Ù„Ø±Ø§ØªØ¨</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Ø§Ù„Ø­Ø§Ù„Ø©</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollReports.data.map((item, index) => (
                      <tr key={item.employee_id} style={{ borderBottom: '1px solid #333' }}>
                        <td style={{ padding: '12px', textAlign: 'center', color: 'white' }}>{index + 1}</td>
                        <td style={{ padding: '12px', textAlign: 'center', color: 'white' }}>{item.employee_name}</td>
                        <td style={{ padding: '12px', textAlign: 'center', color: 'white' }}>{item.department}</td>
                        <td style={{ padding: '12px', textAlign: 'center', color: 'white' }}>
                          {parseFloat(item.base_salary).toLocaleString('ar-EG')} Ø¬Ù†ÙŠÙ‡
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#AC2000' }}>
                          {parseFloat(item.total_allowances).toLocaleString('ar-EG')} Ø¬Ù†ÙŠÙ‡
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#dc3545' }}>
                          {parseFloat(item.total_deductions).toLocaleString('ar-EG')} Ø¬Ù†ÙŠÙ‡
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#AC2000', fontWeight: 'bold' }}>
                          {parseFloat(item.net_salary).toLocaleString('ar-EG')} Ø¬Ù†ÙŠÙ‡
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', color: 'white' }}>
                          <span style={{
                            padding: '5px 15px',
                            borderRadius: '20px',
                            backgroundColor: item.status === 'generated' ? 'rgba(172, 32, 0, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                            color: item.status === 'generated' ? '#AC2000' : '#dc3545',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {item.status === 'generated' ? 'ØªÙ… Ø§Ù„ØªÙˆÙ„ÙŠØ¯' : item.status || 'ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;


