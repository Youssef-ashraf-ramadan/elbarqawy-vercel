import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPaperclip, FaTimes } from 'react-icons/fa';
import {
  addReceiptVoucher,
  getPostingAccounts,
  clearError,
  clearSuccess,
} from '../../../../redux/Slices/authSlice';

const createEmptyLine = () => ({
  id: Date.now() + Math.random(),
  account_id: '',
  amount: '',
  description: '',
});

const AddReceiptVoucher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postingAccounts, isLoading, success, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    voucher_date: '',
    account_id: '',
    notes: '',
    reference: '',
    details: [createEmptyLine()],
  });

  const [attachments, setAttachments] = useState([]);
  const [mainDropdownOpen, setMainDropdownOpen] = useState(false);
  const [mainSearchTerm, setMainSearchTerm] = useState('');
  const mainSearchInputRef = useRef(null);

  const [detailDropdowns, setDetailDropdowns] = useState({});
  const [detailSearchTerms, setDetailSearchTerms] = useState({});
  const detailSearchInputRefs = useRef({});
  const lastErrorRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getPostingAccounts());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      navigate('/receipt-vouchers');
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      const now = Date.now();
      const last = lastErrorRef.current;
      if (!last.message || last.message !== error || now - last.time > 2000) {
        toast.error(error, { rtl: true });
        lastErrorRef.current = { message: error, time: now };
      }
      setTimeout(() => dispatch(clearError()), 3000);
    }
  }, [error, dispatch]);

  const totalAmount = useMemo(
    () =>
      form.details.reduce((sum, line) => sum + (parseFloat(line.amount) || 0), 0),
    [form.details]
  );

  const filteredPostingAccounts = useMemo(() => {
    const term = (mainSearchTerm || '').toLowerCase();
    if (!term) return postingAccounts || [];
    return (postingAccounts || []).filter((acc) => {
      const code = acc.code?.toLowerCase() || '';
      const name = acc.name_ar?.toLowerCase() || acc.name?.toLowerCase() || '';
      return code.includes(term) || name.includes(term);
    });
  }, [postingAccounts, mainSearchTerm]);

  const getFilteredAccountsForLine = (idx) => {
    const term = (detailSearchTerms[idx] || '').toLowerCase();
    if (!term) return postingAccounts || [];
    return (postingAccounts || []).filter((acc) => {
      const code = acc.code?.toLowerCase() || '';
      const name = acc.name_ar?.toLowerCase() || acc.name?.toLowerCase() || '';
      return code.includes(term) || name.includes(term);
    });
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const mapped = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));

    setAttachments((prev) => [...prev, ...mapped]);
    event.target.value = '';
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const target = prev.find((att) => att.id === id);
      if (target?.url) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((att) => att.id !== id);
    });
  };

  const updateLine = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      details: prev.details.map((line, lineIdx) =>
        lineIdx === idx ? { ...line, [field]: value } : line
      ),
    }));
  };

  const addDetailLine = () => {
    setForm((prev) => ({
      ...prev,
      details: [...prev.details, createEmptyLine()],
    }));
  };

  const removeDetailLine = (idx) => {
    setForm((prev) => {
      if (prev.details.length === 1) {
        return prev;
      }
      return {
        ...prev,
        details: prev.details.filter((_, lineIdx) => lineIdx !== idx),
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.voucher_date) {
      toast.error('يرجى تحديد تاريخ الإيصال', { rtl: true });
      return;
    }

    if (!form.account_id) {
      toast.error('يرجى اختيار حساب الخزينة أو البنك المستلم', { rtl: true });
      return;
    }

    const detailsArray = form.details
      .map((line) => ({
        account_id: Number(line.account_id),
        amount: parseFloat(line.amount) || 0,
        description: line.description || '',
      }))
      .filter((line) => line.account_id && line.amount > 0);

    if (detailsArray.length === 0) {
      toast.error('يجب إضافة سطر تفصيلي واحد على الأقل مع حساب ومبلغ صحيح', { rtl: true });
      return;
    }

    const total = detailsArray.reduce((sum, line) => sum + (parseFloat(line.amount) || 0), 0);
    if (total <= 0) {
      toast.error('إجمالي المبلغ يجب أن يكون أكبر من صفر', { rtl: true });
      return;
    }

    const payloadBase = {
      voucher_date: form.voucher_date,
      account_id: Number(form.account_id),
      total_amount: Number(total.toFixed(2)),
      notes: form.notes || '',
      reference: form.reference || '',
      details: detailsArray,
    };

    if (attachments.length > 0) {
      const formData = new FormData();
      formData.append('voucher_date', payloadBase.voucher_date);
      formData.append('account_id', payloadBase.account_id);
      formData.append('total_amount', payloadBase.total_amount);
      formData.append('notes', payloadBase.notes);
      if (payloadBase.reference) {
        formData.append('reference', payloadBase.reference);
      }
      formData.append('details', JSON.stringify(detailsArray));

      attachments.forEach((attachment, idx) => {
        formData.append(`attachments[${idx}]`, attachment.file);
      });

      dispatch(addReceiptVoucher(formData));
    } else {
      dispatch(addReceiptVoucher(payloadBase));
    }
  };

  const renderAccountDisplay = (accountId) => {
    if (!accountId) return 'اختر الحساب';
    const selected = (postingAccounts || []).find(
      (acc) => String(acc.id) === String(accountId)
    );
    if (!selected) return 'اختر الحساب';
    const label = `${selected.code ? `${selected.code} - ` : ''}${selected.name_ar || selected.name || ''}`;
    return label;
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white' }}>
      <h1 style={{ fontSize: '20px', marginBottom: '16px' }}>إضافة إيصال استلام نقدية</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#202938',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '20px',
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>التاريخ</label>
            <input
              type="date"
              value={form.voucher_date}
              onChange={(e) => setForm((prev) => ({ ...prev, voucher_date: e.target.value }))}
              required
              style={{
                width: '100%',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                color: 'white',
                borderRadius: 8,
                padding: '10px',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>المرجع</label>
            <input
              type="text"
              value={form.reference}
              onChange={(e) => setForm((prev) => ({ ...prev, reference: e.target.value }))}
              style={{
                width: '100%',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                color: 'white',
                borderRadius: 8,
                padding: '10px',
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: 6 }}>الحساب (الخزينة / البنك)</label>
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => {
                setMainDropdownOpen((prev) => !prev);
                setTimeout(() => {
                  if (mainSearchInputRef.current) {
                    mainSearchInputRef.current.focus();
                  }
                }, 100);
              }}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#1a1f2e',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxSizing: 'border-box',
              }}
            >
              <span>{renderAccountDisplay(form.account_id)}</span>
              <span style={{ fontSize: '12px' }}>▼</span>
            </div>
            {mainDropdownOpen && (
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
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  ref={mainSearchInputRef}
                  type="text"
                  placeholder="ابحث عن الحساب..."
                  value={mainSearchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    setMainSearchTerm(value);
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
                  {filteredPostingAccounts.length > 0 ? (
                    filteredPostingAccounts.map((acc) => (
                      <div
                        key={acc.id}
                        onClick={() => {
                          setForm((prev) => ({ ...prev, account_id: acc.id }));
                          setMainDropdownOpen(false);
                          setMainSearchTerm('');
                        }}
                        style={{
                          padding: '10px',
                          cursor: 'pointer',
                          backgroundColor: String(form.account_id) === String(acc.id) ? '#AC2000' : 'transparent',
                          color: 'white',
                          borderBottom: '1px solid #333',
                        }}
                        onMouseEnter={(e) => {
                          if (String(form.account_id) !== String(acc.id)) {
                            e.target.style.backgroundColor = '#374151';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (String(form.account_id) !== String(acc.id)) {
                            e.target.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {acc.code} - {acc.name_ar || acc.name}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '10px', color: '#888', textAlign: 'center' }}>لا توجد نتائج</div>
                  )}
                </div>
              </div>
            )}
            {mainDropdownOpen && (
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 999 }}
                onClick={() => setMainDropdownOpen(false)}
              />
            )}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: 6 }}>ملاحظات</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            rows={3}
            style={{
              width: '100%',
              backgroundColor: '#1a1f2e',
              border: '1px solid #333',
              color: 'white',
              borderRadius: 8,
              padding: '10px',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ marginTop: '16px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>تفاصيل الحسابات الدائنة</h3>
          {form.details.map((line, idx) => {
            const filteredAccounts = getFilteredAccountsForLine(idx);
            return (
              <div
                key={line.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 2fr) auto',
                  gap: '12px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div
                    onClick={() => {
                      setDetailDropdowns((prev) => ({
                        ...prev,
                        [idx]: !prev[idx],
                      }));
                      setTimeout(() => {
                        if (detailSearchInputRefs.current[idx]) {
                          detailSearchInputRefs.current[idx].focus();
                        }
                      }, 100);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#1a1f2e',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span>{renderAccountDisplay(line.account_id)}</span>
                    <span style={{ fontSize: '12px' }}>▼</span>
                  </div>
                  {detailDropdowns[idx] && (
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
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        ref={(el) => {
                          detailSearchInputRefs.current[idx] = el;
                        }}
                        type="text"
                        placeholder="ابحث عن الحساب..."
                        value={detailSearchTerms[idx] || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDetailSearchTerms((prev) => ({ ...prev, [idx]: value }));
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
                          filteredAccounts.map((acc) => (
                            <div
                              key={acc.id}
                              onClick={() => {
                                updateLine(idx, 'account_id', acc.id);
                                setDetailDropdowns((prev) => ({ ...prev, [idx]: false }));
                                setDetailSearchTerms((prev) => ({ ...prev, [idx]: '' }));
                              }}
                              style={{
                                padding: '10px',
                                cursor: 'pointer',
                                backgroundColor: String(line.account_id) === String(acc.id) ? '#AC2000' : 'transparent',
                                color: 'white',
                                borderBottom: '1px solid #333',
                              }}
                              onMouseEnter={(e) => {
                                if (String(line.account_id) !== String(acc.id)) {
                                  e.target.style.backgroundColor = '#374151';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (String(line.account_id) !== String(acc.id)) {
                                  e.target.style.backgroundColor = 'transparent';
                                }
                              }}
                            >
                              {acc.code} - {acc.name_ar || acc.name}
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: '10px', color: '#888', textAlign: 'center' }}>لا توجد نتائج</div>
                        )}
                      </div>
                    </div>
                  )}
                  {detailDropdowns[idx] && (
                    <div
                      style={{ position: 'fixed', inset: 0, zIndex: 999 }}
                      onClick={() => {
                        setDetailDropdowns((prev) => ({ ...prev, [idx]: false }));
                      }}
                    />
                  )}
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="المبلغ"
                  value={line.amount}
                  onChange={(e) => updateLine(idx, 'amount', e.target.value)}
                  style={{
                    backgroundColor: '#1a1f2e',
                    border: '1px solid #333',
                    color: 'white',
                    borderRadius: 8,
                    padding: '10px',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
                <input
                  type="text"
                  placeholder="الوصف"
                  value={line.description}
                  onChange={(e) => updateLine(idx, 'description', e.target.value)}
                  style={{
                    backgroundColor: '#1a1f2e',
                    border: '1px solid #333',
                    color: 'white',
                    borderRadius: 8,
                    padding: '10px',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeDetailLine(idx)}
                  disabled={form.details.length === 1}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 10px',
                    cursor: form.details.length === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    opacity: form.details.length === 1 ? 0.6 : 1,
                    height: '100%',
                  }}
                >
                  حذف
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={addDetailLine}
            style={{
              background: '#AC2000',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '10px 14px',
              cursor: 'pointer',
            }}
          >
            + إضافة سطر
          </button>
        </div>

        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#1a1f2e',
            borderRadius: '8px',
            border: '1px solid #333',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#9ca3af', fontSize: '12px' }}>إجمالي المبلغ</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
              {totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '15px',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '16px',
            }}
          >
            المرفقات (اختياري)
          </label>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="file"
              id="receiptVoucherAttachments"
              multiple
              accept="*/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="receiptVoucherAttachments"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'transparent',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                border: '2px solid #AC2000',
                transition: 'all 0.3s ease',
              }}
            >
              <FaPaperclip />
              إضافة مرفقات
            </label>
          </div>

          {attachments.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '15px',
                marginTop: '20px',
              }}
            >
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  style={{
                    backgroundColor: '#1a1f2e',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    position: 'relative',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => removeAttachment(attachment.id)}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      left: '5px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '25px',
                      height: '25px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                    }}
                  >
                    <FaTimes />
                  </button>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <FaPaperclip style={{ fontSize: '24px', color: '#AC2000' }} />
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'white',
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        maxWidth: '100%',
                      }}
                    >
                      {attachment.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#999' }}>
                      {(attachment.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/receipt-vouchers')}
            style={{
              background: '#666',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '10px 16px',
              cursor: 'pointer',
            }}
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: '#AC2000',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '10px 16px',
              cursor: 'pointer',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReceiptVoucher;

