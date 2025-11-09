import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSyncAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  getAccountStatement,
  clearAccountStatement,
  getPostingAccounts,
  clearError,
  clearSuccess,
} from '../../../../redux/Slices/authSlice';

const AccountStatement = () => {
  const dispatch = useDispatch();
  const {
    accountStatement,
    accountStatementTotals,
    accountStatementPagination,
    accountStatementFilters,
    postingAccounts,
    isLoading,
    error,
    success,
  } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    account_id: '',
    start_date: '',
    end_date: '',
  });
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [accountSearchTerm, setAccountSearchTerm] = useState('');
  const accountSearchInputRef = useRef(null);
  const lastErrorRef = useRef({ message: null, time: 0 });
  const lastSuccessRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getPostingAccounts());
    return () => {
      dispatch(clearAccountStatement());
    };
  }, [dispatch]);

  useEffect(() => {
    if (accountStatementFilters) {
      setFilters({
        account_id: accountStatementFilters.account_id || '',
        start_date: accountStatementFilters.start_date || '',
        end_date: accountStatementFilters.end_date || '',
      });
    }
  }, [accountStatementFilters]);

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

  const filteredAccounts = useMemo(() => {
    if (!Array.isArray(postingAccounts)) return [];
    if (!accountSearchTerm) return postingAccounts;
    const term = accountSearchTerm.toLowerCase();
    return postingAccounts.filter((account) => {
      const code = account.code?.toLowerCase() || '';
      const nameAr = account.name_ar?.toLowerCase() || '';
      const nameEn = account.name?.toLowerCase() || '';
      return code.includes(term) || nameAr.includes(term) || nameEn.includes(term);
    });
  }, [postingAccounts, accountSearchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!filters.account_id) {
      toast.error('برجاء اختيار الحساب أولاً', { rtl: true });
      return;
    }
    dispatch(
      getAccountStatement({
        account_id: filters.account_id,
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined,
        page: 1,
      })
    );
  };

  const handlePageChange = (page) => {
    if (!filters.account_id || page === accountStatementPagination?.current_page) return;
    dispatch(
      getAccountStatement({
        account_id: filters.account_id,
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined,
        page,
      })
    );
  };

  const totals = accountStatementTotals || {
    opening_balance: 0,
    total_debit: 0,
    total_credit: 0,
    closing_balance: 0,
  };

  const movements = Array.isArray(accountStatement)
    ? accountStatement
    : Array.isArray(accountStatementPagination?.data)
    ? accountStatementPagination.data
    : [];

  const paginationInfo = accountStatementPagination || {};

  const formatNumber = (value) =>
    Number(value ?? 0).toLocaleString('ar-EG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const renderAccountDisplay = (accountId) => {
    if (!accountId) return 'اختر الحساب';
    const selected = (postingAccounts || []).find(
      (account) => String(account.id) === String(accountId)
    );
    if (!selected) return 'اختر الحساب';
    return `${selected.code ? `${selected.code} - ` : ''}${selected.name_ar || selected.name || ''}`;
  };

  useEffect(() => {
    if (accountDropdownOpen && accountSearchInputRef.current) {
      accountSearchInputRef.current.focus();
    }
  }, [accountDropdownOpen]);

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
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>كشف الحساب</h1>
          {accountStatementFilters?.account_id && (
            <div style={{ marginTop: '8px', fontSize: '14px', color: '#cbd5f5' }}>
              الحساب المختار: {accountStatementFilters.account_id}
            </div>
          )}
        </div>
        <button
          onClick={() => {
            if (!filters.account_id) return;
            dispatch(
              getAccountStatement({
                account_id: filters.account_id,
                start_date: filters.start_date || undefined,
                end_date: filters.end_date || undefined,
                page: paginationInfo.current_page || 1,
              })
            );
          }}
          style={{
            backgroundColor: '#202938',
            color: 'white',
            border: '1px solid #333',
            padding: '10px 16px',
            borderRadius: '8px',
            cursor: filters.account_id ? 'pointer' : 'not-allowed',
            opacity: filters.account_id ? 1 : 0.6,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
          }}
          disabled={!filters.account_id}
        >
          <FaSyncAlt />
          إعادة تحميل
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#202938',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          display: 'grid',
          gap: '16px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>
              الحساب <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <div
              onClick={() => {
                setAccountDropdownOpen((prev) => !prev);
                if (!accountDropdownOpen) {
                  setTimeout(() => {
                    if (accountSearchInputRef.current) {
                      accountSearchInputRef.current.focus();
                    }
                  }, 100);
                }
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              <span>{renderAccountDisplay(filters.account_id)}</span>
              <span style={{ fontSize: '12px' }}>▼</span>
            </div>
            {accountDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#1a1f2e',
                  border: '1px solid #333',
                  borderRadius: '0 0 8px 8px',
                  zIndex: 1000,
                  maxHeight: '300px',
                  overflowY: 'auto',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                  marginTop: '4px',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  ref={accountSearchInputRef}
                  type="text"
                  placeholder="ابحث عن الحساب..."
                  value={accountSearchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAccountSearchTerm(value);
                    if (value) {
                      dispatch(getPostingAccounts(value));
                    } else {
                      dispatch(getPostingAccounts());
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#2d3748',
                    border: 'none',
                    borderBottom: '1px solid #333',
                    color: 'white',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account) => {
                      const isSelected =
                        String(filters.account_id) === String(account.id);
                      return (
                        <div
                          key={account.id || account.code}
                          onClick={() => {
                            setFilters((prev) => ({
                              ...prev,
                              account_id: String(account.id),
                            }));
                            setAccountDropdownOpen(false);
                            setAccountSearchTerm('');
                          }}
                          style={{
                            padding: '10px',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? '#AC2000' : 'transparent',
                            color: 'white',
                            borderBottom: '1px solid #333',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.target.style.backgroundColor = '#374151';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          {account.code} - {account.name_ar || account.name}
                        </div>
                      );
                    })
                  ) : (
                    <div
                      style={{
                        padding: '10px',
                        color: '#888',
                        textAlign: 'center',
                      }}
                    >
                      لا توجد نتائج
                    </div>
                  )}
                </div>
              </div>
            )}
            {accountDropdownOpen && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 999,
                }}
                onClick={() => {
                  setAccountDropdownOpen(false);
                }}
              />
            )}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>
              تاريخ البداية (اختياري)
            </label>
            <input
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleChange}
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
              تاريخ النهاية (اختياري)
            </label>
            <input
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleChange}
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
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            onClick={() => {
              setFilters({ account_id: '', start_date: '', end_date: '' });
              setAccountSearchTerm('');
              setAccountDropdownOpen(false);
              dispatch(getPostingAccounts());
              dispatch(clearAccountStatement());
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
            عرض الكشف
          </button>
        </div>
      </form>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {[
          { label: 'الرصيد الافتتاحي', value: totals.opening_balance },
          { label: 'إجمالي مدين', value: totals.total_debit },
          { label: 'إجمالي دائن', value: totals.total_credit },
          { label: 'الرصيد الختامي', value: totals.closing_balance },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              backgroundColor: '#202938',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '18px',
            }}
          >
            <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '6px' }}>
              {item.label}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
              {formatNumber(item.value)}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: '#202938',
          border: '1px solid #333',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: 0,
              minWidth: '960px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#AC2000' }}>
                {['التاريخ', 'الوصف', 'مدين', 'دائن', 'الرصيد'].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding: '18px 16px',
                      textAlign: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      borderBottom: '1px solid #333',
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filters.account_id ? (
                movements && movements.length > 0 ? (
                  movements.map((movement, idx) => (
                    <tr
                      key={movement.id || idx}
                      style={{
                        borderBottom: '1px solid #333',
                        backgroundColor: idx % 2 === 0 ? '#202938' : '#1a1f2e',
                      }}
                    >
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: 'white' }}>
                        {movement.date || movement.document_date || '-'}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: 'white' }}>
                        {movement.description || movement.reference || '-'}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: 'white' }}>
                        {formatNumber(movement.debit)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: 'white' }}>
                        {formatNumber(movement.credit)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: 'white' }}>
                        {formatNumber(movement.balance ?? movement.running_balance)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: '30px',
                        textAlign: 'center',
                        color: '#9ca3af',
                        fontSize: '16px',
                      }}
                    >
                      لا توجد حركات لهذا الحساب في الفترة المحددة.
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: '30px',
                      textAlign: 'center',
                      color: '#9ca3af',
                      fontSize: '16px',
                    }}
                  >
                    يرجى اختيار حساب لعرض كشف الحركة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filters.account_id && paginationInfo?.last_page > 1 && (
          <div
            style={{
              padding: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              borderTop: '1px solid #333',
            }}
          >
            <button
              onClick={() => handlePageChange(Math.max(1, (paginationInfo.current_page || 1) - 1))}
              disabled={!paginationInfo?.prev_page_url}
              style={{
                backgroundColor: '#202938',
                color: 'white',
                border: '1px solid #333',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: paginationInfo?.prev_page_url ? 'pointer' : 'not-allowed',
                opacity: paginationInfo?.prev_page_url ? 1 : 0.5,
                fontSize: '14px',
              }}
            >
              &lt;
            </button>
            {Array.from({ length: paginationInfo.last_page }, (_, i) => i + 1).map((page) => (
              <button
                key={`page-${page}`}
                onClick={() => handlePageChange(page)}
                style={{
                  backgroundColor:
                    page === paginationInfo.current_page ? '#AC2000' : '#202938',
                  color: 'white',
                  border:
                    page === paginationInfo.current_page ? 'none' : '1px solid #333',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: page === paginationInfo.current_page ? 'bold' : 'normal',
                }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                handlePageChange(
                  Math.min(
                    paginationInfo.last_page || 1,
                    (paginationInfo.current_page || 1) + 1
                  )
                )
              }
              disabled={!paginationInfo?.next_page_url}
              style={{
                backgroundColor: '#202938',
                color: 'white',
                border: '1px solid #333',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: paginationInfo?.next_page_url ? 'pointer' : 'not-allowed',
                opacity: paginationInfo?.next_page_url ? 1 : 0.5,
                fontSize: '14px',
              }}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountStatement;


