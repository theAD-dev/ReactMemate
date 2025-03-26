import React from "react";
import BoxArrowRight from "../../../assets/images/icon/box-arrow-right.png";
const LogoutButton = () => {
  const onClick = () => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.location.replace("/login");
  };

  return (
    <button className="logoutStyle logoutBottom" onClick={onClick}>
      Logout <img src={BoxArrowRight} alt="Arrow Right" />
    </button>
  );
};

export default LogoutButton;
