import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventsThunk } from "../../store/events";
import LoadingPage from "../LoadingPage/LoadingPage";
import DashboardEventCard from "./DashboardEventCard";
import { useHistory } from "react-router-dom";

function DashboardEvents({ myAttendances }) {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [attendeeType, setAttendeeType] = useState("organizer");
  const myAttendancesArr = Object.values(myAttendances);
  const hostingAttendances = myAttendancesArr.filter(
    (attendance) =>
      attendance.status === "organizer" &&
      new Date(attendance.Event.startDate) > new Date()
  );

  hostingAttendances.sort((a, b) => {
    return new Date(a.Event.startDate) - new Date(b.Event.startDate);
  });

  const attendingAttendances = myAttendancesArr.filter(
    (attendance) =>
      attendance.status === "attending" &&
      new Date(attendance.Event.startDate) > new Date()
  );
  attendingAttendances.sort((a, b) => {
    return new Date(a.Event.startDate) - new Date(b.Event.startDate);
  });

  const pendingAttendances = myAttendancesArr.filter(
    (attendance) =>
      attendance.status === "pending" &&
      new Date(attendance.Event.startDate) > new Date()
  );
  pendingAttendances.sort((a, b) => {
    return new Date(a.Event.startDate) - new Date(b.Event.startDate);
  });

  const pastAttendances = myAttendancesArr.filter(
    (attendance) => new Date(attendance.Event.startDate) < new Date()
  );
  pastAttendances.sort((a, b) => {
    return new Date(b.Event.startDate) - new Date(a.Event.startDate);
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchEventsThunk()).then(() => setIsLoading(false));
    window.scroll(0, 0);
  }, [dispatch]);

  if (isLoading) return <LoadingPage />;
  return (
    <main className="dash-group-main">
      <h2 className="dash-my-groups">My Events</h2>
      <section className="groups-tabs-container">
        <div
          onClick={() => setAttendeeType("organizer")}
          className={`dash_tab ${
            attendeeType === "organizer" ? "dash_tab_active" : ""
          }`}
        >
          Hosting
        </div>
        <div
          onClick={() => setAttendeeType("attending")}
          className={`dash_tab ${
            attendeeType === "attending" ? "dash_tab_active" : ""
          }`}
        >
          Attending
        </div>
        <div
          onClick={() => setAttendeeType("pending")}
          className={`dash_tab ${
            attendeeType === "pending" ? "dash_tab_active" : ""
          }`}
        >
          Pending
        </div>
        <div
          onClick={() => setAttendeeType("past")}
          className={`dash_tab ${
            attendeeType === "past" ? "dash_tab_active" : ""
          }`}
        >
          Past
        </div>
      </section>

      <section>
        {attendeeType === "organizer" && (
          <div className="dash-group-single">
            {hostingAttendances.length ? (
              hostingAttendances.map((attendance) => (
                <DashboardEventCard
                  key={attendance.id}
                  eventId={attendance.eventId}
                  attendeeType={attendeeType}
                />
              ))
            ) : (
              <div className="no-my-groups">
                <img
                  src="https://secure.meetupstatic.com/next/images/icons/rsvp-ticket.svg"
                  alt=""
                />
                <div className="no-join">
                  You are not hosting any upcoming events
                </div>
                <div className="no-join">
                  Schedule your next event. Select a group to get started
                </div>
              </div>
            )}
          </div>
        )}

        {attendeeType === "attending" && (
          <div className="dash-group-single">
            {attendingAttendances.length ? (
              attendingAttendances.map((attendance) => (
                <DashboardEventCard
                  key={attendance.id}
                  eventId={attendance.eventId}
                  attendeeType={attendeeType}
                />
              ))
            ) : (
              <div className="no-my-groups">
                <img
                  src="https://secure.meetupstatic.com/next/images/icons/rsvp-ticket.svg"
                  alt=""
                />
                <div className="no-join">You are not attending any events</div>
                <button
                  onClick={() => history.push("/events")}
                  className="search-btn1"
                >
                  Search Events
                </button>
              </div>
            )}
          </div>
        )}

        {attendeeType === "pending" && (
          <div className="dash-group-single">
            {pendingAttendances.length ? (
              pendingAttendances.map((attendance) => (
                <DashboardEventCard
                  key={attendance.id}
                  eventId={attendance.eventId}
                  attendeeType={attendeeType}
                />
              ))
            ) : (
              <div className="no-my-groups">
                <img
                  src="https://secure.meetupstatic.com/next/images/icons/rsvp-ticket.svg"
                  alt=""
                />
                <div className="no-join">
                  You don't have any pending requests
                </div>
                <button
                  onClick={() => history.push("/events")}
                  className="search-btn1"
                >
                  Search Events
                </button>
              </div>
            )}
          </div>
        )}

        {attendeeType === "past" && (
          <div className="dash-group-single">
            {pastAttendances.length ? (
              pastAttendances.map((attendance) => (
                <DashboardEventCard
                  key={attendance.id}
                  eventId={attendance.eventId}
                  attendeeType={attendeeType}
                />
              ))
            ) : (
              <div className="no-my-groups">
                <img
                  src="https://secure.meetupstatic.com/next/images/icons/rsvp-ticket.svg"
                  alt=""
                />
                <div className="no-join">You don't have past events</div>
                <button
                  onClick={() => history.push("/events")}
                  className="search-btn1"
                >
                  Search Events
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default DashboardEvents;
