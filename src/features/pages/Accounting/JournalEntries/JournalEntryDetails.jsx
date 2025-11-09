import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPaperclip } from 'react-icons/fa';
import { getJournalEntryDetails, clearError } from '../../../../redux/Slices/authSlice';
import { toast } from 'react-toastify';

const JournalEntryDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { journalEntryDetails, isLoading, error } = useSelector((s) => s.auth);
  const lastErrorRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getJournalEntryDetails(id));
  }, [dispatch, id]);

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

  if (isLoading || !journalEntryDetails) {
    return (<div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white' }}>جاري التحميل...</div>);
  }

  const e = journalEntryDetails;
  const attachments = Array.isArray(e.attachments) ? e.attachments : [];
  const details = Array.isArray(e.details) ? e.details : [];

  const calculatedTotalDebit = details.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0);
  const calculatedTotalCredit = details.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0);
  const totalDebit = e.total_debit != null ? Number(e.total_debit) : calculatedTotalDebit;
  const totalCredit = e.total_credit != null ? Number(e.total_credit) : calculatedTotalCredit;
  const difference = totalDebit - totalCredit;

  return (
    <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white' }}>
      <button onClick={() => navigate('/journal-entries')} style={{ background: '#666', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', marginBottom: '12px' }}>رجوع</button>
      <div style={{ backgroundColor: '#202938', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #333', backgroundColor: '#1a1f2e' }}>
          <strong>تفاصيل القيد #{e.id}</strong>
        </div>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div><div style={{ color: '#9ca3af', fontSize: 12 }}>التاريخ</div><div>{e.entry_date}</div></div>
            <div><div style={{ color: '#9ca3af', fontSize: 12 }}>المرجع</div><div>{e.reference}</div></div>
            <div><div style={{ color: '#9ca3af', fontSize: 12 }}>الحالة</div><div>{e.status}</div></div>
            <div><div style={{ color: '#9ca3af', fontSize: 12 }}>المنشئ</div><div>{e.creator}</div></div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: '#9ca3af', fontSize: 12 }}>الوصف</div>
            <div>{e.description}</div>
          </div>
          <div
            style={{
              marginTop: '20px',
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: '#1a1f2e',
              borderRadius: '10px',
              border: '1px solid #333'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center', gap: '16px' }}>
              <div>
                <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px' }}>إجمالي المدين</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
                  {totalDebit.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px' }}>إجمالي الدائن</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
                  {totalCredit.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px' }}>الفرق</div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: Math.abs(difference) < 0.001 ? '#AC2000' : '#dc3545'
                  }}
                >
                  {difference.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
          {attachments.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px', fontWeight: 'bold' }}>المرفقات</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '15px'
              }}>
                {attachments.map((attachment) => {
                  const name = attachment?.file_name || attachment?.name || attachment?.original_name || attachment?.filename || `مرفق-${attachment?.id ?? ''}`;
                  const url = attachment?.file_url || attachment?.url || attachment?.media_url || attachment?.path || attachment?.full_url || attachment?.link || '';
                  return (
                    <a
                      key={`attachment-${attachment?.id || name}`}
                      href={url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: '#1a1f2e',
                        padding: '16px',
                        borderRadius: '10px',
                        border: '1px solid #333',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                        color: url ? 'white' : '#888',
                        textDecoration: 'none',
                        cursor: url ? 'pointer' : 'default'
                      }}
                    >
                      <FaPaperclip style={{ fontSize: '24px', color: '#AC2000' }} />
                      <span style={{ fontSize: '13px', textAlign: 'center', wordBreak: 'break-word' }}>{name}</span>
                      {attachment?.size && (
                        <span style={{ fontSize: '11px', color: '#999' }}>
                          {(Number(attachment.size) / 1024).toFixed(2)} KB
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 'bold' }}>تفاصيل السطور</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ backgroundColor: '#1a1f2e' }}>
                    {[
                      { label: '#', width: '60px' },
                      { label: 'الحساب', width: '180px' },
                      { label: 'الكود', width: '100px' },
                      { label: 'النوع', width: '120px' },
                      { label: 'الفئة', width: '120px' },
                      { label: 'مدين', width: '130px' },
                      { label: 'دائن', width: '130px' },
                      { label: 'الوصف', width: '200px' }
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
                          minWidth: h.width
                        }}
                      >
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(e.details || []).map((d, idx) => (
                    <tr 
                      key={d.id} 
                      style={{ 
                        borderBottom: '1px solid #333',
                        backgroundColor: idx % 2 === 0 ? '#202938' : '#1a1f2e',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(ev) => ev.target.closest('tr').style.backgroundColor = '#2a3441'}
                      onMouseLeave={(ev) => ev.target.closest('tr').style.backgroundColor = idx % 2 === 0 ? '#202938' : '#1a1f2e'}
                    >
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>{idx + 1}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>{d.account?.name_ar || d.account?.name || '-'}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>{d.account?.code || '-'}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>{d.account?.type || '-'}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>{d.account?.category || '-'}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px', fontWeight: '500' }}>
                        {parseFloat(d.debit || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px', fontWeight: '500' }}>
                        {parseFloat(d.credit || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>{d.line_description || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryDetails;


