import "./LandingPage.css";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal";

function LandingPage() {
  const sessionUser = useSelector((state) => state.session.user);
  return (
    <>
      <div className="background-image-placeholder"></div>
      <main className="landing-page-container">
        <div className="landing-page">
          <section className="sec1-container">
            <div className="sec1-left-container">
              <h1 className="sec1-left-title">
                The people platform - Where interests become friendships
              </h1>
              <p className="sec1-left-text">
                Whatever your interest, from hiking and reading to networking
                and skill sharing, there are thousands of people who share it on
                MeetFun. Events are happening every day—sign up to join the fun.
              </p>
            </div>
            <div className="sec1-right-container">
              <img
                src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=1080"
                alt="infographic"
              ></img>
            </div>
          </section>
          <div className="body">
            <section className="sec2-container">
              <h2 className="sec2-title">How MeetFun works</h2>
              <p className="sec2-text">
                Meet new people who share your interests through online and
                in-person events. It’s free to create an account.
              </p>
            </section>

            <section className="sec3-container">
              <div className="sec3-card">
                <img
                  className="card-pic"
                  src="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384"
                  alt="left pic"
                ></img>
                <div className="sec3-card-text-container">
                  <NavLink exact to="/groups" className="card-title">
                    See all groups
                  </NavLink>
                  <p>
                    Do what you love, meet others who love it, find your
                    community. The rest is history!
                  </p>
                </div>
              </div>
              <div className="sec3-card">
                <img
                  className="card-pic"
                  src="https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=384"
                  alt="mid pic"
                ></img>
                <div className="sec3-card-text-container">
                  <NavLink exact to="/events" className="card-title">
                    Find an event
                  </NavLink>
                  <p>
                    Events are happening on just about any topic you can think
                    of, from online gaming and photography to yoga and hiking.
                  </p>
                </div>
              </div>
              <div className="sec3-card">
                <img
                  className="card-pic"
                  src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384"
                  alt="right pic"
                ></img>
                <div className="sec3-card-text-container" disabled>
                  {sessionUser ? (
                    <NavLink exact to="/groups/new" className="card-title">
                      Start a group
                    </NavLink>
                  ) : (
                    <NavLink exact to="" className="card-title1">
                      Start a group
                    </NavLink>
                  )}

                  <p>
                    You don’t have to be an expert to gather people together and
                    explore shared interests.
                  </p>
                </div>
              </div>
            </section>
            <section className="sec4-container">
              {!sessionUser ? (
                <div className="join-btn">
                  <OpenModalMenuItem
                    itemText="Join MeetFun"
                    // onItemClick={closeMenu}
                    modalComponent={<SignupFormModal />}
                  />
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default LandingPage;
