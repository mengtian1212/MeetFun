import * as sessionActions from "../../store/session";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./SignupForm.css";
import { capitalizeFirstChar } from "../../utils/helper-functions";

import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal/LoginFormModal";

function SignupFormModal() {
  const history = useHistory();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visiblepw, setVisiblepw] = useState(false);
  const [visiblepwc, setVisiblepwc] = useState(false);

  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const [submitBtn, setSubmitBtn] = useState(false);

  const resetForm = () => {
    setEmail("");
    setUsername("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setConfirmPassword("");

    return;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName: capitalizeFirstChar(firstName),
          lastName: capitalizeFirstChar(lastName),
          password,
        })
      )
        .then(resetForm)
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
    return resetForm();
  };

  useEffect(() => {
    setErrors({});
    if (
      (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) ||
      firstName.length === 0 ||
      lastName.length === 0 ||
      username.length < 4 ||
      password.length < 6 ||
      password !== confirmPassword
    ) {
      setSubmitBtn(false);
    } else {
      setSubmitBtn(true);
    }

    const err = {};
    if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      err.email = "Please provide a valid Email";
    }
    if (username.length < 4 && username.length > 0) {
      err.username = "Please provide a username with at least 4 characters";
    }

    if (password.length < 6 && password.length > 0) {
      err.password = "Please provide a password with at least 6 characters";
    }

    if (password !== confirmPassword) {
      err.confirmPassword =
        "Confirm Password field must be the same as the Password field";
    }
    setErrors(err);
  }, [email, firstName, lastName, username, password, confirmPassword]);

  if (sessionUser) {
    history.push("/");
    window.scroll(0, 0);
    return;
  }

  const submitBtnClassName = submitBtn ? "enabledBtn cursor" : `disabledBtn`;

  return (
    <section className="modal-container">
      <div className="xmark-container" onClick={closeModal}>
        <i className="fa-solid fa-xmark"></i>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="logo-container">
          <img
            src="https://raw.githubusercontent.com/mengtian1212/API-project/main/frontend/public/image/favicon6.png"
            alt="MeetFun Logo"
          />
          {/* <img src="./image/favicon6.png" alt="MeetFun Logo" /> */}
          <h1>Sign up</h1>
          <div className="not-a-member-container">
            <h2>Already a member? </h2>
            <span className="signup-text">
              <OpenModalMenuItem
                className="not-a-member-sign-up"
                itemText="Log in"
                // onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </span>
          </div>
        </div>
        <div className="credential-input">
          <div className="email">
            <label className="labels">
              Email
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-credential"
              />
            </label>
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="username">
            <label className="labels">
              Username
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                // onBlur={validateUsername}
                required
                className="login-credential"
              />
            </label>
            {errors.username && (
              <p className="error-message">{errors.username}</p>
            )}
          </div>

          <div className="firstname">
            <label className="labels">
              First Name
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="login-credential"
              />
            </label>
            {errors.firstName && (
              <p className="error-message">{errors.firstName}</p>
            )}
          </div>

          <div className="lastname">
            <label className="labels">
              Last Name
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="login-credential"
              />
            </label>
            {errors.lastName && (
              <p className="error-message">{errors.lastName}</p>
            )}
          </div>

          <div className="password">
            <label className="labels">
              Password
              <div className="pw-container">
                <input
                  type={visiblepw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-credential pw"
                />
                <div
                  onClick={() => setVisiblepw(!visiblepw)}
                  className="pwicon"
                >
                  {visiblepw ? (
                    <i className="fa-regular fa-eye"></i>
                  ) : (
                    <i className="fa-regular fa-eye-slash"></i>
                  )}
                </div>
              </div>
            </label>
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>
          <div className="password2">
            <label className="labels">
              Confirm Password
              <div className="pw-container">
                <input
                  type={visiblepwc ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="login-credential pw"
                />
                <div
                  onClick={() => setVisiblepwc(!visiblepwc)}
                  className="pwicon"
                >
                  {visiblepwc ? (
                    <i className="fa-regular fa-eye"></i>
                  ) : (
                    <i className="fa-regular fa-eye-slash"></i>
                  )}
                </div>
              </div>
            </label>
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}
          </div>
          <div className="login-btn-container">
            <button
              type="submit"
              disabled={!submitBtn}
              className={`login-button ${submitBtnClassName}`}
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default SignupFormModal;
