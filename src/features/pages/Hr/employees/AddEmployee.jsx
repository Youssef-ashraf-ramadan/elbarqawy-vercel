import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addEmployee, getDepartments, getPositions, getWorkShifts, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft, FaCamera, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AddEmployee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { departments, positions, workShifts, isLoading, error, success } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    email: '',
    phone: '',
    employee_code: '',
    birth_date: '',
    gender: 'male',
    department_id: '',
    position_id: '',
    work_shift_id: '',
    is_active: true
  });
  const [images, setImages] = useState([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getDepartments());
    dispatch(getPositions());
    dispatch(getWorkShifts());
  }, [dispatch]);

  // Handle success and error messages
  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      setTimeout(() => {
        navigate('/employees');
        dispatch(clearSuccess());
      }, 2000);
    }
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [success, error, navigate, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name_en || !formData.name_ar || !formData.email || !formData.phone || !formData.birth_date) {
      toast.error('جميع الحقول المطلوبة يجب ملؤها', { rtl: true });
      return;
    }
    
    // Create FormData for file upload
    const formDataToSend = new FormData();
    
    // Add all form fields
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        // Convert boolean to 0/1 for is_active field
        if (key === 'is_active') {
          formDataToSend.append(key, formData[key] ? '1' : '0');
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
    });
    
    // Add images as files - only add if there are actual files
    if (images.length > 0) {
      images.forEach((image, index) => {
        if (image.file) {
          formDataToSend.append(`images[${index}]`, image.file);
        }
      });
    }
    
  
    
    await dispatch(addEmployee(formDataToSend));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsUploadingImages(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      const newImages = files.map(file => ({
        id: Date.now() + Math.random(),
        url: URL.createObjectURL(file),
        file: file
      }));
      setImages(prev => [...prev, ...newImages]);
      setIsUploadingImages(false);
    }, 1000);
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleCancel = () => {
    navigate('/employees');
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
          onClick={() => navigate('/employees')}
          style={{
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            fontSize: '14px'
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
          إضافة موظف جديد
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
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            {/* العمود الأيسر */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              {/* الاسم بالعربي */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  الاسم بالعربي *
                </label>
                <input
                  type="text"
                  name="name_ar"
                  value={formData.name_ar}
                  onChange={handleInputChange}
                  placeholder="أدخل الاسم بالعربي"
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

              {/* الاسم بالإنجليزي */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  الاسم بالإنجليزي *
                </label>
                <input
                  type="text"
                  name="name_en"
                  value={formData.name_en}
                  onChange={handleInputChange}
                  placeholder="أدخل الاسم بالإنجليزي"
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

              {/* كود الموظف */}
              <div style={{ marginBottom: '20px' }}>
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
                  name="employee_code"
                  value={formData.employee_code}
                  onChange={handleInputChange}
                  placeholder="أدخل كود الموظف"
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

              {/* رقم الهاتف */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  رقم الهاتف
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#AC2000',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    zIndex: 1
                  }}>
                    +2
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                  onChange={handleInputChange}
                    placeholder="1xxxxxx"
                  style={{
                    width: '100%',
                      padding: '12px 50px 12px 15px',
                    backgroundColor: '#1a1f2e',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                  />
              </div>
            </div>

              {/* البريد الإلكتروني */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="أدخل البريد الإلكتروني"
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

            </div>

            {/* العمود الأيمن */}
            <div style={{ flex: '1', minWidth: '300px' }}>

              {/* تاريخ الميلاد */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  تاريخ الميلاد *
                </label>
                <div style={{ position: 'relative' }}>
                <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                  onChange={handleInputChange}
                    required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    backgroundColor: '#1a1f2e',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                      fontSize: '14px',
                      colorScheme: 'dark'
                  }}
                />
                </div>
              </div>

              {/* الجنس */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  الجنس
                </label>
                <select
                  name="gender"
                  value={formData.gender}
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
                  <option value="">-- اختر --</option>
                  <option value="male" style={{ backgroundColor: '#1a1f2e' }}>ذكر</option>
                  <option value="female" style={{ backgroundColor: '#1a1f2e' }}>أنثى</option>
                </select>
              </div>

              {/* المسمى الوظيفي */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  المسمى الوظيفي
                </label>
                <select
                  name="position_id"
                  value={formData.position_id}
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
                  <option value="" style={{ backgroundColor: '#1a1f2e' }}>اختر المسمى الوظيفي</option>
                  {positions?.map(position => (
                    <option key={position.id} value={position.id} style={{ backgroundColor: '#1a1f2e' }}>
                      {position.name}
                    </option>
                  ))}
                </select>
            </div>

              {/* شيفت العمل */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  شيفت العمل
                </label>
                <select
                  name="work_shift_id"
                  value={formData.work_shift_id}
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
                  <option value="" style={{ backgroundColor: '#1a1f2e' }}>اختر شيفت العمل</option>
                  {workShifts?.map(shift => (
                    <option key={shift.id} value={shift.id} style={{ backgroundColor: '#1a1f2e' }}>
                      {shift.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* حالة الموظف */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  حالة الموظف
                </label>
                <select
                  name="is_active"
                  value={formData.is_active ? 'active' : 'inactive'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    is_active: e.target.value === 'active'
                  }))}
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
                  <option value="active" style={{ backgroundColor: '#1a1f2e' }}>نشط</option>
                  <option value="inactive" style={{ backgroundColor: '#1a1f2e' }}>غير نشط</option>
                </select>
              </div>
            </div>
          </div>

          {/* القسم - Full Width */}
          <div style={{ marginTop: '30px', width: '100%' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'white',
              fontWeight: '500'
            }}>
              القسم
            </label>
            <select
              name="department_id"
              value={formData.department_id}
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
              <option value="" style={{ backgroundColor: '#1a1f2e' }}>اختر القسم</option>
              {departments?.map(dept => (
                <option key={dept.id} value={dept.id} style={{ backgroundColor: '#1a1f2e' }}>
                  {dept.name}
                </option>
              ))}
            </select>
            </div>

          {/* رفع الصور - Full Width */}
          <div style={{ marginTop: '30px', width: '100%' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '15px',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '16px'
            }}>
              صور الموظف
            </label>
            
            {/* زر رفع الصور */}
            <div style={{ marginBottom: '20px' }}>
              <input
                type="file"
                id="imageUpload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                disabled={isUploadingImages}
              />
              <label
                htmlFor="imageUpload"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'transparent',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  cursor: isUploadingImages ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  border: '2px solid #AC2000',
                  opacity: isUploadingImages ? 0.6 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {isUploadingImages ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #AC2000',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    جاري الرفع...
                  </>
                ) : (
                  <>
                    <FaPlus />
                    إضافة صور
                  </>
                )}
              </label>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
            </div>
            
            {/* عرض الصور المرفوعة */}
            {images.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '15px',
                marginTop: '20px'
              }}>
                {images.map((image, index) => (
                  <div key={image.id || index} style={{ position: 'relative' }}>
                    <img
                      src={image.url}
                      alt={`صورة ${index + 1}`}
                      style={{
                        width: '100%',
                height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #333'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
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
                      <FaTrash />
                    </button>
              </div>
                ))}
              </div>
            )}
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
                backgroundColor: isLoading ? '#666' : '#AC2000',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  جاري الإضافة...
                </>
              ) : (
                <>
              <FaPlus />
              إضافة موظف جديد
                </>
              )}
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

export default AddEmployee;
