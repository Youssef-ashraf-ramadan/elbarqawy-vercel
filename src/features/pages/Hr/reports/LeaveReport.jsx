import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getLeaveReports, clearError, clearReports } from '../../../../redux/Slices/authSlice';
import { FaCalendarAlt, FaFileExcel } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const LeaveReport = () => {
  const dispatch = useDispatch();
  const { leaveReports, isLoading, error } = useSelector((state) => state.auth);
  const [leaveDates, setLeaveDates] = useState({ start_date: '', end_date: '' });

  useEffect(() => {
    return () => {
      // Reset when component unmounts
      setLeaveDates({ start_date: '', end_date: '' });
      dispatch(clearReports());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleGenerateReport = async () => {
    if (!leaveDates.start_date || !leaveDates.end_date) {
      toast.error('ÙŠØ±Ø¬Ù‰ Ø§Ø®ØªÙŠØ§Ø± ØªØ§Ø±ÙŠØ® Ø§Ù„Ø¨Ø¯Ø§ÙŠØ© ÙˆØ§Ù„Ù†Ù‡Ø§ÙŠØ©', { rtl: true });
      return;
    }
    await dispatch(getLeaveReports(leaveDates));
  };

  const handleExportToExcel = () => {
    if (!leaveReports || !leaveReports.data || leaveReports.data.length === 0) {
      toast.error('Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¨ÙŠØ§Ù†Ø§Øª Ù„Ù„ØªØµØ¯ÙŠØ±', { rtl: true });
      return;
    }

    const data = leaveReports.data.map((item, index) => ({
      'Ø§Ù„Ù…Ø³Ù„Ø³Ù„': index + 1,
      'Ø§Ù„Ù…ÙˆØ¸Ù': item.employee_name || 'ØºÙŠØ± Ù…ØªÙˆÙØ±',
      'Ø§Ù„Ù‚Ø³Ù…': item.department || 'ØºÙŠØ± Ù…ØªÙˆÙØ±',
      'Ù†ÙˆØ¹ Ø§Ù„Ø¥Ø¬Ø§Ø²Ø©': item.leave_type || 'ØºÙŠØ± Ù…ØªÙˆÙØ±',
      'ØªØ§Ø±ÙŠØ® Ø§Ù„Ø¨Ø¯Ø§ÙŠØ©': item.start_date || 'ØºÙŠØ± Ù…ØªÙˆÙØ±',
      'ØªØ§Ø±ÙŠØ® Ø§Ù„Ù†Ù‡Ø§ÙŠØ©': item.end_date || 'ØºÙŠØ± Ù…ØªÙˆÙØ±',
      'Ø§Ù„Ø­Ø§Ù„Ø©': item.status === 'approved' ? 'Ù…ÙˆØ§ÙÙ‚ Ø¹Ù„ÙŠÙ‡' : item.status === 'rejected' ? 'Ù…Ø±ÙÙˆØ¶' : item.status === 'pending' ? 'Ù‚ÙŠØ¯ Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø±' : item.status || 'ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø¥Ø¬Ø§Ø²Ø©');
    XLSX.writeFile(wb, `ØªÙ‚Ø±ÙŠØ±_Ø·Ù„Ø¨Ø§Øª_Ø§Ù„Ø§Ø¬Ø§Ø²Ø©_${leaveDates.start_date}_${leaveDates.end_date}.xlsx`);
    toast.success('ØªÙ… ØªØµØ¯ÙŠØ± Ø§Ù„Ù…Ù„Ù Ø¨Ù†Ø¬Ø§Ø­', { rtl: true });
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
          ØªÙ‚Ø±ÙŠØ± Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø¥Ø¬Ø§Ø²Ø©
        </h1>
      </div>

      {/* Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„ØªØ§Ø±ÙŠØ® */}
      <div style={{
        backgroundColor: '#202938',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #333',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div>
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
                padding: '12px 15px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
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
                padding: '12px 15px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={handleGenerateReport}
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
              opacity: isLoading ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaCalendarAlt />
            {isLoading ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªÙˆÙ„ÙŠØ¯...' : 'Ø¹Ø±Ø¶ Ø§Ù„ØªÙ‚Ø±ÙŠØ±'}
          </button>
          {leaveReports && leaveReports.data && leaveReports.data.length > 0 && (
            <button
              onClick={handleExportToExcel}
              style={{
                backgroundColor: '#ec4899',
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
              <FaFileExcel />
              ØªØµØ¯ÙŠØ± Excel
            </button>
          )}
        </div>
      </div>

      {/* Ø¹Ø±Ø¶ Ø§Ù„Ù†ØªØ§Ø¦Ø¬ */}
      {leaveReports && leaveReports.data && leaveReports.data.length > 0 ? (
        <div style={{
          backgroundColor: '#202938',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #333'
        }}>
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ec4899' }}>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '60px' }}>#</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '150px' }}>Ø§Ù„Ù…ÙˆØ¸Ù</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '200px' }}>Ø§Ù„Ù‚Ø³Ù…</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '150px' }}>Ù†ÙˆØ¹ Ø§Ù„Ø¥Ø¬Ø§Ø²Ø©</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '140px' }}>ØªØ§Ø±ÙŠØ® Ø§Ù„Ø¨Ø¯Ø§ÙŠØ©</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '140px' }}>ØªØ§Ø±ÙŠØ® Ø§Ù„Ù†Ù‡Ø§ÙŠØ©</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '140px' }}>Ø§Ù„Ø­Ø§Ù„Ø©</th>
                </tr>
              </thead>
              <tbody>
                {leaveReports.data.map((item, index) => (
                  <tr key={item.leave_request_id || index} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>{index + 1}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>{item.employee_name || 'ØºÙŠØ± Ù…ØªÙˆÙØ±'}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white', whiteSpace: 'normal', lineHeight: '1.5' }}>{item.department || 'ØºÙŠØ± Ù…ØªÙˆÙØ±'}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>{item.leave_type || 'ØºÙŠØ± Ù…ØªÙˆÙØ±'}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>
                      {item.start_date ? new Date(item.start_date).toLocaleDateString('ar-EG') : 'ØºÙŠØ± Ù…ØªÙˆÙØ±'}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>
                      {item.end_date ? new Date(item.end_date).toLocaleDateString('ar-EG') : 'ØºÙŠØ± Ù…ØªÙˆÙØ±'}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>
                      <span style={{
                        padding: '6px 18px',
                        borderRadius: '20px',
                        backgroundColor: item.status === 'approved' ? 'rgba(172, 32, 0, 0.2)' : item.status === 'rejected' ? 'rgba(220, 53, 69, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                        color: item.status === 'approved' ? '#AC2000' : item.status === 'rejected' ? '#dc3545' : '#ffc107',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.status === 'approved' ? 'Ù…ÙˆØ§ÙÙ‚ Ø¹Ù„ÙŠÙ‡' : item.status === 'rejected' ? 'Ù…Ø±ÙÙˆØ¶' : item.status === 'pending' ? 'Ù‚ÙŠØ¯ Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø±' : item.status || 'ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : leaveReports && (!leaveReports.data || leaveReports.data.length === 0) && !isLoading ? (
        <div style={{
          backgroundColor: '#202938',
          borderRadius: '12px',
          padding: '40px',
          border: '1px solid #333',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '18px',
            color: '#888',
            fontWeight: '500'
          }}>
            Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¨ÙŠØ§Ù†Ø§Øª
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LeaveReport;


