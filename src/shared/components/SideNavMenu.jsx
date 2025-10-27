import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHome, FaShieldAlt, FaUsers, FaBook, FaGraduationCap, FaSchool, FaLanguage, FaBuilding, FaLayerGroup, FaDoorOpen, FaChartLine, FaUserGraduate, FaBox, FaChalkboardTeacher, FaLock, FaUserTie, FaClock, FaMoneyBillWave, FaCalendarAlt, FaCogs, FaChartBar, FaKey, FaCog, FaChevronDown, FaCalculator, FaCashRegister, FaWarehouse, FaTruck, FaPhone, FaCalendarCheck, FaHandHoldingUsd, FaGift, FaMinus, FaLightbulb, FaFileInvoice, FaClipboard } from "react-icons/fa";
import './SideNavMenu.css';

const SideNavMenu = ({ handleLinkClick }) => {
  const location = useLocation();
  const [isHrDropdownOpen, setIsHrDropdownOpen] = React.useState(false);
  const [isReportsDropdownOpen, setIsReportsDropdownOpen] = React.useState(false);
  
  // استخدام Redux store للحصول على بيانات المستخدم
  const user = useSelector((state) => state.auth.user);
  
  // fallback للبيانات من sessionStorage في حالة عدم وجود بيانات في Redux store
  const getUserData = () => {
    if (user) return user;
    
    const storedUser = sessionStorage.getItem("useralbaraqawy");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  };

  // تعريف القوائم
  const menuItems = [
    {
      path: "/",
      icon: <FaHome style={{ fontSize: "20px", color: "#6b7280" }} />,
      text: "الرئيسية"
    },
  ];

  const userData = getUserData();

  // دالة للتحكم في فتح وإغلاق dropdown HR
  const toggleHrDropdown = () => {
    console.log('Toggle HR Dropdown clicked, current state:', isHrDropdownOpen);
    setIsHrDropdownOpen(!isHrDropdownOpen);
  };

  // إغلاق الـ dropdown عند النقر خارجه
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isHrDropdownOpen && !event.target.closest('.dropdown')) {
        setIsHrDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHrDropdownOpen]);

  // إذا لم يكن هناك مستخدم، اعرض القائمة الافتراضية
    if (!userData) {
    return (
      <ul className="mb-0 list-unstyled main-ul" style={{ gap: "0.5rem", marginTop: "20px" }}>
        {/* عرض عناصر القائمة من menuItems */}
        {menuItems.map((item, index) => (
          <li key={index} className={location.pathname === item.path ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative' }}>
            <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
              {item.icon}
            </div>
            <Link to={item.path} onClick={handleLinkClick}>
              <span style={{ marginRight: "0.25rem" }}>{item.text}</span>
            </Link>
          </li>
        ))}

        {/* HR Dropdown */}
        <li className="dropdown" style={{ marginBottom: "0.25rem", position: 'relative' }}>
          <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
            <FaBuilding style={{ fontSize: "20px", color: location.pathname.startsWith('/') && (location.pathname === '/' || location.pathname.startsWith('/employees') || location.pathname.startsWith('/attendance') || location.pathname.startsWith('/salaries') || location.pathname.startsWith('/vacations') || location.pathname.startsWith('/shifts') || location.pathname.startsWith('/job-titles') || location.pathname.startsWith('/reports') || location.pathname.startsWith('/permissions') || location.pathname.startsWith('/settings')) ? "#0CAD5D" : "#6b7280" }} />
          </div>
          <button 
            className="btn dropdown-toggle" 
            type="button" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleHrDropdown();
            }}
            aria-expanded={isHrDropdownOpen}
            style={{
              background: "none",
              border: "none",
              color: location.pathname.startsWith('/') && (location.pathname === '/' || location.pathname.startsWith('/employees') || location.pathname.startsWith('/attendance') || location.pathname.startsWith('/salaries') || location.pathname.startsWith('/vacations') || location.pathname.startsWith('/shifts') || location.pathname.startsWith('/job-titles') || location.pathname.startsWith('/permissions') || location.pathname.startsWith('/settings')) ? "#0CAD5D" : "#6b7280",
              borderRadius: "25px",
              width: "74%",
              marginInline: "4px",
              textAlign: "right",
              padding : "8px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer"
            }}
          >
            <span style={{ marginRight: "0.25rem", fontSize: "14px" }}>قسم HR</span>
          </button>
          {isHrDropdownOpen && (
            <ul className="dropdown-menu" style={{ 
              backgroundColor: "#202938",
              border: "1px solid #0CAD5D",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
              minWidth: "200px",
              position: "absolute",
              top: "40px",
              zIndex: 1000,
              display: "block"
            }}>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/employees" ? 'active' : ''}`} 
                to="/employees" 
                onClick={() => {
                  handleLinkClick();
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: location.pathname === "/employees" ? "#0CAD5D" : "#6b7280",
                  textDecoration: "none"
                }}
              >
                <FaUserTie style={{ fontSize: "16px", marginLeft: "8px" }} />
                الموظفين
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/attendance" ? 'active' : ''}`} 
                to="/attendance" 
                onClick={() => {
                  handleLinkClick();
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: location.pathname === "/attendance" ? "#0CAD5D" : "#6b7280",
                  textDecoration: "none"
                }}
              >
                <FaClock style={{ fontSize: "16px", marginLeft: "8px" }} />
                الحضور والانصراف
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/salaries" ? 'active' : ''}`} 
                to="/salaries" 
                onClick={() => {
                  handleLinkClick();
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: location.pathname === "/salaries" ? "#0CAD5D" : "#6b7280",
                  textDecoration: "none"
                }}
              >
                <FaMoneyBillWave style={{ fontSize: "16px", marginLeft: "8px" }} />
                المرتبات
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/vacations" ? 'active' : ''}`} 
                to="/vacations" 
                onClick={() => {
                  handleLinkClick();
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: location.pathname === "/vacations" ? "#0CAD5D" : "#6b7280",
                  textDecoration: "none"
                }}
              >
                <FaCalendarAlt style={{ fontSize: "16px", marginLeft: "8px" }} />
                الإجازات
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/leave-requests" ? 'active' : ''}`} 
                to="/leave-requests" 
                onClick={() => {
                  handleLinkClick();
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: location.pathname === "/leave-requests" ? "#0CAD5D" : "#6b7280",
                  textDecoration: "none"
                }}
              >
                <FaCalendarCheck style={{ fontSize: "16px", marginLeft: "8px" }} />
                طلبات الإجازات
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/shifts" ? 'active' : ''}`} 
                to="/shifts" 
                onClick={() => {
                  handleLinkClick();
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: location.pathname === "/shifts" ? "#0CAD5D" : "#6b7280",
                  textDecoration: "none"
                }}
              >
                <FaCogs style={{ fontSize: "16px", marginLeft: "8px" }} />
                الورديات
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/job-titles" ? 'active' : ''}`} 
                to="/job-titles" 
                onClick={() => {
                  handleLinkClick();
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: location.pathname === "/job-titles" ? "#0CAD5D" : "#6b7280",
                  textDecoration: "none"
                }}
              >
                <FaUserTie style={{ fontSize: "16px", marginLeft: "8px" }} />
                المسمى الوظيفي
              </Link>
            </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/payslips" ? 'active' : ''}`} 
              to="/payslips" 
              onClick={() => {
                handleLinkClick();
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: location.pathname === "/payslips" ? "#0CAD5D" : "#6b7280",
                textDecoration: "none"
              }}
            >
              <FaFileInvoice style={{ fontSize: "16px", marginLeft: "8px" }} />
              كشف الرواتب
              </Link>
            </li>
          </ul>
          )}
        </li>
      </ul>
    );
  }


  // عرض جميع القوائم بدون تصفية
  const filteredMenuItems = menuItems;
  

  return (
    <ul className="mb-0  list-unstyled main-ul" style={{ gap: "0.5rem", marginTop: "20px" }}>
      {/* الرئيسية */}
      <li className={location.pathname === "/" ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative' }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaHome style={{ fontSize: "20px", color: location.pathname === "/" ? "#0CAD5D" : "#6b7280" }} />
        </div>
        <Link to="/" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem" }}>الرئيسية</span>
        </Link>
      </li>

      {/* HR Dropdown */}
      <li className="dropdown" style={{ marginBottom: "0.25rem", position: 'relative' }}>
        <div 
          className="icon" 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            width: "25px", 
            height: "25px" 
          }}
        >
            <FaBuilding 
              style={{ 
                fontSize: "20px", 
                color: location.pathname.startsWith('/') && (location.pathname === '/' || location.pathname.startsWith('/employees') || location.pathname.startsWith('/attendance') || location.pathname.startsWith('/salaries') || location.pathname.startsWith('/vacations') || location.pathname.startsWith('/shifts') || location.pathname.startsWith('/job-titles') || location.pathname.startsWith('/permissions') || location.pathname.startsWith('/settings')) ? "#0CAD5D" : "#6b7280" 
              }} 
            />
        </div>
        <button 
          className="btn dropdown-toggle" 
          type="button" 
          onClick={() => setIsHrDropdownOpen(!isHrDropdownOpen)}
          style={{
            background: "none",
            border: "none",
            color: isHrDropdownOpen || (location.pathname.startsWith('/') && (location.pathname === '/' || location.pathname.startsWith('/employees') || location.pathname.startsWith('/attendance') || location.pathname.startsWith('/salaries') || location.pathname.startsWith('/vacations') || location.pathname.startsWith('/shifts') || location.pathname.startsWith('/job-titles') || location.pathname.startsWith('/permissions') || location.pathname.startsWith('/settings'))) ? "#0CAD5D" : "#6b7280",
            borderRadius: "25px",
            width: "74%",
            marginInline: "4px",
            textAlign: "right",
            padding : "8px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <span style={{ marginRight: "0.25rem", fontSize: "14px" }}>قسم HR</span>
        </button>
        {isHrDropdownOpen && (
          <ul className="dropdown-menu" style={{ 
            backgroundColor: "#202938",
            border: "1px solid #0CAD5D",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            minWidth: "200px",
            position: "absolute",
            top: "40px",
            zIndex: 1000,
            display: "block"
          }}>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/employees" ? 'active' : ''}`} 
              to="/employees" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: location.pathname === "/employees" ? "#0CAD5D" : "#6b7280",
                textDecoration: "none"
              }}
            >
              <FaUserTie style={{ fontSize: "16px", marginLeft: "8px" }} />
              الموظفين
            </Link>
          </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/attendance" ? 'active' : ''}`} 
              to="/attendance" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: location.pathname === "/attendance" ? "#0CAD5D" : "#6b7280",
                textDecoration: "none"
              }}
            >
              <FaClock style={{ fontSize: "16px", marginLeft: "8px" }} />
              الحضور والانصراف
            </Link>
          </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/salaries" ? 'active' : ''}`} 
              to="/salaries" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: location.pathname === "/salaries" ? "#0CAD5D" : "#6b7280",
                textDecoration: "none"
              }}
            >
              <FaMoneyBillWave style={{ fontSize: "16px", marginLeft: "8px" }} />
              المرتبات
            </Link>
          </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/vacations" ? 'active' : ''}`} 
              to="/vacations" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: location.pathname === "/vacations" ? "#0CAD5D" : "#6b7280",
                textDecoration: "none"
              }}
            >
              <FaCalendarAlt style={{ fontSize: "16px", marginLeft: "8px" }} />
              الإجازات
            </Link>
          </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/leave-requests" ? 'active' : ''}`} 
              to="/leave-requests" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: location.pathname === "/leave-requests" ? "#0CAD5D" : "#6b7280",
                textDecoration: "none"
              }}
            >
              <FaCalendarCheck style={{ fontSize: "16px", marginLeft: "8px" }} />
              طلبات الإجازات
            </Link>
          </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/shifts" ? 'active' : ''}`} 
              to="/shifts" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: location.pathname === "/shifts" ? "#0CAD5D" : "#6b7280",
                textDecoration: "none"
              }}
            >
              <FaCogs style={{ fontSize: "16px", marginLeft: "8px" }} />
              الورديات
            </Link>
          </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/job-titles" ? 'active' : ''}`} 
              to="/job-titles" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: location.pathname === "/job-titles" ? "#0CAD5D" : "#6b7280",
                textDecoration: "none"
              }}
            >
              <FaUserTie style={{ fontSize: "16px", marginLeft: "8px" }} />
              المسمى الوظيفي
            </Link>
          </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/payslips" ? 'active' : ''}`} 
              to="/payslips" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: location.pathname === "/payslips" ? "#0CAD5D" : "#6b7280",
                textDecoration: "none"
              }}
            >
              <FaFileInvoice style={{ fontSize: "16px", marginLeft: "8px" }} />
              كشف الرواتب
            </Link>
          </li>
          <li style={{ display: isHrDropdownOpen ? 'block' : 'none' }}>
            <Link 
              className={`dropdown-item ${location.pathname === "/departments" ? 'active' : ''}`} 
              to="/departments" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: location.pathname === "/departments" ? "#0CAD5D" : "#6b7280",
                textDecoration: "none"
              }}
            >
              <FaLayerGroup style={{ fontSize: "16px", marginLeft: "8px" }} />
              الأقسام
            </Link>
          </li>
        </ul>
        )}
      </li>

      {/* التقارير Dropdown */}
      <li className={location.pathname.startsWith('/reports') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative', display: isHrDropdownOpen ? 'none' : 'flex' }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaChartBar style={{ fontSize: "20px", color: "#0CAD5D" }} />
        </div>
        <button
          className="btn dropdown-toggle"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsReportsDropdownOpen(!isReportsDropdownOpen);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#0CAD5D",
            borderRadius: "25px",
            width: "74%",
            marginInline: "4px",
            textAlign: "right",
            padding: "8px 0",
            display: "flex",
            alignItems: "center",
            cursor: "pointer"
          }}
        >
          <span style={{ marginRight: "0.25rem", fontSize: "14px" }}>التقارير</span>
        
        </button>
        {isReportsDropdownOpen && (
          <ul className="dropdown-menu" style={{ 
            backgroundColor: "#202938",
            border: "1px solid #0CAD5D",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            minWidth: "200px",
            position: "absolute",
            top: "40px",
            right: "0",
            zIndex: 1000,
            display: "block",
            marginTop: "5px"
          }}>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/reports/leave" ? 'active' : ''}`} 
                to="/reports/leave" 
                onClick={() => {
                  handleLinkClick();
                  setIsReportsDropdownOpen(false);
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: location.pathname === "/reports/leave" ? "#0CAD5D" : "#6b7280",
                  textDecoration: "none"
                }}
              >
                <FaCalendarAlt style={{ fontSize: "16px", marginLeft: "8px" }} />
                طلبات الإجازة
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/reports/attendance" ? 'active' : ''}`} 
                to="/reports/attendance" 
                onClick={() => {
                  handleLinkClick();
                  setIsReportsDropdownOpen(false);
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: location.pathname === "/reports/attendance" ? "#0CAD5D" : "#6b7280",
                  textDecoration: "none"
                }}
              >
                <FaClipboard style={{ fontSize: "16px", marginLeft: "8px" }} />
                الحضور والانصراف
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/reports/payroll" ? 'active' : ''}`} 
                to="/reports/payroll" 
                onClick={() => {
                  handleLinkClick();
                  setIsReportsDropdownOpen(false);
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: location.pathname === "/reports/payroll" ? "#0CAD5D" : "#6b7280",
                  textDecoration: "none"
                }}
              >
                <FaFileInvoice style={{ fontSize: "16px", marginLeft: "8px" }} />
                كشف الراتب
            </Link>
          </li>
        </ul>
        )}
      </li>
    </ul>
  );
};

export default SideNavMenu;
