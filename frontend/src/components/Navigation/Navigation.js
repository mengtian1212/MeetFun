import React from "react";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useHistory } from "react-router-dom";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();

  const handleClick = () => {
    history.push("/");
    window.scrollTo(0, 0);
  };

  return (
    <div className="header">
      <button onClick={handleClick} className="meet-up cursor">
        Meetfun
      </button>
      {isLoaded && <ProfileButton user={sessionUser} />}
    </div>
  );
}

export default Navigation;
