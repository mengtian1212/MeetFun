import "./Footer.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import * as sessionActions from "../../store/session";
import SignupFormModal from "../SignupFormModal";

function Footer() {
  const history = useHistory();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const logout = async (e) => {
    e.preventDefault();
    const response = await dispatch(sessionActions.logout());
    if (response.ok) {
      history.push("/");
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-container-main">
        {sessionUser && (
          <section className="footer-start-container">
            <div className="footer-start-create">
              Create your own MeetFun group.
            </div>
            <NavLink
              exact
              to="/groups/new"
              className="start-group"
              onClick={() => window.scrollTo(0, 0)}
            >
              Get Started
            </NavLink>
          </section>
        )}
        {!sessionUser && (
          <section className="footer-start-container">
            <div className="footer-start-create">
              Create your own MeetFun group.
            </div>
            <OpenModalMenuItem
              className="not-a-member-sign-up"
              itemText="Get Started"
              // onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
          </section>
        )}
        <section className="footer-middle-container">
          <div className="footer-middle-container1">
            <div className="footer-discover">Your Account</div>
            {sessionUser && (
              <div className="footer-middle-container2">
                <NavLink
                  exact
                  to="/dashboard"
                  onClick={() => window.scrollTo(0, 0)}
                  className="footer-tab"
                >
                  Dashboard
                </NavLink>
                <button onClick={logout} className="footer-tab">
                  Log out
                </button>
              </div>
            )}
            {!sessionUser && (
              <div className="footer-middle-container2">
                <div className="footer-tab">
                  <OpenModalMenuItem
                    itemText="Log in"
                    // onItemClick={closeMenu}
                    modalComponent={<LoginFormModal />}
                  />
                </div>
                <div className="footer-tab">
                  <OpenModalMenuItem
                    itemText="Sign up"
                    // onItemClick={closeMenu}
                    modalComponent={<SignupFormModal />}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="footer-middle-container1">
            <div className="footer-discover">Discover</div>
            <div className="footer-middle-container2">
              <NavLink exact to="/groups" className="footer-tab">
                Groups
              </NavLink>
              <NavLink exact to="/events" className="footer-tab">
                Events
              </NavLink>
            </div>
          </div>
        </section>
        <section className="footer-developer-container">
          <div className="footer-developer">
            <div className="footer-discover">Developer</div>
            <div>Maggie Tian</div>
          </div>
          <div className="footer-developer">
            <a
              href="https://www.maggietian.com/"
              target="_blank"
              rel="noreferrer"
              className="footer-developer1"
            >
              <i className="fa-solid fa-globe footer-icon"></i> Portfolio
            </a>
            <a
              href="https://www.linkedin.com/in/mengtian1212/"
              target="_blank"
              rel="noreferrer"
              className="footer-developer1"
            >
              <i className="fa-brands fa-linkedin footer-icon"></i> LinkedIn
            </a>
            <a
              href="https://github.com/mengtian1212"
              target="_blank"
              rel="noreferrer"
              className="footer-developer1"
            >
              <i className="fa-brands fa-github footer-icon"></i> Github
            </a>
          </div>
          <a
            href="https://github.com/mengtian1212/MeetFun"
            target="_blank"
            rel="noreferrer"
            className="footer-developer1"
          >
            <i className="fa-solid fa-code"></i>
            Project Source Code
          </a>
        </section>
      </div>
    </footer>
  );
}

export default Footer;
