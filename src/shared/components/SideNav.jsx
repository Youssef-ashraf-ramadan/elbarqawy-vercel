import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SideNavMenu from "./SideNavMenu";

const SideNav = ({ isOpen, toggleSideNav }) => {
  const { i18n } = useTranslation("global");
  const sideNavRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        window.innerWidth < 1200 &&
        sideNavRef.current &&
        !sideNavRef.current.contains(event.target)
      ) {
        toggleSideNav();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside); // for touch devices (iPhone, Android)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, toggleSideNav]);

  const handleLinkClick = () => {
    if (window.innerWidth < 1200) {
      toggleSideNav();
    }
  };

  return (
    <div
      ref={sideNavRef}
      className={`sidenav ${isOpen ? "openNav" : "closedNav"}`}
      style={{ zIndex: 1 }}
      onClick={!isOpen ? (e) => {
        // إذا كان النقر على رابط، لا تفتح السايد بار
        if (e.target.closest('a')) {
          return;
        }
        // إذا كان النقر على اللوجو، افتح السايد بار
        if (e.target.closest('.mx-auto')) {
          return;
        }
        toggleSideNav();
      } : undefined}
    >
      <span className="closeNav" onClick={toggleSideNav}>
        <i className="bi bi-x"></i>
      </span>
      <div className="mx-auto my-2" style={{textAlign : "center"}}>
        <Link to="/company">
          <div 
            style={{ 
              textDecoration: "none",
              padding: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <img 
              src="/albaraqawyLogo.png" 
              alt="albaraqawy Logo" 
              style={{
                height: "70px",
                width: "auto",
                maxWidth: "100%"
              }}
            />
          </div>
        </Link>
      </div>
      <SideNavMenu handleLinkClick={handleLinkClick} />
    </div>
  );
};

export default SideNav;
