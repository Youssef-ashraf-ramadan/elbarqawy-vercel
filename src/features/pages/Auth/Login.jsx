import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../redux/Slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

// إضافة CSS للـ placeholder
const style = document.createElement('style');
style.innerHTML = `
  .login-input::placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
    opacity: 1 !important;
  }
  .login-input::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
    opacity: 1 !important;
  }
  .login-input::-moz-placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
    opacity: 1 !important;
  }
  .login-input:-ms-input-placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
    opacity: 1 !important;
  }
`;
if (!document.querySelector('#login-placeholder-style')) {
  style.id = 'login-placeholder-style';
  document.head.appendChild(style);
}

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [shake, setShake] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error, user } = useSelector((state) => state.auth);

    // إذا كان المستخدم مسجل مسبقاً (من sessionStorage) نحوله مباشرة عند فتح الصفحة
    useEffect(() => {
        try {
            const storedUser = sessionStorage.getItem('useralbaraqawy');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                const token = parsed?.token || parsed?.data?.token || parsed?.user?.token || parsed?.result?.token;
                if (token) {
                    navigate('/');
                }
            }
        } catch {}
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setShake(true);
            toast.error('يجب إدخال البريد الإلكتروني وكلمة المرور', {
                position: "top-right",
                rtl: true
            });
            setTimeout(() => setShake(false), 500);
            return;
        }

        try {
            const result = await dispatch(loginUser({ email, password })).unwrap();
            const successMessage = (result && (result.message === 'front.login-success')) ? 'تم تسجيل الدخول بنجاح' : (result?.message || 'تم تسجيل الدخول بنجاح');
            toast.success(successMessage, { rtl: true, autoClose: 1200 });
            setTimeout(() => navigate('/'), 1200);
        } catch (err) {
            setShake(true);
            toast.error(err.message || 'فشل تسجيل الدخول', {
                autoClose: 1500
            });
            setTimeout(() => setShake(false), 500);
        }
    };

    const LoadingSpinner = () => (
        <div className="spinner-border text-light" role="status" style={{ width: '1.5rem', height: '1.5rem' }}>
            <span className="visually-hidden">Loading...</span>
        </div>
    );

    return (
        <div className="container-fluid d-flex p-0"
            style={{
                height: '100vh',
                background: 'white',
                overflow: 'hidden',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }}>
            <ToastContainer />
            
            {/* الصورة على اليسار - 60% */}
            <div className="col-md-7 d-none d-md-block p-0" style={{ height: '100vh', position: 'relative' }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="h-100 position-relative">
                    <img 
                        src="/loginbackground.jpg" 
                        alt="Login Background" 
                        className="img-fluid h-100 w-100"
                        style={{
                            objectFit: 'cover',
                            height: '100vh'
                        }}
                    />
                    {/* Overlay داكن */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.4)'
                    }}></div>
                    
                    {/* محتوى الصورة */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        right: '60px',
                        transform: 'translateY(-50%)',
                        textAlign: 'right',
                        color: 'white',
                        zIndex: 2
                    }}>
                        {/* شعار الشركة */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h1 style={{ 
                                fontSize: '4rem', 
                                fontWeight: 'bold', 
                                margin: 0,
                                fontFamily: 'Arial, sans-serif'
                            }}>ACE</h1>
                            <h2 style={{ 
                                fontSize: '1.5rem', 
                                margin: 0,
                                fontFamily: 'Arial, sans-serif'
                            }}>ALBARQAWY</h2>
                        </div>
                        
                        {/* وصف الشركة */}
                        <p style={{ 
                            fontSize: '1.2rem', 
                            lineHeight: '1.6',
                            maxWidth: '400px',
                            fontFamily: 'Arial, sans-serif'
                        }}>
                            مكتب هندسي متخصص في التصميمات المعمارية والإنشائية، نقدم حلول مبتكرة لتنفيذ المشاريع بجودة عالية ووفق أعلى المعايير.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* النموذج على اليمين - 40% */}
            <div className="col-md-5 col-12 d-flex justify-content-center align-items-center px-4"
                style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    position: 'relative'
                }}>
                {/* الخطوط المتموجة الخلفية */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    opacity: 0.1
                }}></div>

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className={`${shake ? 'shake-animation' : ''}`}
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        zIndex: 1
                    }}>

                        {/* اللوجو */}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                        className="text-center">
                            <img 
                                src="/logoArabic.png" 
                            alt="ALBARQAWY Logo" 
                                style={{
                                    height: '80px',
                                width: 'auto',
                                marginBottom: '1rem'
                                }}
                            />
                        </motion.div>

                    {/* عنوان تسجيل الدخول */}
                    <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        className="text-center mb-5 fw-bold"
                            style={{ 
                            color: 'white', 
                            fontSize: '25px',
                            fontFamily: 'Montserrat-Arabic, sans-serif',
                                fontWeight: '500'
                            }}>
                        سجل دخول الى حسابك
                    </motion.h2>


                        <form onSubmit={handleSubmit}>
                        {/* البريد الإلكتروني */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mb-4">
                            <label htmlFor="email" className="form-label fw-medium d-block text-end" style={{ 
                                color: 'white', 
                                marginBottom: '0.5rem',
                                fontFamily: 'Montserrat-Arabic, sans-serif',
                                fontWeight: '500'
                            }}>
                                البريد الإلكتروني
                                </label>
                                    <input
                                type="email"
                                        className="form-control login-input"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                        required
                                        style={{ 
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    border: '2px solid #AC2000',
                                    borderRadius: '8px',
                                    color: 'white',
                                    padding: '12px 16px',
                                    fontSize: '1.1rem'
                                }}
                            />
                            </motion.div>

                            {/* حقل كلمة المرور */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="mb-4">
                            <label htmlFor="password" className="form-label fw-medium d-block text-end" style={{ 
                                color: 'white', 
                                marginBottom: '0.5rem',
                                fontFamily: 'Montserrat-Arabic, sans-serif',
                                fontWeight: '500'
                            }}>
                                    كلمة المرور
                                </label>
                            <div className="position-relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control login-input"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    placeholder="************"
                                        required
                                    style={{ 
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        border: '2px solid #AC2000',
                                        borderRadius: '8px',
                                        color: 'white',
                                        padding: '12px 16px 12px 16px',
                                        fontSize: '1.1rem'
                                    }}
                                    />
                                    <button
                                        type="button"
                                    className="position-absolute"
                                        onClick={() => setShowPassword(!showPassword)}
                                    style={{ 
                                        top: '50%',
                                        left: '12px',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem'
                                    }}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </motion.div>

                            {/* زر تسجيل الدخول */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="btn w-100 text-white py-3 fw-medium"
                                style={{
                                backgroundColor: '#AC2000',
                                    border: 'none',
                                borderRadius: '8px',
                                fontSize: '1.2rem',
                                marginTop: '1rem',
                                fontWeight: 'bold',
                                fontFamily: 'Montserrat-Arabic, sans-serif'
                                }}
                                disabled={isLoading}>
                                {isLoading ? <LoadingSpinner /> : 'تسجيل الدخول'}
                            </motion.button>
                        <div className="text-center mt-3">
                            <span style={{ color: 'white', fontFamily: 'Montserrat-Arabic, sans-serif' }}>لا تملك حسابًا؟ </span>
                            <Link to="/register" style={{ color: '#AC2000', textDecoration: 'none', fontWeight: '600' }}>إنشاء حساب</Link>
                        </div>
                        </form>

                </motion.div>
            </div>

        </div>
    );
};

export default LoginPage;