import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAttendance, checkIn, checkOut, getEmployees, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaSearch, FaEdit, FaTrash, FaEye, FaSignInAlt, FaSignOutAlt, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Attendance = () => {
  const dispatch = useDispatch();
  const { attendance, attendancePagination, employees, isLoading, error, success } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [checkInData, setCheckInData] = useState({ employee_id: '', check_in_notes: '' });
  const [checkOutData, setCheckOutData] = useState({ employee_id: '', check_out_notes: '' });

  useEffect(() => {
    dispatch(getAttendance());
    dispatch(getEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      setShowCheckInModal(false);
      setShowCheckOutModal(false);
      setCheckInData({ employee_id: '', check_in_notes: '' });
      setCheckOutData({ employee_id: '', check_out_notes: '' });
    }
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [success, error, dispatch]);

  const filteredData = attendance?.filter(record => 
    record.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employee?.employee_code?.includes(searchTerm)
  ) || [];

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    dispatch(getAttendance({ page }));
  };

  const handleCheckIn = async () => {
    if (!checkInData.employee_id) {
      toast.error('ÙŠØ±Ø¬Ù‰ Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ù…ÙˆØ¸Ù', { rtl: true });
      return;
    }
    try {
      await dispatch(checkIn(checkInData)).unwrap();
      // ØªØ­Ø¯ÙŠØ« Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø¨Ø¹Ø¯ Ø§Ù„Ù†Ø¬Ø§Ø­
      dispatch(getAttendance({ page: currentPage }));
    } catch (error) {
      // Ø³ÙŠØªÙ… Ø§Ù„ØªØ¹Ø§Ù…Ù„ Ù…Ø¹ Ø§Ù„Ø®Ø·Ø£ ÙÙŠ useEffect
    }
  };

  const handleCheckOut = async () => {
    if (!checkOutData.employee_id) {
      toast.error('ÙŠØ±Ø¬Ù‰ Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ù…ÙˆØ¸Ù', { rtl: true });
      return;
    }
    try {
      await dispatch(checkOut(checkOutData)).unwrap();
      // ØªØ­Ø¯ÙŠØ« Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø¨Ø¹Ø¯ Ø§Ù„Ù†Ø¬Ø§Ø­
      dispatch(getAttendance({ page: currentPage }));
    } catch (error) {
      // Ø³ÙŠØªÙ… Ø§Ù„ØªØ¹Ø§Ù…Ù„ Ù…Ø¹ Ø§Ù„Ø®Ø·Ø£ ÙÙŠ useEffect
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return '#AC2000';
      case 'absent':
        return '#dc3545';
      case 'late':
        return '#ffc107';
      default:
        return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present':
        return 'Ø­Ø§Ø¶Ø±';
      case 'absent':
        return 'ØºØ§Ø¦Ø¨';
      case 'late':
        return 'Ù…ØªØ£Ø®Ø±';
      default:
        return 'ØºÙŠØ± Ù…Ø­Ø¯Ø¯';
    }
  };

  return (
    <div style={{ 
      padding: '30px',
      backgroundColor: '#121828',
      minHeight: 'calc(100vh - 80px)',
      color: 'white'
    }}>
      {/* Ø§Ù„Ø¹Ù†ÙˆØ§Ù† ÙˆØ§Ù„Ø¨Ø­Ø« */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: 'white',
          margin: 0
        }}>
          Ø§Ù„Ø­Ø¶ÙˆØ± ÙˆØ§Ù„Ø§Ù†ØµØ±Ø§Ù
        </h1>

        {/* Ø£Ø²Ø±Ø§Ø± ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ ÙˆØ§Ù„Ø®Ø±ÙˆØ¬ */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowCheckInModal(true)}
            style={{
              backgroundColor: '#AC2000',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaSignInAlt />
            ØªØ³Ø¬ÙŠÙ„ Ø­Ø¶ÙˆØ±
          </button>
          
          <button
            onClick={() => setShowCheckOutModal(true)}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
          display: 'flex', 
          alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaSignOutAlt />
            ØªØ³Ø¬ÙŠÙ„ Ø§Ù†ØµØ±Ø§Ù
          </button>
        </div>
      </div>

      {/* Ø´Ø±ÙŠØ· Ø§Ù„Ø¨Ø­Ø« */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
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
            placeholder="Ø¨Ø­Ø« Ø¹Ù† Ø§Ù„Ù…ÙˆØ¸Ù..."
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
      </div>

      {/* Ø¬Ø¯ÙˆÙ„ Ø§Ù„Ø­Ø¶ÙˆØ± ÙˆØ§Ù„Ø§Ù†ØµØ±Ø§Ù */}
      <div style={{
        backgroundColor: '#202938',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #333'
      }}>
       

        {isLoading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            color: 'white'
          }}>
            <div>Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ­Ù…ÙŠÙ„...</div>
          </div>
        ) : filteredData && filteredData.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
              minWidth: '1200px'
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
                    Ø§Ù„Ù…ÙˆØ¸Ù
                </th>
                <th style={{ 
                  padding: '15px', 
                    textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                    fontSize: '16px',
                  borderBottom: '1px solid #333'
                }}>
                    ØªØ§Ø±ÙŠØ® Ø§Ù„Ø¹Ù…Ù„
                </th>
                <th style={{ 
                  padding: '15px', 
                    textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                    fontSize: '16px',
                  borderBottom: '1px solid #333'
                }}>
                    ÙˆÙ‚Øª Ø§Ù„Ø¯Ø®ÙˆÙ„
                </th>
                <th style={{ 
                  padding: '15px', 
                    textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                    fontSize: '16px',
                  borderBottom: '1px solid #333'
                }}>
                    ÙˆÙ‚Øª Ø§Ù„Ø®Ø±ÙˆØ¬
                </th>
                <th style={{ 
                  padding: '15px', 
                    textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                    fontSize: '16px',
                  borderBottom: '1px solid #333'
                }}>
                    Ø§Ù„Ù…Ù„Ø§Ø­Ø¸Ø§Øª
                </th>
                <th style={{ 
                  padding: '15px', 
                    textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                    fontSize: '16px',
                  borderBottom: '1px solid #333'
                }}>
                  Ø§Ù„Ø­Ø§Ù„Ø©
                </th>
              </tr>
            </thead>
            <tbody>
                {filteredData.map((record, index) => (
                  <tr key={record.id} style={{ 
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
                        <div style={{ fontWeight: 'bold' }}>{record.employee?.name}</div>
                        <div style={{ fontSize: '12px', color: '#ccc' }}>{record.employee?.employee_code}</div>
                      </div>
                  </td>
                  <td style={{ 
                    padding: '15px', 
                      textAlign: 'center',
                      color: 'white'
                  }}>
                      {formatDate(record.work_date)}
                  </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: 'white'
                    }}>
                      {record.check_in ? formatTime(record.check_in) : '-'}
                  </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: 'white'
                    }}>
                      {record.check_out ? formatTime(record.check_out) : '-'}
                  </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: 'white'
                    }}>
                      <div style={{ textAlign: 'right', fontSize: '12px' }}>
                        {record.notes ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {record.notes.split('\n').map((note, index) => {
                              const isCheckout = note.includes('Checkout');
                              const noteText = isCheckout ? note.replace('Checkout Notes: ', '') : note;
                              return (
                                <div 
                                  key={index} 
                                  className="attendance-note-card"
                                  style={{ 
                                    position: 'relative',
                                    marginBottom: '8px',
                                    padding: '12px 16px',
                                    backgroundColor: isCheckout ? 'rgba(220, 53, 69, 0.1)' : 'rgba(172, 32, 0, 0.1)',
                                    border: `2px solid ${isCheckout ? '#dc3545' : '#AC2000'}`,
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                                    backdropFilter: 'blur(10px)'
                                  }}
                                >
                                  {/* Ø£ÙŠÙ‚ÙˆÙ†Ø© */}
                                  <div 
                                    className="note-icon"
                                    style={{
                                      position: 'absolute',
                                      top: '-8px',
                                      right: '12px',
                                      width: '20px',
                                      height: '20px',
                                      backgroundColor: isCheckout ? '#dc3545' : '#AC2000',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '10px',
                                      color: 'white',
                                      fontWeight: 'bold',
                                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                                      transition: 'transform 0.3s ease'
                                    }}
                                  >
                                    {isCheckout ? 'â†©' : 'âœ“'}
                                  </div>
                                  
                                  {/* Ù†ÙˆØ¹ Ø§Ù„Ù…Ù„Ø§Ø­Ø¸Ø© */}
                                  <div style={{
                                    color: isCheckout ? '#dc3545' : '#AC2000',
                                    fontWeight: 'bold',
                                    marginBottom: '4px',
                                    fontSize: '11px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                  }}>
                                    {isCheckout ? 'Ù…Ù„Ø§Ø­Ø¸Ø© Ø§Ù†ØµØ±Ø§Ù:' : 'Ù…Ù„Ø§Ø­Ø¸Ø© Ø­Ø¶ÙˆØ±:'}
                                  </div>
                                  
                                  {/* Ù†Øµ Ø§Ù„Ù…Ù„Ø§Ø­Ø¸Ø© */}
                                  <div style={{
                                    color: 'white',
                                    lineHeight: '1.4',
                                    wordBreak: 'break-word',
                                    fontSize: '11px'
                                  }}>
                                    {noteText}
                                  </div>
                                  
                                  {/* Ø®Ø· Ø²Ù…Ù†ÙŠ */}
                                  <div 
                                    className="note-timeline"
                                    style={{
                                      position: 'absolute',
                                      bottom: '0',
                                      left: '0',
                                      right: '0',
                                      height: '2px',
                                      background: `linear-gradient(90deg, ${isCheckout ? '#dc3545' : '#AC2000'}, transparent)`,
                                      borderRadius: '0 0 12px 12px',
                                      transition: 'opacity 0.3s ease'
                                    }}
                                  ></div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div style={{
                            padding: '20px',
                            textAlign: 'center',
                            color: '#666',
                            fontSize: '14px',
                            fontStyle: 'italic'
                          }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              margin: '0 auto 8px',
                              backgroundColor: '#333',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '18px'
                            }}>
                              ðŸ“
                            </div>
                            Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ù„Ø§Ø­Ø¸Ø§Øª
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center'
                    }}>
                      <span style={{
                        backgroundColor: getStatusColor(record.status),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        minWidth: '80px',
                        display: 'inline-block'
                      }}>
                        {getStatusText(record.status)}
                    </span>
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
            Ù„Ø§ ØªÙˆØ¬Ø¯ Ø³Ø¬Ù„Ø§Øª Ø­Ø¶ÙˆØ± ÙˆØ§Ù†ØµØ±Ø§Ù
          </div>
        )}

        {/* Ø§Ù„Ø¨Ø§Ø¬ÙŠÙ†ÙŠØ´Ù† */}
        {attendancePagination && attendancePagination.last_page > 1 && (
          <div style={{
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            borderTop: '1px solid #333',
            flexWrap: 'wrap'
          }}>
            {/* Ø²Ø± Ø§Ù„Ø³Ø§Ø¨Ù‚ */}
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
              Ø§Ù„Ø³Ø§Ø¨Ù‚
            </button>

            {/* Ø£Ø±Ù‚Ø§Ù… Ø§Ù„ØµÙØ­Ø§Øª */}
            {Array.from({ length: attendancePagination.last_page }, (_, i) => i + 1).map(page => {
              if (page === 1 || page === attendancePagination.last_page || 
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

            {/* Ø²Ø± Ø§Ù„ØªØ§Ù„ÙŠ */}
                      <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === attendancePagination.last_page}
              style={{
                padding: '8px 12px',
                margin: '0 2px',
                backgroundColor: currentPage === attendancePagination.last_page ? '#666' : '#AC2000',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === attendancePagination.last_page ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              Ø§Ù„ØªØ§Ù„ÙŠ
            </button>
          </div>
        )}
      </div>

      {/* Modal ØªØ³Ø¬ÙŠÙ„ Ø­Ø¶ÙˆØ± */}
      {showCheckInModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#202938',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid #333',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px' }}>ØªØ³Ø¬ÙŠÙ„ Ø­Ø¶ÙˆØ±</h3>
            
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
                value={checkInData.employee_id}
                onChange={(e) => setCheckInData({...checkInData, employee_id: e.target.value})}
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'white',
                fontWeight: '500'
              }}>
                Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø§Ù„Ø­Ø¶ÙˆØ±
              </label>
              <textarea
                value={checkInData.check_in_notes}
                onChange={(e) => setCheckInData({...checkInData, check_in_notes: e.target.value})}
                placeholder="Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø­ÙˆÙ„ Ø§Ù„Ø­Ø¶ÙˆØ±..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  backgroundColor: '#1a1f2e',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button
                onClick={() => setShowCheckInModal(false)}
                        style={{
                          backgroundColor: '#666',
                          color: 'white',
                          border: 'none',
                  padding: '10px 20px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                Ø¥Ù„ØºØ§Ø¡
                      </button>
                      <button
                onClick={handleCheckIn}
                disabled={isLoading}
                        style={{
                  backgroundColor: isLoading ? '#666' : '#AC2000',
                          color: 'white',
                          border: 'none',
                  padding: '10px 20px',
                          borderRadius: '6px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: isLoading ? 0.6 : 1
                        }}
                      >
                {isLoading ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ³Ø¬ÙŠÙ„...' : 'ØªØ³Ø¬ÙŠÙ„ Ø­Ø¶ÙˆØ±'}
                      </button>
                    </div>
          </div>
        </div>
      )}

      {/* Modal ØªØ³Ø¬ÙŠÙ„ Ø§Ù†ØµØ±Ø§Ù */}
      {showCheckOutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#202938',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid #333',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px' }}>ØªØ³Ø¬ÙŠÙ„ Ø§Ù†ØµØ±Ø§Ù</h3>
            
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
                value={checkOutData.employee_id}
                onChange={(e) => setCheckOutData({...checkOutData, employee_id: e.target.value})}
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'white',
                fontWeight: '500'
              }}>
                Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø§Ù„Ø§Ù†ØµØ±Ø§Ù
              </label>
              <textarea
                value={checkOutData.check_out_notes}
                onChange={(e) => setCheckOutData({...checkOutData, check_out_notes: e.target.value})}
                placeholder="Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø­ÙˆÙ„ Ø§Ù„Ø§Ù†ØµØ±Ø§Ù..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  backgroundColor: '#1a1f2e',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowCheckOutModal(false)}
                style={{
                  backgroundColor: '#666',
            color: 'white',
                  border: 'none',
                  padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
                }}
              >
                Ø¥Ù„ØºØ§Ø¡
          </button>
              <button
                onClick={handleCheckOut}
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? '#666' : '#dc3545',
            color: 'white',
                  border: 'none',
                  padding: '10px 20px',
            borderRadius: '6px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                {isLoading ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ³Ø¬ÙŠÙ„...' : 'ØªØ³Ø¬ÙŠÙ„ Ø§Ù†ØµØ±Ø§Ù'}
          </button>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;

