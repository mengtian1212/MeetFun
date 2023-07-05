import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [submitBtn, setSubmitBtn] = useState(false);

  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e, demo) => {
    e.preventDefault();
    setErrors({});

    let loginInfo = { credential, password };
    console.log({ loginInfo });
    if (demo === "demo1") {
      loginInfo = {
        ...loginInfo,
        credential: "FakeUser1",
        password: "password1",
      };
    } else if (demo === "demo3") {
      loginInfo = {
        ...loginInfo,
        credential: "FakeUser3",
        password: "password3",
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
    if (credential.length > 4 && password.length > 6) {
      setSubmitBtn(true);
    } else {
      setSubmitBtn(false);
    }
  }, [submitBtn, credential, password]);

  const submitBtnClassName = submitBtn ? "enabledBtn cursor" : `disabledBtn`;

  return (
    <section className="modal-container">
      <form onSubmit={(e) => handleSubmit(e, "")}>
        <div className="logo-container">
          <img src="./image/favicon6.png" alt="MeetFun Logo" />
          <h1>Log in</h1>
          <h2>
            Not a member yet? <span>Sign up</span>
          </h2>
        </div>
        <div className="credential-input">
          {errors.credential && (
            <p style={{ color: "red", fontWeight: 600 }}>{errors.credential}</p>
          )}
          {credential.length <= 4 && credential.length > 0 && (
            <p style={{ color: "red", fontWeight: 600 }}>
              Credential must be at least 4 characters.
            </p>
          )}
          {password.length <= 6 && password.length > 0 && (
            <p style={{ color: "red", fontWeight: 600 }}>
              Password must be at least 6 characters.
            </p>
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
          </div>
          <div className="password">
            <label className="labels">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-credential"
              />
            </label>
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
          onClick={(e) => handleSubmit(e, "demo3")}
        >
          Demo user 2
        </button>
      </div>
    </section>
  );
}

export default LoginFormModal;
