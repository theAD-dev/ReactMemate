import React from "react";
import BoxArrowRight from "../../../assets/images/icon/box-arrow-right.png";
const LogoutButton = () => {
  const onClick = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  };

  return (
    <button className="logoutStyle logoutBottom" onClick={onClick}>
      Logout <img src={BoxArrowRight} alt="Arrow Right" />
    </button>
  );
};

export default LogoutButton;
