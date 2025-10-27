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
      toast.error('يرجى اختيار تاريخ البداية والنهاية', { rtl: true });
      return;
    }
    await dispatch(getLeaveReports(leaveDates));
  };

  const handleExportToExcel = () => {
    if (!leaveReports || !leaveReports.data || leaveReports.data.length === 0) {
      toast.error('لا توجد بيانات للتصدير', { rtl: true });
      return;
    }

    const data = leaveReports.data.map((item, index) => ({
      'المسلسل': index + 1,
      'الموظف': item.employee_name || 'غير متوفر',
      'القسم': item.department || 'غير متوفر',
      'نوع الإجازة': item.leave_type || 'غير متوفر',
      'تاريخ البداية': item.start_date || 'غير متوفر',
      'تاريخ النهاية': item.end_date || 'غير متوفر',
      'الحالة': item.status === 'approved' ? 'موافق عليه' : item.status === 'rejected' ? 'مرفوض' : item.status === 'pending' ? 'قيد الانتظار' : item.status || 'غير معروف'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'طلبات الإجازة');
    XLSX.writeFile(wb, `تقرير_طلبات_الاجازة_${leaveDates.start_date}_${leaveDates.end_date}.xlsx`);
    toast.success('تم تصدير الملف بنجاح', { rtl: true });
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
          تقرير طلبات الإجازة
        </h1>
      </div>

      {/* اختيار التاريخ */}
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
              تاريخ البداية
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
              تاريخ النهاية
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
              backgroundColor: isLoading ? '#666' : '#ec4899',
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
            {isLoading ? 'جاري التوليد...' : 'عرض التقرير'}
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
              تصدير Excel
            </button>
          )}
        </div>
      </div>

      {/* عرض النتائج */}
      {leaveReports && leaveReports.data && leaveReports.data.length > 0 && (
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
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '150px' }}>الموظف</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '200px' }}>القسم</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '150px' }}>نوع الإجازة</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '140px' }}>تاريخ البداية</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '140px' }}>تاريخ النهاية</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '140px' }}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {leaveReports.data.map((item, index) => (
                  <tr key={item.leave_request_id || index} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>{index + 1}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>{item.employee_name || 'غير متوفر'}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white', whiteSpace: 'normal', lineHeight: '1.5' }}>{item.department || 'غير متوفر'}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>{item.leave_type || 'غير متوفر'}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>
                      {item.start_date ? new Date(item.start_date).toLocaleDateString('ar-EG') : 'غير متوفر'}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>
                      {item.end_date ? new Date(item.end_date).toLocaleDateString('ar-EG') : 'غير متوفر'}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>
                      <span style={{
                        padding: '6px 18px',
                        borderRadius: '20px',
                        backgroundColor: item.status === 'approved' ? 'rgba(12, 173, 93, 0.2)' : item.status === 'rejected' ? 'rgba(220, 53, 69, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                        color: item.status === 'approved' ? '#0CAD5D' : item.status === 'rejected' ? '#dc3545' : '#ffc107',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.status === 'approved' ? 'موافق عليه' : item.status === 'rejected' ? 'مرفوض' : item.status === 'pending' ? 'قيد الانتظار' : item.status || 'غير معروف'}
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
  );
};

export default LeaveReport;

