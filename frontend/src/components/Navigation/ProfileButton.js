import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = async (e) => {
    e.preventDefault();
    const response = await dispatch(sessionActions.logout());
    console.log(response);
    closeMenu();
    if (response.ok) history.push("/");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const profileArrowDirection = showMenu ? "up" : "down";

  const handleClick = () => {
    history.push("/groups/new");
    window.scrollTo(0, 0);
  };

  return (
    <>
      {user ? (
        <div className="header-right-container">
          <div className="start-new-group cursor" onClick={handleClick}>
            Start a new group
          </div>
          <button onClick={openMenu} className="user-icon-container cursor">
            <i className="fas fa-user-circle" />
            <i
              className={`fa-solid fa-chevron-${profileArrowDirection} arrow`}
            ></i>
          </button>
          <ul className={ulClassName} ref={ulRef}>
            <li>
              Hello, {user.firstName} {user.lastName}!
            </li>
            <li>{user.email}</li>
            <li className="logout-in-menu">
              <button onClick={logout}>Log Out</button>
            </li>
          </ul>
        </div>
      ) : (
        <div className="header-right-container">
          <OpenModalMenuItem
            itemText="Log In"
            onItemClick={closeMenu}
            modalComponent={<LoginFormModal />}
          />
          <OpenModalMenuItem
            itemText="Sign Up"
            onItemClick={closeMenu}
            modalComponent={<SignupFormModal />}
          />
        </div>
      )}
    </>
  );
}

export default ProfileButton;
