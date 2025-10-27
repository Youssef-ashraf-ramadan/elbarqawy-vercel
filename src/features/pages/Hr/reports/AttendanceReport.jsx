import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAttendanceReports, clearError, clearReports } from '../../../../redux/Slices/authSlice';
import { FaCalendarAlt, FaFileExcel, FaClipboard } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const AttendanceReport = () => {
  const dispatch = useDispatch();
  const { attendanceReports, isLoading, error } = useSelector((state) => state.auth);
  const [reportDate, setReportDate] = useState('');

  useEffect(() => {
    return () => {
      // Reset when component unmounts
      setReportDate('');
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
    if (!reportDate) {
      toast.error('يرجى اختيار السنة والشهر', { rtl: true });
      return;
    }
    const [year, month] = reportDate.split('-');
    await dispatch(getAttendanceReports({ year: year, month: month }));
  };

  const handleExportToExcel = () => {
    if (!attendanceReports || !attendanceReports.data || attendanceReports.data.length === 0) {
      toast.error('لا توجد بيانات للتصدير', { rtl: true });
      return;
    }

    const data = attendanceReports.data
      .filter(item => !item.error) // Filter out items with errors
      .map((item, index) => ({
        'المسلسل': index + 1,
        'الموظف': item.employee_name || 'غير متوفر',
        'القسم': item.department || 'غير متوفر',
        'أيام الحضور': item.present_days || 0,
        'أيام الغياب': item.absent_days || 0,
        'أيام الإجازة': item.leave_days || 0,
        'إجمالي الأيام': item.total_work_days || 0
      }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الحضور والانصراف');
    XLSX.writeFile(wb, `تقرير_الحضور_${reportDate}.xlsx`);
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
          تقرير الحضور والانصراف
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
        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'white',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              السنة والشهر
            </label>
            <input
              type="month"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="month-input-white"
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
          <button
            onClick={handleGenerateReport}
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? '#666' : '#3b82f6',
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
          {attendanceReports && attendanceReports.data && attendanceReports.data.length > 0 && (
            <button
              onClick={handleExportToExcel}
              style={{
                backgroundColor: '#3b82f6',
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
      {attendanceReports && attendanceReports.data && attendanceReports.data.length > 0 && (
        <div style={{
          backgroundColor: '#202938',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #333'
        }}>
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #3b82f6' }}>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '60px' }}>#</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '150px' }}>الموظف</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '200px' }}>القسم</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '130px' }}>أيام الحضور</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '130px' }}>أيام الغياب</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '130px' }}>أيام الإجازة</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '140px' }}>إجمالي الأيام</th>
                </tr>
              </thead>
              <tbody>
                {attendanceReports.data
                  .filter(item => !item.error) // Filter out items with errors
                  .map((item, index) => (
                    <tr key={item.employee_id} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>{index + 1}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>{item.employee_name || 'غير متوفر'}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white', whiteSpace: 'normal', lineHeight: '1.5' }}>{item.department || 'غير متوفر'}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'center', color: '#0CAD5D', fontWeight: 'bold' }}>
                        {item.present_days || 0}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center', color: '#dc3545', fontWeight: 'bold' }}>
                        {item.absent_days || 0}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center', color: '#ffa500', fontWeight: 'bold' }}>
                        {item.leave_days || 0}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
                        {item.total_work_days || 0}
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

export default AttendanceReport;

