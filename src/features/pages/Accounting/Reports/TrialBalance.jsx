import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  getTrialBalance,
  clearTrialBalance,
  clearError,
  clearSuccess,
} from '../../../../redux/Slices/authSlice';

const TrialBalance = () => {
  const dispatch = useDispatch();
  const {
    trialBalance,
    trialBalanceFilters,
    isLoading,
    error,
    success,
  } = useSelector((state) => state.auth);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeZero, setIncludeZero] = useState(false);
  const lastErrorRef = useRef({ message: null, time: 0 });
  const lastSuccessRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getTrialBalance({}));
    return () => {
      dispatch(clearTrialBalance());
    };
  }, [dispatch]);

  useEffect(() => {
    if (trialBalanceFilters) {
      setStartDate(trialBalanceFilters.start_date || '');
      setEndDate(trialBalanceFilters.end_date || '');
      const includeFlag = trialBalanceFilters.include_zero_balance;
      setIncludeZero(
        includeFlag !== undefined &&
          includeFlag !== null &&
          String(includeFlag).toLowerCase() === 'true'
      );
    }
  }, [trialBalanceFilters]);

  useEffect(() => {
    if (success) {
      const now = Date.now();
      const last = lastSuccessRef.current;
      if (!last.message || last.message !== success || now - last.time > 2000) {
        toast.success(success, { rtl: true });
        lastSuccessRef.current = { message: success, time: now };
      }
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      const now = Date.now();
      const last = lastErrorRef.current;
      if (!last.message || last.message !== error || now - last.time > 2000) {
        toast.error(error, { rtl: true });
        lastErrorRef.current = { message: error, time: now };
      }
      setTimeout(() => dispatch(clearError()), 2500);
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {
      ...(startDate ? { start_date: startDate } : {}),
      ...(endDate ? { end_date: endDate } : {}),
      ...(includeZero ? { include_zero_balance: 'true' } : {}),
    };
    dispatch(getTrialBalance(params));
  };

  const formattedTree = useMemo(() => {
    const data = trialBalance?.tree;
    return Array.isArray(data) ? data : [];
  }, [trialBalance]);

  const totals = trialBalance?.totals || null;
  const meta = trialBalance?.meta || null;

  const hasChildren = (node) => Array.isArray(node.children) && node.children.length > 0;

  const valueFormatter = (value) =>
    Number(value ?? 0).toLocaleString('ar-EG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const cellStyle = {
    padding: '12px 10px',
    textAlign: 'center',
    color: '#f8fafc',
    fontSize: '14px',
    borderBottom: '1px solid #2f3b4f',
  };

  const footerCellStyle = {
    padding: '16px 12px',
    textAlign: 'center',
    color: '#f8fafc',
    fontSize: '15px',
    fontWeight: 700,
    borderTop: '2px solid #AC2000',
  };

  const columnsMeta = [
    { label: 'كود الحساب', minWidth: '130px', align: 'center' },
    { label: 'الحساب', minWidth: '220px', align: 'right' },
    { label: 'رصيد افتتاحي مدين', minWidth: '170px', align: 'center' },
    { label: 'رصيد افتتاحي دائن', minWidth: '170px', align: 'center' },
    { label: 'حركة الفترة مدين', minWidth: '160px', align: 'center' },
    { label: 'حركة الفترة دائن', minWidth: '160px', align: 'center' },
    { label: 'إجمالي مدين', minWidth: '150px', align: 'center' },
    { label: 'إجمالي دائن', minWidth: '150px', align: 'center' },
    { label: 'رصيد ختامي مدين', minWidth: '160px', align: 'center' },
    { label: 'رصيد ختامي دائن', minWidth: '160px', align: 'center' },
  ];

  const renderRows = (nodes, depth = 0, parentKey = 'root') => {
    if (!Array.isArray(nodes)) return null;
    return nodes.map((node, index) => {
      const nodeId =
        node.id !== undefined && node.id !== null
          ? String(node.id)
          : `${parentKey}-${index}`;
      const children = hasChildren(node);
      const rowBg = depth % 2 === 0 ? '#1c2435' : '#202b3b';

      return (
        <React.Fragment key={`${nodeId}-${depth}`}>
          <tr style={{ backgroundColor: rowBg }}>
            <td style={{ ...cellStyle, minWidth: columnsMeta[0].minWidth }}>
              {node.code || '---'}
            </td>
            <td
              style={{
                ...cellStyle,
                textAlign: 'right',
                minWidth: columnsMeta[1].minWidth,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: depth * 18 }} />
                {children ? (
                  <FaChevronDown style={{ color: '#AC2000' }} />
                ) : (
                  <span style={{ width: 16 }} />
                )}
                <span>{node.name_ar || node.name_en || '---'}</span>
              </div>
            </td>
            <td style={{ ...cellStyle, minWidth: columnsMeta[2].minWidth }}>
              {valueFormatter(node.opening_debit)}
            </td>
            <td style={{ ...cellStyle, minWidth: columnsMeta[3].minWidth }}>
              {valueFormatter(node.opening_credit)}
            </td>
            <td style={{ ...cellStyle, minWidth: columnsMeta[4].minWidth }}>
              {valueFormatter(node.period_debit)}
            </td>
            <td style={{ ...cellStyle, minWidth: columnsMeta[5].minWidth }}>
              {valueFormatter(node.period_credit)}
            </td>
            <td style={{ ...cellStyle, minWidth: columnsMeta[6].minWidth }}>
              {valueFormatter(node.total_debit)}
            </td>
            <td style={{ ...cellStyle, minWidth: columnsMeta[7].minWidth }}>
              {valueFormatter(node.total_credit)}
            </td>
            <td style={{ ...cellStyle, minWidth: columnsMeta[8].minWidth }}>
              {valueFormatter(node.closing_debit)}
            </td>
            <td style={{ ...cellStyle, minWidth: columnsMeta[9].minWidth }}>
              {valueFormatter(node.closing_credit)}
            </td>
          </tr>
          {children && renderRows(node.children, depth + 1, nodeId)}
        </React.Fragment>
      );
    });
  };


  return (
    <div
      style={{
        padding: '30px',
        backgroundColor: '#121828',
        minHeight: 'calc(100vh - 80px)',
        color: 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>ميزان المراجعة</h1>
          {meta && (
            <div style={{ marginTop: '8px', fontSize: '14px', color: '#cbd5f5' }}>
              الفترة: {meta.start_date || '---'} إلى {meta.end_date || '---'}
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#202938',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          display: 'grid',
          gap: '16px',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>
              تاريخ البداية
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>
              تاريخ النهاية
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '18px',
              flexWrap: 'wrap',
            }}
          >
            <input
              id="includeZero"
              type="checkbox"
              checked={includeZero}
              onChange={(e) => setIncludeZero(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="includeZero" style={{ fontSize: '14px' }}>
              إظهار الحسابات ذات الأرصدة الصفرية
            </label>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setStartDate('');
              setEndDate('');
              setIncludeZero(false);
              dispatch(getTrialBalance({}));
            }}
            style={{
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
            }}
          >
            إعادة تعيين
          </button>
          <button
            type="submit"
            style={{
              backgroundColor: '#AC2000',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
            }}
          >
            تطبيق
          </button>
        </div>
      </form>

      <div
        style={{
          backgroundColor: '#202938',
          border: '1px solid #333',
          borderRadius: '12px',
          overflowX: 'auto',
          marginBottom: '24px',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            minWidth: '100%',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#AC2000', color: '#fff' }}>
              {columnsMeta.map((col) => (
                <th
                  key={col.label}
                  style={{
                    padding: '18px 16px',
                    textAlign: col.align || 'center',
                    fontSize: '14px',
                    borderBottom: '1px solid #333',
                    minWidth: col.minWidth,
                    whiteSpace: col.align === 'right' ? 'nowrap' : 'normal',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                  جاري التحميل...
                </td>
              </tr>
            ) : formattedTree.length > 0 ? (
              renderRows(formattedTree)
            ) : (
              <tr>
                <td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                  لا توجد بيانات لعرضها.
                </td>
              </tr>
            )}
          </tbody>
          {totals && (
            <tfoot>
              <tr style={{ backgroundColor: '#1f2937' }}>
                <th style={footerCellStyle}>الإجمالي</th>
                <th style={footerCellStyle}>--</th>
                <th style={footerCellStyle}>{valueFormatter(totals.opening_debit)}</th>
                <th style={footerCellStyle}>{valueFormatter(totals.opening_credit)}</th>
                <th style={footerCellStyle}>{valueFormatter(totals.period_debit)}</th>
                <th style={footerCellStyle}>{valueFormatter(totals.period_credit)}</th>
                <th style={footerCellStyle}>{valueFormatter(totals.total_debit)}</th>
                <th style={footerCellStyle}>{valueFormatter(totals.total_credit)}</th>
                <th style={footerCellStyle}>{valueFormatter(totals.closing_debit)}</th>
                <th style={footerCellStyle}>{valueFormatter(totals.closing_credit)}</th>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

    </div>
  );
};

export default TrialBalance;


