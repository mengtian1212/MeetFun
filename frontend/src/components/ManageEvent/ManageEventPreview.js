import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { fetchSingleEventThunk } from "../../store/events";
import {
  fetchEventAttendeesThunk,
  fetchMyAttendancesThunk,
} from "../../store/attendances";
import {
  capitalizeFirstChar,
  formatDateTime,
  getRandomColor,
  isClickMemberMatchingOtherUserInDM,
  replaceThirdCommaDot,
} from "../../utils/helper-functions";
import LineBreakHelper from "../../utils/LineBreakHelper";
import { fetchSingleGroupThunk } from "../../store/groups";
import {
  createNewDMThunk,
  fetchAllDirectChatsThunk,
} from "../../store/directChats";

function ManageEventPreview() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const sessionUser = useSelector((state) => state.session.user);
  const targetGroup = useSelector((state) => state.groups?.singleGroup);
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

  const handleClick = () => {
    history.push(`/groups/${targetGroup.id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const event = await dispatch(fetchSingleEventThunk(eventId));
      await dispatch(fetchSingleGroupThunk(event.groupId));
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

  let imgUrlGroup = `No preview image for this group`;
  if (targetGroup && Object.keys(targetGroup).length > 0) {
    const previewImage = targetGroup.GroupImages?.find(
      (img) => img.preview === true
    );
    if (previewImage && Object.keys(previewImage).length > 0) {
      imgUrlGroup = previewImage.url;
    }
  }

  if (isLoading) return null;

  const handleClickDM = async (attendee) => {
    const directChats = await dispatch(fetchAllDirectChatsThunk());
    console.log("directChats", directChats, attendee.id);
    // if current user already has a dm with this member, then redirect to dm
    const matchedDM = isClickMemberMatchingOtherUserInDM(
      parseInt(attendee.id),
      directChats
    );
    if (attendee.id === sessionUser.id) return;

    if (matchedDM) {
      window.scroll(0, 0);
      history.push(`/messages/${matchedDM}`);
    } else {
      // otherwise redirect to a new dm page
      console.log("attendee", attendee);
      const directChatId = await dispatch(createNewDMThunk(attendee.id));
      window.scroll(0, 0);
      history.push(`/messages/${directChatId}`);
    }
  };

  return (
    <div className="bottom-inner3">
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
          <div className="small-group-container cursor" onClick={handleClick}>
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
              <h2 className="small-group-title">{targetEvent?.Group?.name}</h2>
              <div className="small-group-type">
                {targetGroup?.private ? "Private group" : "Public group"}
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
                  {replaceThirdCommaDot(formatDateTime(targetEvent.startDate))}{" "}
                  to
                </div>
                <div>
                  {replaceThirdCommaDot(formatDateTime(targetEvent.endDate))}
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
                  onClick={() => handleClickDM(attendee)}
                >
                  {attendee.picture ? (
                    <div className="member-image">
                      <img
                        src={attendee.picture}
                        alt=""
                        className="member-image"
                      ></img>
                      {attendee?.Attendance[0].status === "organizer" && (
                        <div className="organ-c"></div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="member-image"
                      style={{
                        backgroundColor: getRandomColor(),
                      }}
                    >
                      {attendee?.Attendance[0].status === "organizer" && (
                        <div className="organ-c"></div>
                      )}
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

                  {sessionUser.id !== attendee.id && (
                    <div className="chat-mask cursor">
                      <div className="join-this-group-btn5">Chat</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ManageEventPreview;
