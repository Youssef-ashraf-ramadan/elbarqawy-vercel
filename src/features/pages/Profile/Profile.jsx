import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserProfile } from '../../../redux/Slices/authSlice';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, isLoading, error } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      // البيانات تأتي مباشرة من الـ response وليس داخل data object
      setProfileData(profile);
    }
  }, [profile]);

  useEffect(() => {
    if (error) {
      toast.error(error, { rtl: true });
    }
  }, [error]);

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div 
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        position: 'relative',
        padding: '40px 0'
      }}
    >
      {/* Background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.1
      }}></div>

      <div className="row justify-content-center w-100">
        <div className="col-md-8 col-lg-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card shadow-lg border-0"
            style={{ 
              borderRadius: '15px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <div 
              className="card-header text-white text-center py-4" 
              style={{ 
                borderRadius: '15px 15px 0 0',
                background: 'linear-gradient(135deg, #0CAD5D 0%, #08a04a 100%)',
                border: 'none'
              }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="d-flex justify-content-center mb-3"
              >
                <div 
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    fontSize: '2rem'
                  }}
                >
                  <FaUser />
                </div>
              </motion.div>
              <h4 className="mb-0" style={{ 
                fontFamily: 'Montserrat-Arabic, sans-serif',
                fontWeight: '600'
              }}>
                الملف الشخصي
              </h4>
            </div>

            <div className="card-body p-4" style={{ backgroundColor: 'transparent' }}>
              {profileData ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="row">
                    <div className="col-12">
                      <div className="info-item mb-4">
                        <div className="d-flex align-items-center mb-2">
                          <FaUser className="mx-3" style={{ fontSize: '1.2rem', color: '#0CAD5D' }} />
                          <h6 className="mb-0 text-white" style={{ fontFamily: 'Montserrat-Arabic, sans-serif', fontWeight: '600' }}>
                            الاسم الكامل
                          </h6>
                        </div>
                        <p className="text-white mb-0" style={{ fontFamily: 'Montserrat-Arabic, sans-serif', fontSize: '1.1rem', opacity: 0.9 }}>
                          {profileData.name || 'غير محدد'}
                        </p>
                      </div>

                      <div className="info-item mb-4">
                        <div className="d-flex align-items-center mb-2">
                          <FaEnvelope className="mx-3" style={{ fontSize: '1.2rem', color: '#0CAD5D' }} />
                          <h6 className="mb-0 text-white" style={{ fontFamily: 'Montserrat-Arabic, sans-serif', fontWeight: '600' }}>
                            البريد الإلكتروني
                          </h6>
                        </div>
                        <p className="text-white mb-0" style={{ fontFamily: 'Montserrat-Arabic, sans-serif', fontSize: '1.1rem', opacity: 0.9 }}>
                          {profileData.email || 'غير محدد'}
                        </p>
                      </div>

                      <div className="info-item mb-4">
                        <div className="d-flex align-items-center mb-2">
                          <FaPhone className="mx-3" style={{ fontSize: '1.2rem', color: '#0CAD5D' }} />
                          <h6 className="mb-0 text-white" style={{ fontFamily: 'Montserrat-Arabic, sans-serif', fontWeight: '600' }}>
                            رقم الهاتف
                          </h6>
                        </div>
                        <p className="text-white mb-0" style={{ fontFamily: 'Montserrat-Arabic, sans-serif', fontSize: '1.1rem', opacity: 0.9 }}>
                          {profileData.phone || 'غير محدد'}
                        </p>
                      </div>

                      <div className="info-item mb-4">
                        <div className="d-flex align-items-center mb-2">
                          <FaCheckCircle className="mx-3" style={{ fontSize: '1.2rem', color: '#0CAD5D' }} />
                          <h6 className="mb-0 text-white" style={{ fontFamily: 'Montserrat-Arabic, sans-serif', fontWeight: '600' }}>
                            حالة الحساب
                          </h6>
                        </div>
                        <p className="mb-0" style={{ fontFamily: 'Montserrat-Arabic, sans-serif', fontSize: '1.1rem' }}>
                          <span className={`badge ${profileData.is_active ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '0.9rem' }}>
                            {profileData.is_active ? 'نشط' : 'غير نشط'}
                          </span>
                        </p>
                      </div>

                      <div className="info-item mb-4">
                        <div className="d-flex align-items-center mb-2">
                          <FaCalendarAlt className="mx-3" style={{ fontSize: '1.2rem', color: '#0CAD5D' }} />
                          <h6 className="mb-0 text-white" style={{ fontFamily: 'Montserrat-Arabic, sans-serif', fontWeight: '600' }}>
                            تاريخ الإنشاء
                          </h6>
                        </div>
                        <p className="text-white mb-0" style={{ fontFamily: 'Montserrat-Arabic, sans-serif', fontSize: '1.1rem', opacity: 0.9 }}>
                          {formatDate(profileData.created_at)}
                        </p>
                      </div>

                      {profileData.email_verified_at && (
                        <div className="info-item mb-4">
                          <div className="d-flex align-items-center mb-2">
                            <FaCheckCircle className="mx-3" style={{ fontSize: '1.2rem', color: '#0CAD5D' }} />
                            <h6 className="mb-0 text-white" style={{ fontFamily: 'Montserrat-Arabic, sans-serif', fontWeight: '600' }}>
                              تاريخ تأكيد البريد الإلكتروني
                            </h6>
                          </div>
                          <p className="text-white mb-0" style={{ fontFamily: 'Montserrat-Arabic, sans-serif', fontSize: '1.1rem', opacity: 0.9 }}>
                            {formatDate(profileData.email_verified_at)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-white" style={{ fontFamily: 'Montserrat-Arabic, sans-serif', opacity: 0.9 }}>
                    لا توجد بيانات متاحة
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
