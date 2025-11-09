import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaPaperclip, FaTimes, FaTrash } from 'react-icons/fa';
import { getJournalEntryDetails, updateJournalEntry, getPostingAccounts, clearError, clearSuccess, clearJournalEntryDetails } from '../../../../redux/Slices/authSlice';
import { toast } from 'react-toastify';
import i18n from '../../../../i18n/i18n';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const getSessionToken = () => {
  const storedUser = sessionStorage.getItem('useralbaraqawy');
  if (!storedUser) return null;
  try {
    const parsed = JSON.parse(storedUser);
    if (parsed.token) return parsed.token;
    if (parsed.data?.token) return parsed.data.token;
    if (parsed.result?.token) return parsed.result.token;
    if (parsed.user?.token) return parsed.user.token;
    return null;
  } catch {
    return null;
  }
};

const normalizeIdValue = (value) => {
  if (value == null) return null;
  if (typeof value === 'number') return value;
  const str = String(value).trim();
  if (!str) return null;
  const parts = str.split('/');
  const lastPart = parts[parts.length - 1];
  if (!lastPart) return null;
  const digitsMatch = lastPart.match(/\d+/);
  if (digitsMatch) {
    return digitsMatch[0];
  }
  return lastPart;
};

const EditJournalEntry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { journalEntryDetails, isLoading, error, success, postingAccounts } = useSelector((s) => s.auth);
  const lastErrorRef = useRef({ message: null, time: 0 });
  const [form, setForm] = useState(null);
  const [searchTerms, setSearchTerms] = useState({});
  const [openDropdowns, setOpenDropdowns] = useState({});
  const searchInputRefs = useRef({});
  const [attachments, setAttachments] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));
  const [deletingAttachmentId, setDeletingAttachmentId] = useState(null);
  const [attachmentPendingDeletion, setAttachmentPendingDeletion] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getPostingAccounts());
    dispatch(getJournalEntryDetails(id));
    return () => { dispatch(clearJournalEntryDetails()); };
  }, [dispatch, id]);

  useEffect(() => {
    if (journalEntryDetails && journalEntryDetails.status === 'posted') {
      toast.error('لا يمكن تعديل القيد المرحل', { rtl: true });
      navigate(`/journal-entries/view/${id}`);
    }
  }, [journalEntryDetails, navigate, id]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(typeof window !== 'undefined' ? window.innerWidth : 1200);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    if (journalEntryDetails && journalEntryDetails.status !== 'posted') {
      setForm({
        entry_date: journalEntryDetails.entry_date || '',
        description: journalEntryDetails.description || '',
        reference: journalEntryDetails.reference || '',
        details: (journalEntryDetails.details || []).map((d) => ({
          account_id: d.account?.id || '',
          debit: Number(d.debit || 0),
          credit: Number(d.credit || 0),
          line_description: d.line_description || ''
        }))
      });
      setAttachments([]);
      setExistingAttachments(journalEntryDetails.attachments || []);
    }
  }, [journalEntryDetails]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      navigate('/journal-entries');
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      const now = Date.now(); const last = lastErrorRef.current;
      if (!last.message || last.message !== error || now - last.time > 2000) {
        toast.error(error, { rtl: true });
        lastErrorRef.current = { message: error, time: now };
      }
      setTimeout(() => dispatch(clearError()), 3000);
    }
  }, [error, dispatch]);

  const isTwoColumnLayout = windowWidth >= 900;
  const isNarrowDetails = windowWidth < 900;

  const updateLine = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      details: prev.details.map((l, i) => i === idx ? { ...l, [field]: value } : l)
    }));
  };

  const addLine = () => setForm((p) => ({ ...p, details: [...p.details, { account_id: '', debit: 0, credit: 0, line_description: '' }] }));
  const removeLine = (idx) => setForm((p) => ({ ...p, details: p.details.filter((_, i) => i !== idx) }));

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newAttachments = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file)
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    e.target.value = '';
  };

  const removeAttachment = (attachmentId) => {
    setAttachments((prev) => {
      const attachment = prev.find((a) => a.id === attachmentId);
      if (attachment?.url) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter((a) => a.id !== attachmentId);
    });
  };

  useEffect(() => {
    return () => {
      attachments.forEach((attachment) => {
        if (attachment?.url) {
          URL.revokeObjectURL(attachment.url);
        }
      });
    };
  }, [attachments]);

  const resolveAttachmentId = (attachment) => {
    if (!attachment) return null;
    const immediateId = normalizeIdValue(attachment.id ?? attachment.attachment_id ?? attachment?.id);
    if (immediateId != null) {
      return immediateId;
    }
    const nestedPrompt = normalizeIdValue(attachment?.pivot?.attachment_id ?? attachment?.pivot?.id);
    if (nestedPrompt != null) {
      return nestedPrompt;
    }
    const rawId = normalizeIdValue(attachment?.pivot?.attachment?.id ?? attachment?.attachment?.id ?? attachment?.file_url ?? attachment?.url ?? attachment?.path);
    return rawId;
  };

  const openDeleteAttachmentModal = (attachment) => {
    const id = resolveAttachmentId(attachment);
    if (!id) {
      toast.error('لا يمكن تحديد المرفق المطلوب حذفه', { rtl: true });
      return;
    }
    const name = attachment?.file_name || attachment?.name || attachment?.original_name || attachment?.filename || `مرفق-${id}`;
    setAttachmentPendingDeletion({ id, name });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteAttachmentModal = (force = false) => {
    if (deletingAttachmentId && !force) return; // prevent closing during delete unless forced
    setIsDeleteModalOpen(false);
    setAttachmentPendingDeletion(null);
  };

  const handleDeleteExistingAttachment = async () => {
    if (!attachmentPendingDeletion) return;
    if (!BASE_URL) {
      toast.error('لم يتم ضبط مسار الخادم', { rtl: true });
      return;
    }

    const attachmentId = attachmentPendingDeletion.id;
    const token = getSessionToken();
    if (!token) {
      toast.error('غير مصرح لك بحذف المرفق', { rtl: true });
      return;
    }

    try {
      setDeletingAttachmentId(attachmentId);
      const currentLang = i18n.language || 'ar';
      await axios.delete(`${BASE_URL}/attachments/${attachmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': currentLang
        }
      });
      setExistingAttachments((prev) => prev.filter((attachment) => {
        const resolvedId = resolveAttachmentId(attachment);
        return String(resolvedId) !== String(attachmentId);
      }));
      toast.success('تم حذف المرفق بنجاح', { rtl: true });
      closeDeleteAttachmentModal(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'فشل حذف المرفق';
      toast.error(errorMessage, { rtl: true });
    } finally {
      setDeletingAttachmentId(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form) return;
    const detailsArray = form.details.map((d) => ({
      account_id: Number(d.account_id),
      debit: Number(d.debit || 0),
      credit: Number(d.credit || 0),
      line_description: d.line_description || ''
    }));

    if (attachments.length > 0) {
      const formDataToSend = new FormData();
      formDataToSend.append('entry_date', form.entry_date);
      formDataToSend.append('description', form.description);
      formDataToSend.append('reference', form.reference || '');

      formDataToSend.append('details', JSON.stringify(detailsArray));

      attachments.forEach((attachment, index) => {
        formDataToSend.append(`attachments[${index}]`, attachment.file);
      });

      dispatch(updateJournalEntry({ entryId: id, entryData: formDataToSend }));
    } else {
      const body = {
        entry_date: form.entry_date,
        description: form.description,
        reference: form.reference,
        details: JSON.stringify(detailsArray)
      };
      dispatch(updateJournalEntry({ entryId: id, entryData: body }));
    }
  };

  if (!form) {
    return (
      <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white' }}>جاري التحميل...</div>
    );
  }

  return (
    <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white' }}>
      <h1 style={{ fontSize: '20px', marginBottom: '16px' }}>تعديل القيد #{id}</h1>
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#202938', border: '1px solid #333', borderRadius: '12px', padding: '20px', width: '100%', overflowX: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isTwoColumnLayout ? '1fr 1fr' : '1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>التاريخ</label>
            <input type="date" value={form.entry_date} onChange={(e) => setForm({ ...form, entry_date: e.target.value })} required style={{ width: '100%', backgroundColor: '#1a1f2e', border: '1px solid #333', color: 'white', borderRadius: 8, padding: '10px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>المرجع</label>
            <input type="text" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} style={{ width: '100%', backgroundColor: '#1a1f2e', border: '1px solid #333', color: 'white', borderRadius: 8, padding: '10px' }} />
          </div>
          <div style={{ gridColumn: isTwoColumnLayout ? '1 / span 2' : '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: 6 }}>الوصف</label>
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: '100%', backgroundColor: '#1a1f2e', border: '1px solid #333', color: 'white', borderRadius: 8, padding: '10px' }} />
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>تفاصيل القيد</h3>
          {form.details.map((line, idx) => {
            const searchTerm = searchTerms[idx] || '';
            const filteredAccounts = (postingAccounts || []).filter((acc) => {
              if (!searchTerm) return true;
              const searchLower = searchTerm.toLowerCase();
              const codeMatch = acc.code?.toLowerCase().includes(searchLower);
              const nameMatch = acc.name_ar?.toLowerCase().includes(searchLower) || acc.name?.toLowerCase().includes(searchLower);
              return codeMatch || nameMatch;
            });
            const detailGridTemplate = isNarrowDetails ? '1fr' : 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr) auto';
            
            return (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: detailGridTemplate,
                  gap: '12px',
                  marginBottom: '12px',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ position: 'relative', gridColumn: isNarrowDetails ? '1 / -1' : 'auto' }}>
                  <div
                    onClick={() => {
                      setOpenDropdowns(prev => ({ ...prev, [idx]: !prev[idx] }));
                      setTimeout(() => {
                        if (searchInputRefs.current[idx]) {
                          searchInputRefs.current[idx].focus();
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
                      boxSizing: 'border-box'
                    }}
                  >
                    <span>
                      {line.account_id 
                        ? (() => {
                            const selected = postingAccounts?.find(acc => String(acc.id) === String(line.account_id));
                            return selected ? `${selected.code} - ${selected.name_ar || selected.name}` : 'اختر الحساب';
                          })()
                        : 'اختر الحساب'}
                    </span>
                    <span style={{ fontSize: '12px' }}>▼</span>
                  </div>
                  {openDropdowns[idx] && (
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
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        ref={(el) => searchInputRefs.current[idx] = el}
                        type="text"
                        placeholder="ابحث عن الحساب..."
                        value={searchTerm}
                        onChange={(e) => {
                          const searchValue = e.target.value;
                          setSearchTerms(prev => ({ ...prev, [idx]: searchValue }));
                          if (searchValue) {
                            dispatch(getPostingAccounts(searchValue));
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
                          boxSizing: 'border-box'
                        }}
                      />
                      <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                        {filteredAccounts.length > 0 ? (
                          filteredAccounts.map((acc) => {
                            const isSelectedInOtherLine = form.details.some((d, i) => {
                              if (i === idx) return false;
                              const otherLineAccountId = d.account_id ? String(d.account_id) : '';
                              const currentAccountId = String(acc.id);
                              return otherLineAccountId === currentAccountId && otherLineAccountId !== '';
                            });
                            const isSelected = String(line.account_id) === String(acc.id);
                            return (
                              <div
                                key={acc.id}
                                onClick={() => {
                                  if (!isSelectedInOtherLine) {
                                    updateLine(idx, 'account_id', acc.id);
                                    setOpenDropdowns(prev => ({ ...prev, [idx]: false }));
                                    setSearchTerms(prev => ({ ...prev, [idx]: '' }));
                                  }
                                }}
                                style={{
                                  padding: '10px',
                                  cursor: isSelectedInOtherLine ? 'not-allowed' : 'pointer',
                                  backgroundColor: isSelected ? '#AC2000' : isSelectedInOtherLine ? '#2a2a2a' : 'transparent',
                                  color: isSelectedInOtherLine ? '#888' : 'white',
                                  borderBottom: '1px solid #333',
                                  opacity: isSelectedInOtherLine ? 0.5 : 1
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelectedInOtherLine && !isSelected) {
                                    e.target.style.backgroundColor = '#374151';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelectedInOtherLine && !isSelected) {
                                    e.target.style.backgroundColor = 'transparent';
                                  }
                                }}
                              >
                                {acc.code} - {acc.name_ar || acc.name} {isSelectedInOtherLine ? '(مختار بالفعل)' : ''}
                              </div>
                            );
                          })
                        ) : (
                          <div style={{ padding: '10px', color: '#888', textAlign: 'center' }}>
                            لا توجد نتائج
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {openDropdowns[idx] && (
                    <div
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                      }}
                      onClick={() => {
                        setOpenDropdowns(prev => ({ ...prev, [idx]: false }));
                      }}
                    />
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  placeholder="مدين"
                  value={line.debit}
                  onChange={(e) => updateLine(idx, 'debit', e.target.value)}
                  style={{ backgroundColor: '#1a1f2e', border: '1px solid #333', color: 'white', borderRadius: 8, padding: '10px', width: '100%', boxSizing: 'border-box' }}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="دائن"
                  value={line.credit}
                  onChange={(e) => updateLine(idx, 'credit', e.target.value)}
                  style={{ backgroundColor: '#1a1f2e', border: '1px solid #333', color: 'white', borderRadius: 8, padding: '10px', width: '100%', boxSizing: 'border-box' }}
                />
                <input
                  type="text"
                  placeholder="الوصف"
                  value={line.line_description}
                  onChange={(e) => updateLine(idx, 'line_description', e.target.value)}
                  style={{
                    backgroundColor: '#1a1f2e',
                    border: '1px solid #333',
                    color: 'white',
                    borderRadius: 8,
                    padding: '10px',
                    width: '100%',
                    boxSizing: 'border-box',
                    gridColumn: isNarrowDetails ? '1 / -1' : 'auto'
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeLine(idx)}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 10px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    justifySelf: isNarrowDetails ? 'stretch' : 'center',
                    width: isNarrowDetails ? '100%' : 'auto'
                  }}
                >
                  حذف
                </button>
              </div>
            );
          })}
          <button type="button" onClick={addLine} style={{ background: '#AC2000', color: 'white', border: 'none', borderRadius: 8, padding: '10px 14px', cursor: 'pointer' }}>+ إضافة سطر</button>
          
          {/* Totals Section */}
          {form && form.details.length > 0 && (() => {
            const totalDebit = form.details.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0);
            const totalCredit = form.details.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0);
            const difference = totalDebit - totalCredit;
            const differenceColor = difference === 0 ? '#AC2000' : '#dc3545';
            
            return (
              <div style={{ 
                marginTop: '20px', 
                padding: '16px', 
                backgroundColor: '#1a1f2e', 
                borderRadius: '8px',
                border: '1px solid #333'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: isNarrowDetails ? '1fr' : '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
                  <div>
                    <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>إجمالي المدين</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>{totalDebit.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>إجمالي الدائن</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>{totalCredit.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>الفرق</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: differenceColor }}>
                      {difference.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* المرفقات */}
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '15px',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '16px'
            }}
          >
            المرفقات (اختياري)
          </label>

          {existingAttachments.length > 0 && (
            <div
              style={{
                marginBottom: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '15px'
              }}
            >
              {existingAttachments.map((attachment) => {
                const fallbackName = attachment?.file_name || attachment?.name || attachment?.original_name || attachment?.filename;
                const url = attachment?.file_url || attachment?.url || attachment?.media_url || attachment?.path || attachment?.full_url || attachment?.link || '';
                const id = resolveAttachmentId(attachment);
                const attachmentName = fallbackName || `مرفق-${id ?? ''}`;
                return (
                  <div
                    key={`existing-${id || attachmentName}`}
                    style={{
                      position: 'relative',
                      backgroundColor: '#1a1f2e',
                      padding: '15px',
                      borderRadius: '8px',
                      border: '1px solid #333',
                      color: url ? 'white' : '#888',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <button
                      type="button"
                        onClick={() => openDeleteAttachmentModal({ ...attachment, name: attachmentName })}
                        disabled={deletingAttachmentId && String(deletingAttachmentId) === String(id)}
                      style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '26px',
                        height: '26px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: deletingAttachmentId === id ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        opacity: deletingAttachmentId === id ? 0.6 : 1
                      }}
                      title="حذف المرفق"
                    >
                      {deletingAttachmentId === id ? (
                        <span style={{ fontSize: '10px' }}>...</span>
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                    <a
                      href={url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: url ? 'white' : '#888',
                        textDecoration: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: url ? 'pointer' : 'default',
                        width: '100%'
                      }}
                    >
                      <FaPaperclip style={{ fontSize: '24px', color: '#AC2000' }} />
                      <span style={{ fontSize: '12px', textAlign: 'center', wordBreak: 'break-word' }}>{attachmentName}</span>
                      {attachment?.size && (
                        <span style={{ fontSize: '10px', color: '#999' }}>
                          {(Number(attachment.size) / 1024).toFixed(2)} KB
                        </span>
                      )}
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <input
              type="file"
              id="editFileUpload"
              multiple
              accept="*/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="editFileUpload"
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
                transition: 'all 0.3s ease'
              }}
            >
              <FaPaperclip />
              إضافة مرفقات جديدة
            </label>
          </div>

          {attachments.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '15px',
                marginTop: '20px'
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
                    position: 'relative'
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
                      fontSize: '12px'
                    }}
                  >
                    <FaTimes />
                  </button>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FaPaperclip style={{ fontSize: '24px', color: '#AC2000' }} />
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'white',
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        maxWidth: '100%'
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

        {isDeleteModalOpen && attachmentPendingDeletion && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000
            }}
            onClick={(e) => {
              if (!deletingAttachmentId && e.target === e.currentTarget) {
                closeDeleteAttachmentModal();
              }
            }}
          >
            <div
              style={{
                backgroundColor: '#202938',
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '24px',
                width: '90%',
                maxWidth: '420px',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>تأكيد حذف المرفق</h3>
              <p style={{ marginBottom: '20px', lineHeight: 1.6, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                هل أنت متأكد من حذف المرفق
                {' '}
                <span style={{ color: '#AC2000', fontWeight: 'bold' }}>{attachmentPendingDeletion.name}</span>
                ؟ لا يمكن التراجع عن هذه العملية.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleDeleteExistingAttachment}
                  disabled={Boolean(deletingAttachmentId)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    cursor: deletingAttachmentId ? 'not-allowed' : 'pointer',
                    opacity: deletingAttachmentId ? 0.7 : 1,
                    fontWeight: 'bold'
                  }}
                >
                  {deletingAttachmentId ? 'جاري الحذف...' : 'حذف'}
                </button>
                <button
                  type="button"
                  onClick={closeDeleteAttachmentModal}
                  disabled={Boolean(deletingAttachmentId)}
                  style={{
                    backgroundColor: '#666',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    cursor: deletingAttachmentId ? 'not-allowed' : 'pointer'
                  }}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button type="button" onClick={() => navigate('/journal-entries')} style={{ background: '#666', color: 'white', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer' }}>إلغاء</button>
          <button type="submit" disabled={isLoading} style={{ background: '#AC2000', color: 'white', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', opacity: isLoading ? 0.7 : 1 }}>{isLoading ? 'جاري الحفظ...' : 'حفظ'}</button>
        </div>
      </form>
    </div>
  );
};

export default EditJournalEntry;


