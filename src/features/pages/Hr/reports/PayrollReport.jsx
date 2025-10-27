import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPayrollReports, clearError, clearReports } from '../../../../redux/Slices/authSlice';
import { FaCalendarAlt, FaFileExcel } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const PayrollReport = () => {
  const dispatch = useDispatch();
  const { payrollReports, isLoading, error } = useSelector((state) => state.auth);
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
    await dispatch(getPayrollReports({ year: year, month: month }));
  };

  const handleExportToExcel = () => {
    if (!payrollReports || !payrollReports.data || payrollReports.data.length === 0) {
      toast.error('لا توجد بيانات للتصدير', { rtl: true });
      return;
    }

    const data = payrollReports.data.map((item, index) => ({
      'المسلسل': index + 1,
      'الموظف': item.employee_name,
      'القسم': item.department,
      'الراتب الأساسي': parseFloat(item.base_salary),
      'البدلات': parseFloat(item.total_allowances),
      'الخصومات': parseFloat(item.total_deductions),
      'صافي الراتب': parseFloat(item.net_salary),
      'الحالة': item.status === 'generated' ? 'تم التوليد' : item.status || 'غير معروف'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'كشف الرواتب');
    XLSX.writeFile(wb, `كشف_الرواتب_${reportDate}.xlsx`);
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
          تقرير كشف الرواتب
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
              backgroundColor: isLoading ? '#666' : '#0CAD5D',
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
          {payrollReports && payrollReports.data && payrollReports.data.length > 0 && (
            <button
              onClick={handleExportToExcel}
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
              <FaFileExcel />
              تصدير Excel
            </button>
          )}
        </div>
      </div>

      {/* عرض النتائج */}
      {payrollReports && payrollReports.data && payrollReports.data.length > 0 && (
        <div style={{
          backgroundColor: '#202938',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #333'
        }}>
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #0CAD5D' }}>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '60px' }}>#</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '150px' }}>الموظف</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '200px' }}>القسم</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '150px' }}>الراتب الأساسي</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '130px' }}>البدلات</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '130px' }}>الخصومات</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '140px' }}>صافي الراتب</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '140px' }}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {payrollReports.data.map((item, index) => (
                  <tr key={item.employee_id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>{index + 1}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>{item.employee_name}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white', whiteSpace: 'normal', lineHeight: '1.5' }}>{item.department}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>
                      {parseFloat(item.base_salary).toLocaleString('ar-EG')} جنيه
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: '#0CAD5D' }}>
                      {parseFloat(item.total_allowances).toLocaleString('ar-EG')} جنيه
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: '#dc3545' }}>
                      {parseFloat(item.total_deductions).toLocaleString('ar-EG')} جنيه
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: '#0CAD5D', fontWeight: 'bold' }}>
                      {parseFloat(item.net_salary).toLocaleString('ar-EG')} جنيه
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'white' }}>
                      <span style={{
                        padding: '6px 18px',
                        borderRadius: '20px',
                        backgroundColor: item.status === 'generated' ? 'rgba(12, 173, 93, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                        color: item.status === 'generated' ? '#0CAD5D' : '#dc3545',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.status === 'generated' ? 'تم التوليد' : item.status || 'غير معروف'}
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

export default PayrollReport;

