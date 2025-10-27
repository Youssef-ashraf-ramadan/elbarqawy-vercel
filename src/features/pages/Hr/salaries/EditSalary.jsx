import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';

const EditSalary = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee: 'احمد يونس محمد',
    basicSalary: '00.00',
    transportAllowance: '',
    housingAllowance: '',
    bonuses: '',
    deductions: '',
    totalAllowances: '',
    netSalary: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // منطق تعديل الراتب
    console.log('Updated salary data:', formData);
    navigate('/salaries');
  };

  const handleCancel = () => {
    navigate('/salaries');
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
        <button
          onClick={() => navigate('/salaries')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#0CAD5D',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}
        >
          <FaArrowLeft />
          الرجوع
        </button>
        
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: 'white',
          margin: 0
        }}>
          تعديل الراتب
        </h1>
      </div>

      {/* النموذج */}
      <div style={{
        backgroundColor: '#202938',
        borderRadius: '12px',
        padding: '30px',
        border: '1px solid #333'
      }}>
        <form onSubmit={handleSubmit}>
          {/* معلومات الراتب */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px'
            }}>
              معلومات الراتب
            </h3>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {/* اختيار الموظف */}
              <div style={{ flex: '1', minWidth: '300px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  اسم الموظف
                </label>
                <select
                  name="employee"
                  value={formData.employee}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    backgroundColor: '#1a1f2e',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                >
                  <option value="احمد يونس محمد" style={{ backgroundColor: '#1a1f2e' }}>احمد يونس محمد</option>
                  <option value="محمد علي أحمد" style={{ backgroundColor: '#1a1f2e' }}>محمد علي أحمد</option>
                  <option value="سارة محمد" style={{ backgroundColor: '#1a1f2e' }}>سارة محمد</option>
                </select>
              </div>

              {/* كود الموظف */}
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  كود الموظف
                </label>
                <input
                  type="text"
                  value="1155611"
                  readOnly
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    backgroundColor: '#1a1f2e',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#0CAD5D',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* الحالة */}
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  الحالة
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    backgroundColor: '#1a1f2e',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                >
                  <option value="paid" style={{ backgroundColor: '#1a1f2e' }}>مدفوع</option>
                  <option value="unpaid" style={{ backgroundColor: '#1a1f2e' }}>غير مدفوع</option>
                </select>
              </div>
            </div>
          </div>

          {/* تفاصيل الراتب */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px'
            }}>
              تفاصيل الراتب
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {/* الراتب الأساسي */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  الراتب الاساسي
                </label>
                <input
                  type="number"
                  name="basicSalary"
                  value={formData.basicSalary}
                  onChange={handleInputChange}
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

              {/* بدل المواصلات */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  بدل المواصلات
                </label>
                <input
                  type="text"
                  name="transportAllowance"
                  value={formData.transportAllowance}
                  onChange={handleInputChange}
                  placeholder="---"
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

              {/* بدل السكن */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  بدل السكن
                </label>
                <input
                  type="text"
                  name="housingAllowance"
                  value={formData.housingAllowance}
                  onChange={handleInputChange}
                  placeholder="---"
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

              {/* المكافآت */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  المكافآت
                </label>
                <input
                  type="text"
                  name="bonuses"
                  value={formData.bonuses}
                  onChange={handleInputChange}
                  placeholder="---"
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

              {/* إجمالي البدلات */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  إجمالي البدلات
                </label>
                <input
                  type="text"
                  name="totalAllowances"
                  value={formData.totalAllowances}
                  onChange={handleInputChange}
                  placeholder="---"
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

              {/* صافي الراتب */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  صافي الراتب *
                </label>
                <input
                  type="text"
                  name="netSalary"
                  value={formData.netSalary}
                  onChange={handleInputChange}
                  placeholder="---"
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
          </div>

          {/* أزرار الإجراء */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            marginTop: '30px',
            justifyContent: 'center'
          }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#0CAD5D',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FaEdit />
              تعديل
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              style={{
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              الغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSalary;
