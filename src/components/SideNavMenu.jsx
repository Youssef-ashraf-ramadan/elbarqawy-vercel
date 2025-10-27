import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHome, FaShieldAlt, FaUsers, FaBook, FaGraduationCap, FaSchool, FaLanguage, FaBuilding, FaLayerGroup, FaDoorOpen, FaChartLine, FaUserGraduate, FaBox, FaChalkboardTeacher, FaLock, FaUserTie, FaClock, FaMoneyBillWave, FaCalendarAlt, FaCogs, FaChartBar, FaKey, FaCog, FaChevronDown, FaCalculator, FaUtensils, FaWarehouse, FaTruck, FaPhone, FaCalendarCheck } from "react-icons/fa";

const SideNavMenu = ({ handleLinkClick }) => {
  const location = useLocation();
  const [isHrDropdownOpen, setIsHrDropdownOpen] = React.useState(false);
  
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
      icon: <FaHome style={{ fontSize: "20px", color: "#ffffff" }} />,
      text: "الرئيسية"
    }
  ];

  const userData = getUserData();

  // دالة للتحكم في فتح وإغلاق dropdown HR
  const toggleHrDropdown = () => {
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
        {/* الرئيسية */}
        <li className={location.pathname === "/" ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative' }}>
          <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
            <FaHome style={{ fontSize: "20px", color: location.pathname === "/" ? "#5cceff" : "#6b7280" }} />
          </div>
          <Link to="/" onClick={handleLinkClick}>
            <span style={{ marginRight: "0.25rem" }}>الرئيسية</span>
          </Link>
        </li>

        {/* HR Dropdown */}
        <li className="dropdown" style={{ marginBottom: "0.25rem", position: 'relative' }}>
          <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
            <FaBuilding style={{ fontSize: "20px", color: location.pathname.startsWith('/hr') ? "#5cceff" : "#6b7280" }} />
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
              color: location.pathname.startsWith('/hr') ? "#5cceff" : "#6b7280",
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
              backgroundColor: "#f8f9fa",
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
                  color: location.pathname === "/employees" ? "#5cceff" : "#6b7280",
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
                  color: location.pathname === "/attendance" ? "#5cceff" : "#6b7280",
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
                  color: location.pathname === "/salaries" ? "#5cceff" : "#6b7280",
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
                  color: location.pathname === "/vacations" ? "#5cceff" : "#6b7280",
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
                  color: location.pathname === "/leave-requests" ? "#5cceff" : "#6b7280",
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
                  color: location.pathname === "/shifts" ? "#5cceff" : "#6b7280",
                  textDecoration: "none"
                }}
              >
                <FaCogs style={{ fontSize: "16px", marginLeft: "8px" }} />
                الورديات
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/reports" ? 'active' : ''}`} 
                to="/reports" 
                onClick={() => {
                  handleLinkClick();
                  setIsHrDropdownOpen(false);
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: location.pathname === "/reports" ? "#5cceff" : "#6b7280",
                  textDecoration: "none"
                }}
              >
                <FaChartBar style={{ fontSize: "16px", marginLeft: "8px" }} />
                التقارير
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/permissions" ? 'active' : ''}`} 
                to="/permissions" 
                onClick={() => {
                  handleLinkClick();
                  setIsHrDropdownOpen(false);
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: location.pathname === "/permissions" ? "#5cceff" : "#6b7280",
                  textDecoration: "none"
                }}
              >
                <FaKey style={{ fontSize: "16px", marginLeft: "8px" }} />
                الصلاحيات
              </Link>
            </li>
          </ul>
          )}
        </li>

        {/* الحسابات العامة */}
        <li className={location.pathname.startsWith('/accounting') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative' }}>
          <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
            <FaCalculator style={{ fontSize: "20px", color: location.pathname.startsWith('/accounting') ? "#5cceff" : "#6b7280" }} />
          </div>
          <Link to="/accounting" onClick={handleLinkClick}>
            <span style={{ marginRight: "0.25rem" }}>الحسابات العامة</span>
          </Link>
        </li>

        {/* إدارة المطاعم */}
        <li className={location.pathname.startsWith('/pos') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative' }}>
          <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
            <FaUtensils style={{ fontSize: "20px", color: location.pathname.startsWith('/pos') ? "#5cceff" : "#6b7280" }} />
          </div>
          <Link to="/pos" onClick={handleLinkClick}>
            <span style={{ marginRight: "0.25rem" }}>إدارة المطاعم</span>
          </Link>
        </li>

        {/* المخازن */}
        <li className={location.pathname.startsWith('/warehouse') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative' }}>
          <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
            <FaWarehouse style={{ fontSize: "20px", color: location.pathname.startsWith('/warehouse') ? "#5cceff" : "#6b7280" }} />
          </div>
          <Link to="/warehouse" onClick={handleLinkClick}>
            <span style={{ marginRight: "0.25rem" }}>المخازن</span>
          </Link>
        </li>

        {/* التوصيل */}
        <li className={location.pathname.startsWith('/delivery') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative' }}>
          <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
            <FaTruck style={{ fontSize: "20px", color: location.pathname.startsWith('/delivery') ? "#5cceff" : "#6b7280" }} />
          </div>
          <Link to="/delivery" onClick={handleLinkClick}>
            <span style={{ marginRight: "0.25rem" }}>التوصيل</span>
          </Link>
        </li>

        {/* الكول سنتر */}
        <li className={location.pathname.startsWith('/callcenter') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative' }}>
          <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
            <FaPhone style={{ fontSize: "20px", color: location.pathname.startsWith('/callcenter') ? "#5cceff" : "#6b7280" }} />
          </div>
          <Link to="/callcenter" onClick={handleLinkClick}>
            <span style={{ marginRight: "0.25rem" }}>الكول سنتر</span>
          </Link>
        </li>

        {/* الحجوزات */}
        <li className={location.pathname.startsWith('/reservations') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative' }}>
          <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
            <FaCalendarCheck style={{ fontSize: "20px", color: location.pathname.startsWith('/reservations') ? "#5cceff" : "#6b7280" }} />
          </div>
          <Link to="/reservations" onClick={handleLinkClick}>
            <span style={{ marginRight: "0.25rem" }}>الحجوزات</span>
          </Link>
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
          <FaHome style={{ fontSize: "20px", color: location.pathname === "/" ? "#5cceff" : "#6b7280" }} />
        </div>
        <Link to="/" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem" }}>الرئيسية</span>
        </Link>
      </li>

      {/* HR Dropdown */}
      <li className="dropdown" style={{ marginBottom: "0.25rem", position: 'relative' }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaBuilding style={{ fontSize: "20px", color: location.pathname.startsWith('/hr') ? "#5cceff" : "#6b7280" }} />
        </div>
        <button 
          className="btn dropdown-toggle" 
          type="button" 
          onClick={() => setIsHrDropdownOpen(!isHrDropdownOpen)}
          style={{
            background: "none",
            border: "none",
            color: location.pathname.startsWith('/hr') ? "#5cceff" : "#6b7280",
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
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
                color: location.pathname === "/employees" ? "#5cceff" : "#6b7280",
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
                color: location.pathname === "/attendance" ? "#5cceff" : "#6b7280",
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
                color: location.pathname === "/salaries" ? "#5cceff" : "#6b7280",
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
                color: location.pathname === "/vacations" ? "#5cceff" : "#6b7280",
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
                color: location.pathname === "/leave-requests" ? "#5cceff" : "#6b7280",
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
                color: location.pathname === "/shifts" ? "#5cceff" : "#6b7280",
                textDecoration: "none"
              }}
            >
              <FaCogs style={{ fontSize: "16px", marginLeft: "8px" }} />
              الورديات
            </Link>
          </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/reports" ? 'active' : ''}`} 
              to="/reports" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: location.pathname === "/reports" ? "#5cceff" : "#6b7280",
                textDecoration: "none"
              }}
            >
              <FaChartBar style={{ fontSize: "16px", marginLeft: "8px" }} />
              التقارير
            </Link>
          </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/permissions" ? 'active' : ''}`} 
              to="/permissions" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                padding: "8px 16px",
                color: location.pathname === "/permissions" ? "#5cceff" : "#6b7280",
                textDecoration: "none"
              }}
            >
              <FaKey style={{ fontSize: "16px", marginLeft: "8px" }} />
              الصلاحيات
            </Link>
          </li>
        </ul>
        )}
      </li>

      {/* الحسابات العامة */}
      <li className={location.pathname.startsWith('/accounting') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative' }}>
                <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaCalculator style={{ fontSize: "20px", color: location.pathname.startsWith('/accounting') ? "#5cceff" : "#6b7280" }} />
                </div>
        <Link to="/accounting" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem" }}>الحسابات العامة</span>
        </Link>
      </li>

      {/* إدارة المطاعم */}
      <li className={location.pathname.startsWith('/pos') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative' }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaUtensils style={{ fontSize: "20px", color: location.pathname.startsWith('/pos') ? "#5cceff" : "#6b7280" }} />
              </div>
        <Link to="/pos" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem" }}>إدارة المطاعم</span>
        </Link>
      </li>

      {/* المخازن */}
      <li className={location.pathname.startsWith('/warehouse') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative' }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaWarehouse style={{ fontSize: "20px", color: location.pathname.startsWith('/warehouse') ? "#5cceff" : "#6b7280" }} />
        </div>
        <Link to="/warehouse" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem" }}>المخازن</span>
        </Link>
      </li>

      {/* التوصيل */}
      <li className={location.pathname.startsWith('/delivery') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative' }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaTruck style={{ fontSize: "20px", color: location.pathname.startsWith('/delivery') ? "#5cceff" : "#6b7280" }} />
                        </div>
        <Link to="/delivery" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem" }}>التوصيل</span>
                        </Link>
                      </li>

      {/* الكول سنتر */}
      <li className={location.pathname.startsWith('/callcenter') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative' }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaPhone style={{ fontSize: "20px", color: location.pathname.startsWith('/callcenter') ? "#5cceff" : "#6b7280" }} />
        </div>
        <Link to="/callcenter" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem" }}>الكول سنتر</span>
        </Link>
            </li>

      {/* الحجوزات */}
      <li className={location.pathname.startsWith('/reservations') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative' }}>
            <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaCalendarCheck style={{ fontSize: "20px", color: location.pathname.startsWith('/reservations') ? "#5cceff" : "#6b7280" }} />
            </div>
        <Link to="/reservations" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem" }}>الحجوزات</span>
            </Link>
          </li>
    </ul>
  );
};

export default SideNavMenu;
