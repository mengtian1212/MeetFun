import "./ManageEvent.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, NavLink } from "react-router-dom";
import { fetchSingleEventThunk } from "../../store/events";
import {
  fetchEventAttendancesThunk,
  fetchEventAttendeesThunk,
  fetchMyAttendancesThunk,
} from "../../store/attendances";
import LoadingPage from "../LoadingPage";
import DeleteEventModal from "../Events/DeleteEventModal/DeleteEventModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ManageEventPreview from "./ManageEventPreview";
import ManageAttendees from "./ManageAttendees";

function ManageEvent() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [toolTab, setToolTab] = useState("Preview");

  const sessionUser = useSelector((state) => state.session.user);
  const targetEvent = useSelector((state) => state.events?.singleEvent);

  const attendees = useSelector((state) => state.attendances?.eventAttendees);
  const eventAttendees = attendees && Object.values(attendees);

  const attendeeStatusOrder = {
    organizer: 0,
    attending: 1,
    pending: 2,
  };
  const eventAttendeesSorted = eventAttendees.sort((a, b) => {
    const statusA = a.Attendance[0].status;
    const statusB = b.Attendance[0].status;
    return attendeeStatusOrder[statusA] - attendeeStatusOrder[statusB];
  });

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchSingleEventThunk(eventId));
      await dispatch(fetchEventAttendeesThunk(eventId));
      if (sessionUser) await dispatch(fetchMyAttendancesThunk());
      setIsLoading(false);
      window.scroll(0, 0);
    };
    fetchData();
  }, [dispatch, eventId]);

  let imgUrl = `No preview image for this event`;
  if (targetEvent && Object.values(targetEvent).length) {
    const previewImage = targetEvent.EventImages?.find(
      (img) => img.preview === true
    );
    if (previewImage && Object.keys(previewImage).length > 0) {
      imgUrl = previewImage.url;
    }
  }

  if (isLoading) return <LoadingPage />;

  return (
    <section className="group-detail-main">
      <div className="group-detail-top">
        <NavLink exact to="/dashboard" className="back-to-groups-container">
          <i className={`fa-solid fa-chevron-left arrow`}></i>
          <span className="event-or-group selected">Dashboard</span>
        </NavLink>
        <div className="manage-group-title">
          Manage Event: {targetEvent.name}
        </div>
      </div>
      <section className="groups-tabs-container1">
        <div className="bottom-inner1">
          <div
            onClick={() => setToolTab("Preview")}
            className={`manage-delete-group ${
              toolTab === "Preview" ? "dash_tab_active" : ""
            }`}
          >
            Event Info
          </div>
          <div
            onClick={() => setToolTab("attendees")}
            className={`manage-delete-group ${
              toolTab === "attendees" ? "dash_tab_active" : ""
            }`}
          >
            Manage Attendees
          </div>
          <div
            onClick={() => setToolTab("edit")}
            className={`manage-delete-group ${
              toolTab === "edit" ? "dash_tab_active" : ""
            }`}
          >
            Edit Event Info
          </div>
          <div
            onClick={() => setToolTab("delete")}
            className={`manage-delete-group ${
              toolTab === "delete" ? "dash_tab_active" : ""
            }`}
          >
            <OpenModalButton
              modalComponent={
                <DeleteEventModal
                  eventId={eventId}
                  groupId={targetEvent.groupId}
                />
              }
              buttonText="Delete Event"
              foreventdelete={`delete-btn ${
                toolTab === "delete" ? "dash_tab_active" : ""
              }`}
            />
          </div>
        </div>
      </section>

      <div className="group-detail-bottom">
        <div className="bottom-inner">
          {(toolTab === "Preview" || toolTab === "delete") && (
            <ManageEventPreview />
          )}
          {toolTab === "attendees" && (
            <ManageAttendees targetEvent={targetEvent} />
          )}
          {/* {toolTab === "edit" && <UpdateEvent />} */}
        </div>
      </div>
    </section>
  );
}

export default ManageEvent;
