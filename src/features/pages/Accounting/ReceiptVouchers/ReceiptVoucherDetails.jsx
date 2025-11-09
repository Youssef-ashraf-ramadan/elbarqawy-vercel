import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPaperclip } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  getReceiptVoucherDetails,
  clearReceiptVoucherDetails,
  clearError,
} from '../../../../redux/Slices/authSlice';

const ReceiptVoucherDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { receiptVoucherDetails, isLoading, error } = useSelector((state) => state.auth);
  const lastErrorRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getReceiptVoucherDetails(id));

    return () => {
      dispatch(clearReceiptVoucherDetails());
    };
  }, [dispatch, id]);

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

  if (isLoading || !receiptVoucherDetails) {
    return (
      <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white' }}>
        جاري التحميل...
      </div>
    );
  }

  const voucher = receiptVoucherDetails;
  const attachments = Array.isArray(voucher.attachments) ? voucher.attachments : [];
  const details = Array.isArray(voucher.details) ? voucher.details : [];
  const totalAmount = Number(voucher.total_amount || details.reduce((sum, line) => sum + (parseFloat(line.amount) || 0), 0));

  return (
    <div style={{ padding: '30px', backgroundColor: '#121828', minHeight: 'calc(100vh - 80px)', color: 'white' }}>
      <button
        onClick={() => navigate('/receipt-vouchers')}
        style={{
          background: '#666',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          padding: '8px 12px',
          cursor: 'pointer',
          marginBottom: '12px',
        }}
      >
        رجوع
      </button>

      <div style={{ backgroundColor: '#202938', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #333', backgroundColor: '#1a1f2e' }}>
          <strong>تفاصيل إيصال الاستلام #{voucher.id}</strong>
        </div>
        <div style={{ padding: '16px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div>
              <div style={{ color: '#9ca3af', fontSize: 12 }}>التاريخ</div>
              <div>{voucher.voucher_date || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: 12 }}>المرجع</div>
              <div>{voucher.reference || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: 12 }}>الحالة</div>
              <div>{voucher.status || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: 12 }}>المنشئ</div>
              <div>{voucher.created_by || voucher.creator || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: 12 }}>تاريخ الترحيل</div>
              <div>{voucher.posted_at || '-'}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div>
              <div style={{ color: '#9ca3af', fontSize: 12 }}>الحساب (الخزينة / البنك)</div>
              <div>
                {voucher.account
                  ? `${voucher.account.code ? `${voucher.account.code} - ` : ''}${voucher.account.name_ar || voucher.account.name || ''}`
                  : '-'}
              </div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', fontSize: 12 }}>إجمالي المبلغ</div>
              <div>
                {totalAmount.toLocaleString('ar-EG', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          {voucher.notes && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: '#9ca3af', fontSize: 12 }}>الملاحظات</div>
              <div>{voucher.notes}</div>
            </div>
          )}

          {attachments.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px', fontWeight: 'bold' }}>المرفقات</h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '15px',
                }}
              >
                {attachments.map((attachment) => {
                  const name =
                    attachment?.file_name ||
                    attachment?.name ||
                    attachment?.original_name ||
                    attachment?.filename ||
                    `مرفق-${attachment?.id ?? ''}`;
                  const url =
                    attachment?.file_url ||
                    attachment?.url ||
                    attachment?.media_url ||
                    attachment?.path ||
                    attachment?.full_url ||
                    attachment?.link ||
                    '';
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
                        cursor: url ? 'pointer' : 'default',
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
                      { label: 'الحساب', width: '220px' },
                      { label: 'الكود', width: '120px' },
                      { label: 'المبلغ', width: '140px' },
                      { label: 'الوصف', width: '220px' },
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
                        }}
                      >
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {details.map((detail, index) => (
                    <tr
                      key={detail.id || index}
                      style={{
                        borderBottom: '1px solid #333',
                        backgroundColor: index % 2 === 0 ? '#202938' : '#1a1f2e',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(ev) => {
                        const row = ev.target.closest('tr');
                        if (row) row.style.backgroundColor = '#2a3441';
                      }}
                      onMouseLeave={(ev) => {
                        const row = ev.target.closest('tr');
                        if (row) row.style.backgroundColor = index % 2 === 0 ? '#202938' : '#1a1f2e';
                      }}
                    >
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                        {detail.account
                          ? detail.account.name_ar || detail.account.name || '-'
                          : '-'}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                        {detail.account?.code || '-'}
                      </td>
                      <td
                        style={{
                          padding: '18px 16px',
                          textAlign: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                      >
                        {(parseFloat(detail.amount) || 0).toLocaleString('ar-EG', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                        {detail.description || '-'}
                      </td>
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

export default ReceiptVoucherDetails;

