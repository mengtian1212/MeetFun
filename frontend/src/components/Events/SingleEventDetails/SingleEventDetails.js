import "./SingleEventDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import LineBreakHelper from "../../../utils/LineBreakHelper";
import {
  formatDateTime,
  replaceThirdCommaDot,
  capitalizeFirstChar,
  getRandomColor,
} from "../../../utils/helper-functions";

import { fetchSingleEventThunk } from "../../../store/events";
import { fetchSingleGroupThunk } from "../../../store/groups";
import OpenModalButton from "../../OpenModalButton/OpenModalButton";
import DeleteEventModal from "../DeleteEventModal/DeleteEventModal";
import LoadingPage from "../../LoadingPage/LoadingPage";
import {
  addAttendanceThunk,
  deleteAttendanceThunk,
  fetchEventAttendancesThunk,
  fetchEventAttendeesThunk,
  fetchMyAttendancesThunk,
} from "../../../store/attendances";

function SingleEventDetails() {
  const { eventId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const sessionUser = useSelector((state) => state.session.user);
  const targetGroup = useSelector((state) => state.groups?.singleGroup);
  const targetEvent = useSelector((state) => state.events?.singleEvent);

  const endDateTime = new Date(targetEvent?.endDate).getTime();
  const currDateTime = new Date().getTime();
  const isPastEvent = endDateTime <= currDateTime;

  const attendees = useSelector((state) => state.attendances?.eventAttendees);
  const eventAttendees = attendees && Object.values(attendees);

  const attendances = useSelector(
    (state) => state.attendances.eventAttendances
  );
  const eventAttendances = attendances && Object.values(attendances);
  const myAttendance =
    sessionUser &&
    eventAttendances?.find(
      (attendance) => sessionUser.id === attendance.userId
    );
  console.log("myAttendance", myAttendance, eventAttendances);

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

  const handleClick = () => {
    history.push(`/groups/${targetGroup.id}`);
  };

  const handleClickUpdate = (e) => {
    alert("Feature coming soon!");
  };

  const handleClickJoin = (e) => {
    return dispatch(addAttendanceThunk(eventId));
  };

  const handleClickLeave = (e) => {
    console.log("my attendance 33333", myAttendance);
    return dispatch(deleteAttendanceThunk(myAttendance));
  };

  useEffect(() => {
    const fetchData = async () => {
      const event = await dispatch(fetchSingleEventThunk(eventId));
      await dispatch(fetchSingleGroupThunk(event.Group?.id));
      await dispatch(fetchEventAttendeesThunk(eventId));
      await dispatch(fetchEventAttendancesThunk(eventId));
      if (sessionUser) await dispatch(fetchMyAttendancesThunk());
      setIsLoading(false);
      window.scroll(0, 0);
    };
    fetchData();
  }, [dispatch, eventId]);

  if (isLoading) return <LoadingPage />;

  let imgUrl = `No preview image for this event`;
  if (targetEvent && Object.values(targetEvent).length) {
    const previewImage = targetEvent.EventImages?.find(
      (img) => img.preview === true
    );
    if (previewImage && Object.keys(previewImage).length > 0) {
      imgUrl = previewImage.url;
    }
  }

  let imgUrlGroup = `No preview image for this group`;
  if (targetGroup && Object.keys(targetGroup).length > 0) {
    const previewImage = targetGroup.GroupImages?.find(
      (img) => img.preview === true
    );
    if (previewImage && Object.keys(previewImage).length > 0) {
      imgUrlGroup = previewImage.url;
    }
  }

  let organizerBtns = null;
  let joinEventBtn = null;
  if (sessionUser && myAttendance?.status === "organizer") {
    organizerBtns = (
      <div className="organizerbtns-containers2">
        <div className="member-s4">You're the host</div>

        <button className="organizerbtns3" onClick={handleClickUpdate}>
          Update event
        </button>
        <OpenModalButton
          modalComponent={
            <DeleteEventModal eventId={eventId} groupId={targetGroup.id} />
          }
          buttonText="Delete event"
          // className="organizerbtns"
          // onItemClick={closeMenu}
          foreventdelete="foreventdelete1"
        />
      </div>
    );
  } else if (sessionUser && myAttendance?.status === "pending") {
    joinEventBtn = (
      <div className="organizerbtns-containers1">
        <div className="member-s4">
          Your request to join this event is pending
        </div>
        <button onClick={handleClickLeave} className="join-this-group-btn2">
          Withdraw request
        </button>
      </div>
    );
  } else if (sessionUser && myAttendance?.status === "attending") {
    joinEventBtn = (
      <div className="organizerbtns-containers1">
        <div className="member-s4">You're going!</div>
        <button onClick={handleClickLeave} className="join-this-group-btn2">
          Remove attendance
        </button>
      </div>
    );
  } else if (sessionUser) {
    joinEventBtn = (
      <div className="organizerbtns-containers1">
        <button onClick={handleClickJoin} className="join-this-group-btn3">
          Attend
        </button>
      </div>
    );
  }

  return (
    <>
      {sessionUser &&
        (myAttendance?.status === "organizer" ||
          myAttendance?.status === "attending") &&
        !isPastEvent && (
          <div className="going-header">You're going to this event!</div>
        )}
      {sessionUser &&
        isPastEvent &&
        (myAttendance?.status === "organizer" ||
          myAttendance?.status === "attending") && (
          <div className="going-header1">You attended this event!</div>
        )}
      <div className="event-whole-container">
        <section className="group-detail-main2">
          <div className="group-detail-top">
            <div>
              <NavLink exact to="/events" className="back-to-groups-container">
                <i className={`fa-solid fa-chevron-left arrow`}></i>{" "}
                <span className="event-or-group selected">Events</span>
              </NavLink>
            </div>
            <h2 className="event-title">{targetEvent.name}</h2>
            <h3 className="host">
              <p className="hostby">Hosted By</p>
              <p className="hostname">
                {targetGroup?.Organizer?.firstName}{" "}
                {targetGroup?.Organizer?.lastName}
              </p>
            </h3>
          </div>
        </section>
        <section className="group-detail-main background">
          <div className="event-back">
            <div className="group-detail-top background">
              <div className="top-container">
                <div className="top-left-img-container">
                  <img
                    src={
                      imgUrl === `No preview image for this event`
                        ? // ? "https://i0.wp.com/orstx.org/wp-content/uploads/2019/10/no-photo-available-icon-12.jpg?fit=300%2C245&ssl=1"
                          "https://secure.meetupstatic.com/next/images/find/emptyResultsIcon.svg"
                        : imgUrl
                    }
                    alt="No event preview"
                    className="group-detail-img1"
                  />
                </div>
                <div className="top-right-text-container">
                  <div
                    className="small-group-container cursor"
                    onClick={handleClick}
                  >
                    <div className="small-group-img-container">
                      <img
                        src={
                          imgUrlGroup === `No preview image for this group`
                            ? // ? "https://i0.wp.com/orstx.org/wp-content/uploads/2019/10/no-photo-available-icon-12.jpg?fit=300%2C245&ssl=1"
                              "https://secure.meetupstatic.com/photos/event/1/4/3/e/600_516605182.webp"
                            : imgUrlGroup
                        }
                        alt="No group preview"
                        className="small-group-img"
                      />
                    </div>
                    <div className="small-group-text-container">
                      <h2 className="small-group-title">
                        {targetEvent?.Group?.name}
                      </h2>
                      <div className="small-group-type">
                        {targetGroup?.private
                          ? "Private group"
                          : "Public group"}
                      </div>
                    </div>
                  </div>
                  <div className="event-metadata-container">
                    <div className="detail-container">
                      <div className="icon-container">
                        <i className="fa-regular fa-clock"></i>
                      </div>
                      <div>
                        <div>
                          {replaceThirdCommaDot(
                            formatDateTime(targetEvent.startDate)
                          )}{" "}
                          to
                        </div>
                        <div>
                          {replaceThirdCommaDot(
                            formatDateTime(targetEvent.endDate)
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="detail-container">
                      <div className="icon-container">
                        <i className="fa-solid fa-dollar-sign"></i>
                      </div>
                      <div>
                        {targetEvent.price === "0" || targetEvent.price === 0
                          ? "FREE"
                          : targetEvent.price}
                      </div>
                    </div>
                    <div className="detail-container">
                      <div className="icon-container">
                        {targetEvent.type === "In person" && (
                          <i className="fa-solid fa-location-dot"></i>
                        )}
                        {targetEvent.type === "Online" && (
                          <i className="fa-solid fa-video"></i>
                        )}
                      </div>
                      <div>{targetEvent.type}</div>
                    </div>
                    {targetEvent.Venue && targetEvent.type === "In person" && (
                      <div className="detail-container">
                        <div className="icon-container">
                          <i className="fa-solid fa-map-pin"></i>
                        </div>
                        <div>
                          {targetEvent.Venue?.address}
                          <div>
                            {Object.keys(targetEvent.Venue).length &&
                              capitalizeFirstChar(targetEvent.Venue?.city)}
                            {",  "}
                            {targetEvent.Venue?.state}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bottom3-what-we-are-about">
              <h2>Details</h2>
              <div className="paragraphs1">
                <LineBreakHelper text={targetEvent?.description} />
              </div>
            </div>

            <div className="bottom3-what-we-are-about">
              {eventAttendeesSorted?.length > 0 && (
                <>
                  <h2>Attendees</h2>
                  <div className="attendee-list">
                    {eventAttendeesSorted?.map((attendee) => (
                      <div
                        key={attendee.id}
                        className="event-metadata-container member-s"
                      >
                        {attendee.picture ? (
                          <img
                            src={attendee.picture}
                            alt=""
                            className="member-image"
                          />
                        ) : (
                          <div
                            className="member-image"
                            style={{
                              backgroundColor: getRandomColor(),
                            }}
                          >
                            <span>
                              {attendee.firstName[0]}
                              {attendee.lastName[0]}
                            </span>
                          </div>
                        )}
                        <div className="member-s1">
                          <div>
                            {attendee.firstName}&nbsp;
                            {attendee.lastName}
                          </div>
                          <div className="member-s2">
                            {attendee.Attendance[0].status[0].toUpperCase()}
                            {attendee.Attendance[0].status.slice(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
        <section className="event-bottom-container-sticky">
          <div className="event-bottom-container-sticky-inner">
            <div className="event-bottom-left">
              {replaceThirdCommaDot(formatDateTime(targetEvent.startDate))}
              <h2 className="event-t-j">{targetEvent.name}</h2>
            </div>
            <div className="event-bottom-right">
              {targetEvent.price === "0" || targetEvent.price === 0 ? (
                <div className="event-t-j">FREE</div>
              ) : (
                <div className="event-t-j">
                  <i className="fa-solid fa-dollar-sign"></i>
                  {targetEvent.price}
                </div>
              )}
              {isPastEvent ? (
                <div className="join-this-group-btn4">Past Event</div>
              ) : (
                <div>
                  {organizerBtns}
                  {joinEventBtn}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default SingleEventDetails;
