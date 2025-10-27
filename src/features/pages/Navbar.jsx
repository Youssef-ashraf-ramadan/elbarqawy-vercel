import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTitle } from "../context/TitleContext";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { logout } from "../redux/Slices/authSlice";
import { toast } from "react-toastify";
import { IoIosArrowDown } from "react-icons/io";

const Navbar = ({ toggleSideNav, isSideNavOpen }) => {
  const { t, i18n } = useTranslation("global");
  const { title } = useTitle();
  const [isMobileScrolled, setIsMobileScrolled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date();
  const dayNames = [
    t("labels.week.sunday"),
    t("labels.week.monday"),
    t("labels.week.tuesday"),
    t("labels.week.wednesday"),
    t("labels.week.thursday"),
    t("labels.week.friday"),
    t("labels.week.saturday"),
  ];
  const day = dayNames[today.getDay()];
  const dateStr = `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;
  const handleLogout = () => {
    dispatch(logout());
    toast.success(t("topnav.logoutSuccess"), {
      onClose: () => window.location.reload(),
    });
  };
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 768;
      const scrolled = window.scrollY >= 100;
      setIsMobileScrolled(isMobile && scrolled);
    };

    // Run once on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);



  return (
    <div
      className={`navbar topnav border-bottom shadow-sm ${isSideNavOpen ? "with-sidenav" : "full-width"
        } ${isMobileScrolled ? "fixed-top" : ""}`}
    >
      <div className="container d-flex justify-content-between align-items-center">
        <div className="toggle_sidenav d-flex align-items-center gap-2">
          <span
            className="p-3 main-color"
            onClick={toggleSideNav}
            style={{ cursor: "pointer" }}
            aria-label="Toggle Side Navigation"
          >
            <i className="fa fa-bars"></i>
          </span>
          <b className="text-md main-color">{title}</b>
        </div>

        <ul className="actions d-flex align-items-center top-actions-top list-unstyled m-0">
          <li className="text-sm gray-color">
            {t("labels.today")} : {day} {dateStr}
          </li>


          {/* {user3almny ? (
            <li className="dropdown">
            <button
              className="dropdown-toggle user-btn border-0 text-sm"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="User Menu"
            >
             <div className="icon"><img src="/logo-hefnawy.svg" alt="fav"/></div> <span className="mx-3 text-sm">{i18n.language === "ar" ? "أدمن":"Admin"}</span> <IoIosArrowDown />
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link to="#" className="dropdown-item" style={{fontSize:"11px"}}>
                  {t("topnav.profile")}
                </Link>
              </li>
              <li>
                <Link to="#" className="dropdown-item" style={{fontSize:"11px"}} onClick={handleLogout}>
                  {t("topnav.logout")}
                </Link>
              </li>
            </ul>
          </li>
          ) : (
            <Link to="/login" className="text-sm main-color login-btn"><i className="bi bi-box-arrow-in-right"></i> {t("sign.login")} </Link>
          )} */}
          <li className="dropdown">
            <button
              className="dropdown-toggle user-btn border-0 text-sm"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="User Menu"
            >
         
              <span className="mx-3 text-sm">
                {i18n.language === "ar" ? "أدمن" : "Admin"}
              </span>{" "}
              <IoIosArrowDown />
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link
                  to="/profile"
                  className="dropdown-item"
                  style={{ fontSize: "11px" }}
                >
                  {t("topnav.profile")}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="dropdown-item"
                  style={{ fontSize: "11px" }}
                  onClick={handleLogout}
                >
                  {t("topnav.logout")}
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
