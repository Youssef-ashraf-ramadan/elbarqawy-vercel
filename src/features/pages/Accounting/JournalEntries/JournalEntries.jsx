import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getJournalEntries, acceptJournalEntry, postJournalEntry, deleteJournalEntry, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaPlus, FaEye, FaEdit, FaTrash, FaCheck, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';

const JournalEntries = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { journalEntries, journalEntriesPagination, isLoading, error, success } = useSelector((s) => s.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const lastErrorRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getJournalEntries({ page: currentPage, per_page: 10 }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      dispatch(getJournalEntries({ page: currentPage, per_page: 10 }));
    }
  }, [success, dispatch, currentPage]);

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

  const handleAccept = (id) => dispatch(acceptJournalEntry(id));
  const handlePost = (id) => dispatch(postJournalEntry(id));
  const handleDelete = (id) => {
    const target = (journalEntries || []).find((e) => e.id === id) || { id };
    setEntryToDelete(target);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!entryToDelete) return;
    dispatch(deleteJournalEntry(entryToDelete.id));
    setShowDeleteModal(false);
    setEntryToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEntryToDelete(null);
  };

  if (isLoading && (!journalEntries || journalEntries.length === 0)) {
    return (
      <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        جاري التحميل...
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '20px', margin: 0 }}>القيود اليومية</h1>
        <button onClick={() => navigate('/journal-entries/add')} style={{ backgroundColor: '#AC2000', border: 'none', color: 'white', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <FaPlus /> إضافة قيد
        </button>
      </div>

      <div style={{ backgroundColor: '#202938', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ backgroundColor: '#AC2000' }}>
                {[
                  { label: '#', width: '60px' },
                  { label: 'التاريخ', width: '140px' },
                  { label: 'المرجع', width: '180px' },
                  { label: 'الوصف', width: '250px' },
                  { label: 'الحالة', width: '140px' },
                  { label: 'القيمة', width: '160px' },
                  { label: 'المنشئ', width: '160px' },
                  { label: 'الإجراءات', width: '240px' }
                ].map((h) => (
                  <th 
                    key={h.label} 
                    style={{ 
                      padding: '18px 16px', 
                      color: 'white', 
                      borderBottom: '2px solid #333', 
                      fontSize: '14px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      width: h.width,
                      minWidth: h.width,
                      backgroundColor: '#AC2000'
                    }}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(journalEntries || []).length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '16px' }}>
                    لا توجد قيود متاحة
                  </td>
                </tr>
              ) : (
                (journalEntries || []).map((e, idx) => (
                  <tr 
                    key={e.id} 
                    style={{ 
                      borderBottom: '1px solid #333',
                      backgroundColor: idx % 2 === 0 ? '#202938' : '#1a1f2e',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(ev) => ev.target.closest('tr').style.backgroundColor = '#2a3441'}
                    onMouseLeave={(ev) => ev.target.closest('tr').style.backgroundColor = idx % 2 === 0 ? '#202938' : '#1a1f2e'}
                  >
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                      {(journalEntriesPagination?.current_page - 1) * (journalEntriesPagination?.per_page || 10) + idx + 1}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                      {e.entry_date}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                      {e.reference || '-'}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                      {e.description || '-'}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                      <span style={{ 
                        backgroundColor: e.status === 'posted' ? '#AC2000' : e.status === 'accepted' ? '#007bff' : '#666', 
                        color: 'white', 
                        padding: '6px 14px', 
                        borderRadius: '20px', 
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}>
                        {e.status === 'posted' ? 'مرحل' : e.status === 'accepted' ? 'مقبول' : 'مسودة'}
                      </span>
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px', fontWeight: '500' }}>
                      {(() => {
                        const debit = parseFloat(e.total_debit || 0);
                        const credit = parseFloat(e.total_credit || 0);
                        const value = debit !== 0 ? debit : credit;
                        return value.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                      })()}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                      {e.creator || '-'}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
                        <button 
                          title="عرض" 
                          onClick={() => navigate(`/journal-entries/view/${e.id}`)} 
                          style={{ 
                            backgroundColor: '#666', 
                            color: 'white', 
                            border: 'none', 
                            padding: '10px 12px', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(ev) => { ev.target.style.backgroundColor = '#777'; ev.target.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={(ev) => { ev.target.style.backgroundColor = '#666'; ev.target.style.transform = 'scale(1)'; }}
                        >
                          <FaEye />
                        </button>
                        <button 
                          title="تعديل" 
                          onClick={() => navigate(`/journal-entries/edit/${e.id}`)} 
                          style={{ 
                            backgroundColor: '#AC2000', 
                            color: 'white', 
                            border: 'none', 
                            padding: '10px 12px', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(ev) => { ev.target.style.backgroundColor = '#0bb564'; ev.target.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={(ev) => { ev.target.style.backgroundColor = '#AC2000'; ev.target.style.transform = 'scale(1)'; }}
                        >
                          <FaEdit />
                        </button>
                        {e.status === 'draft' && (
                          <button 
                            title="قبول" 
                            onClick={() => handleAccept(e.id)} 
                            style={{ 
                              backgroundColor: '#0d6efd', 
                              color: 'white', 
                              border: 'none', 
                              padding: '10px 12px', 
                              borderRadius: '8px', 
                              cursor: 'pointer',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(ev) => { ev.target.style.backgroundColor = '#0b5ed7'; ev.target.style.transform = 'scale(1.05)'; }}
                            onMouseLeave={(ev) => { ev.target.style.backgroundColor = '#0d6efd'; ev.target.style.transform = 'scale(1)'; }}
                          >
                            <FaCheck />
                          </button>
                        )}
                        {e.status === 'accepted' && (
                          <button 
                            title="ترحيل" 
                            onClick={() => handlePost(e.id)} 
                            style={{ 
                              backgroundColor: '#845ef7', 
                              color: 'white', 
                              border: 'none', 
                              padding: '10px 12px', 
                              borderRadius: '8px', 
                              cursor: 'pointer',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(ev) => { ev.target.style.backgroundColor = '#7950f2'; ev.target.style.transform = 'scale(1.05)'; }}
                            onMouseLeave={(ev) => { ev.target.style.backgroundColor = '#845ef7'; ev.target.style.transform = 'scale(1)'; }}
                          >
                            <FaPaperPlane />
                          </button>
                        )}
                        {e.status === 'draft' && (
                          <button 
                            title="حذف" 
                            onClick={() => handleDelete(e.id)} 
                            style={{ 
                              backgroundColor: '#dc3545', 
                              color: 'white', 
                              border: 'none', 
                              padding: '10px 12px', 
                              borderRadius: '8px', 
                              cursor: 'pointer',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(ev) => { ev.target.style.backgroundColor = '#bb2d3b'; ev.target.style.transform = 'scale(1.05)'; }}
                            onMouseLeave={(ev) => { ev.target.style.backgroundColor = '#dc3545'; ev.target.style.transform = 'scale(1)'; }}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {journalEntriesPagination && (journalEntries && journalEntries.length > 0) && (
          <div style={{
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            borderTop: '1px solid #333'
          }}>
            {/* Previous Button */}
            {journalEntriesPagination.current_page > 1 && (
              <button 
                onClick={() => setCurrentPage(journalEntriesPagination.current_page - 1)}
                style={{
                  backgroundColor: '#202938',
                  color: 'white',
                  border: '1px solid #333',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                &lt;&lt;
              </button>
            )}

            {/* Page Numbers */}
            {Array.from({ length: journalEntriesPagination.last_page }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  backgroundColor: page === journalEntriesPagination.current_page ? '#AC2000' : '#202938',
                  color: 'white',
                  border: page === journalEntriesPagination.current_page ? 'none' : '1px solid #333',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: page === journalEntriesPagination.current_page ? 'bold' : 'normal'
                }}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            {journalEntriesPagination.current_page < journalEntriesPagination.last_page && (
              <button 
                onClick={() => setCurrentPage(journalEntriesPagination.current_page + 1)}
                style={{
                  backgroundColor: '#202938',
                  color: 'white',
                  border: '1px solid #333',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                &gt;&gt;
              </button>
            )}
          </div>
        )}
      </div>
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999 }}>
          <div style={{ backgroundColor: '#1f2937', border: '1px solid #333', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '420px' }}>
            <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '18px' }}>تأكيد الحذف</h3>
            <p style={{ color: '#ccc', marginBottom: '8px', fontSize: '14px' }}>هل أنت متأكد من حذف هذا القيد؟</p>
            {entryToDelete && (
              <div style={{ color: 'white', fontSize: '14px', marginBottom: '16px' }}>
                المرجع: {entryToDelete.reference || '-'}
              </div>
            )}
            <p style={{ color: '#ef4444', marginBottom: '20px', fontSize: '12px' }}>هذا الإجراء لا يمكن التراجع عنه.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={cancelDelete} style={{ backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer' }}>إلغاء</button>
              <button onClick={confirmDelete} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer' }}>حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEntries;


