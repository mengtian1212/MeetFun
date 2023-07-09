import * as sessionActions from "../../store/session";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./LoginForm.css";

// import OpenModalButton from "../OpenModalButton";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal";

function LoginFormModal() {
  const history = useHistory();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const [submitBtn, setSubmitBtn] = useState(false);

  const handleSubmit = (e, demo) => {
    e.preventDefault();
    setErrors({});

    let loginInfo = { credential, password };
    if (demo === "demo1") {
      loginInfo = {
        ...loginInfo,
        credential: "FakeUser1",
        password: "password1",
      };
    } else if (demo === "demo5") {
      loginInfo = {
        ...loginInfo,
        credential: "FakeUser5",
        password: "password5",
      };
    }

    console.log({ loginInfo });
    return dispatch(sessionActions.login(loginInfo))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors((prev) => data.errors);
        }
      });
  };

  useEffect(() => {
    setErrors({});
    if (credential.length >= 4 && password.length >= 6) {
      setSubmitBtn(true);
    } else {
      setSubmitBtn(false);
    }
  }, [submitBtn, credential, password]);

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
      <form onSubmit={(e) => handleSubmit(e, "")}>
        <div className="logo-container">
          <img src="./image/favicon6.png" alt="MeetFun Logo" />
          <h1>Log in</h1>
          <div className="not-a-member-container">
            <h2>Not a member yet? </h2>
            <span className="signup-text">
              <OpenModalMenuItem
                className="not-a-member-sign-up"
                itemText="Sign up"
                // onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </span>
          </div>
        </div>
        <div className="credential-input">
          {errors.credential && (
            <p className="error-message">{errors.credential}</p>
          )}
          <div className="username">
            <label className="labels">
              Username or Email
              <input
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
                className="login-credential"
              />
            </label>
            {credential.length < 4 && credential.length > 0 && (
              <p className="error-message">
                Credential must be at least 4 characters.
              </p>
            )}
          </div>
          <div className="password">
            <label className="labels">
              Password
              <div className="pw-container">
                <input
                  type={visible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-credential pw"
                />
                <div onClick={() => setVisible(!visible)} className="pwicon">
                  {visible ? (
                    <i className="fa-regular fa-eye"></i>
                  ) : (
                    <i className="fa-regular fa-eye-slash"></i>
                  )}
                </div>
              </div>
            </label>
            {password.length < 6 && password.length > 0 && (
              <p className="error-message">
                Password must be at least 6 characters.
              </p>
            )}
          </div>
        </div>
        <div className="login-btn-container">
          <button
            type="submit"
            disabled={!submitBtn}
            className={`login-button ${submitBtnClassName}`}
          >
            Log In
          </button>
        </div>
      </form>
      <div className="demo-container">
        <button
          className="demo cursor"
          onClick={(e) => handleSubmit(e, "demo1")}
        >
          Demo user 1
        </button>
        <button
          className="demo cursor"
          onClick={(e) => handleSubmit(e, "demo5")}
        >
          Demo user 2
        </button>
      </div>
    </section>
  );
}

export default LoginFormModal;
