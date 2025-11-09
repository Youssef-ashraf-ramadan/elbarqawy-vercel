import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDepartmentDetails, updateDepartment, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditDepartment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { departmentDetails, isLoading, error, success } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: ''
  });

  useEffect(() => {
    if (id) {
      dispatch(getDepartmentDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (departmentDetails) {
      setFormData({
        name_en: departmentDetails.name_en || departmentDetails.name || '',
        name_ar: departmentDetails.name_ar || departmentDetails.name || '',
        description_en: departmentDetails.description_en || departmentDetails.description || '',
        description_ar: departmentDetails.description_ar || departmentDetails.description || ''
      });
    }
  }, [departmentDetails]);

  useEffect(() => {
    if (success) {
      toast.success(success, { 
        rtl: true,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      setTimeout(() => {
        navigate('/departments');
        dispatch(clearSuccess());
      }, 2000);
    }
    if (error) {
      toast.error(error, { 
        rtl: true,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      setTimeout(() => {
        dispatch(clearError());
      }, 100);
    }
  }, [success, error, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name_en || !formData.name_ar || !formData.description_en || !formData.description_ar) {
      toast.error('Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ„ Ù…Ø·Ù„ÙˆØ¨Ø©', { rtl: true });
      return;
    }
    await dispatch(updateDepartment({ id, departmentData: formData }));
  };

  const handleCancel = () => {
    navigate('/departments');
  };

  if (isLoading && !departmentDetails) {
    return (
      <div style={{ 
        padding: '30px',
        backgroundColor: '#121828',
        minHeight: 'calc(100vh - 80px)',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '30px',
      backgroundColor: '#121828',
      minHeight: 'calc(100vh - 80px)',
      color: 'white'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: '#202938',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #333'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #333',
            backgroundColor: '#1a1f2e'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ 
                margin: 0, 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: 'white'
              }}>
                ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ù‚Ø³Ù…
              </h1>
              <button
                onClick={handleCancel}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaArrowLeft />
                Ø±Ø¬ÙˆØ¹
              </button>
            </div>
          </div>

          <div style={{ padding: '30px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {/* Ø§Ù„Ø§Ø³Ù… Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© */}
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    Ø§Ù„Ø§Ø³Ù… Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© *
                  </label>
                  <input
                    type="text"
                    name="name_ar"
                    value={formData.name_ar}
                    onChange={handleChange}
                    placeholder="Ø£Ø¯Ø®Ù„ Ø§Ø³Ù… Ø§Ù„Ù‚Ø³Ù… Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©"
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

                {/* Ø§Ù„Ø§Ø³Ù… Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© */}
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    Ø§Ù„Ø§Ø³Ù… Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© *
                  </label>
                  <input
                    type="text"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleChange}
                    placeholder="Ø£Ø¯Ø®Ù„ Ø§Ø³Ù… Ø§Ù„Ù‚Ø³Ù… Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©"
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

                {/* Ø§Ù„ÙˆØµÙ Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© */}
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    Ø§Ù„ÙˆØµÙ Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© *
                  </label>
                  <textarea
                    name="description_ar"
                    value={formData.description_ar}
                    onChange={handleChange}
                    placeholder="Ø£Ø¯Ø®Ù„ ÙˆØµÙ Ø§Ù„Ù‚Ø³Ù… Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©"
                    rows="3"
                    required
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

                {/* Ø§Ù„ÙˆØµÙ Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© */}
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    Ø§Ù„ÙˆØµÙ Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© *
                  </label>
                  <textarea
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleChange}
                    placeholder="Ø£Ø¯Ø®Ù„ ÙˆØµÙ Ø§Ù„Ù‚Ø³Ù… Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©"
                    rows="3"
                    required
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

              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '15px' 
              }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '12px 25px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Ø¥Ù„ØºØ§Ø¡
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    backgroundColor: '#AC2000',
                    color: 'white',
                    border: 'none',
                    padding: '12px 25px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø­ÙØ¸...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Ø­ÙØ¸ Ø§Ù„ØªØºÙŠÙŠØ±Ø§Øª
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDepartment;

