import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addPosition, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AddJobTitle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, success } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('AddJobTitle handleSubmit called with formData:', formData);
    if (!formData.name_en || !formData.name_ar || !formData.description_en || !formData.description_ar) {
      console.log('Validation failed - missing fields');
      toast.error('جميع الحقول مطلوبة', { rtl: true });
      return;
    }
    console.log('Dispatching addPosition...');
    await dispatch(addPosition(formData));
  };

  React.useEffect(() => {
    console.log('AddJobTitle useEffect - success:', success, 'error:', error);
    if (success) {
      console.log('Showing success toast:', success);
      toast.success(success, { rtl: true });
      // Navigate after showing toast
      setTimeout(() => {
        navigate('/job-titles');
        dispatch(clearSuccess());
      }, 1500);
    }
    if (error) {
      console.log('Showing error toast:', error);
      toast.error(error, { rtl: true });
      // Clear error after showing toast
      setTimeout(() => {
        dispatch(clearError());
      }, 100);
    }
  }, [success, error, navigate, dispatch]);

  const handleCancel = () => {
    navigate('/job-titles');
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
          onClick={() => navigate('/job-titles')}
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
          إضافة مسمى وظيفي جديد
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* الاسم بالعربية */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'white',
                fontWeight: '500'
              }}>
                الاسم بالعربية
              </label>
              <input
                type="text"
                name="name_ar"
                value={formData.name_ar}
                onChange={handleInputChange}
                placeholder="اسم المسمى الوظيفي"
                required
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

            {/* الاسم بالإنجليزية */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'white',
                fontWeight: '500'
              }}>
                الاسم بالإنجليزية
              </label>
              <input
                type="text"
                name="name_en"
                value={formData.name_en}
                onChange={handleInputChange}
                placeholder="Position Name in English"
                required
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

            {/* الوصف بالعربية */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'white',
                fontWeight: '500'
              }}>
                الوصف بالعربية
              </label>
              <textarea
                name="description_ar"
                value={formData.description_ar}
                onChange={handleInputChange}
                placeholder="وصف المسمى الوظيفي"
                required
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  backgroundColor: '#1a1f2e',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* الوصف بالإنجليزية */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'white',
                fontWeight: '500'
              }}>
                الوصف بالإنجليزية
              </label>
              <textarea
                name="description_en"
                value={formData.description_en}
                onChange={handleInputChange}
                placeholder="Position description in English"
                required
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  backgroundColor: '#1a1f2e',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
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
              disabled={isLoading}
              style={{
                backgroundColor: isLoading ? '#666' : '#0CAD5D',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FaPlus />
              {isLoading ? 'جاري الإضافة...' : 'إضافة'}
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

export default AddJobTitle;
