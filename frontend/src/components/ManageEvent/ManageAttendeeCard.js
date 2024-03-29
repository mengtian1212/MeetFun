import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import {
  formatDateString,
  getRandomColor,
  isClickMemberMatchingOtherUserInDM,
} from "../../utils/helper-functions";
import {
  deleteAttendanceThunk,
  updateAttendanceThunk,
} from "../../store/attendances";
import {
  createNewDMThunk,
  fetchAllDirectChatsThunk,
} from "../../store/directChats";

function ManageAttendeeCard({ attendee, eventOrganizerId }) {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);

  const handleClickLeave = (e) => {
    console.log("uuuu", {
      id: attendee.Attendance[0].id,
      userId: attendee.id,
      eventId: parseInt(eventId),
      status: attendee.Attendance[0].status,
    });
    return dispatch(
      deleteAttendanceThunk({
        id: attendee.Attendance[0].id,
        userId: attendee.id,
        eventId: parseInt(eventId),
        status: attendee.Attendance[0].status,
      })
    );
  };

  const updateAttendeeStatus = (attendee, status) => {
    const data = {
      userId: parseInt(attendee.id),
      status: status,
      eventId: parseInt(eventId),
    };
    return dispatch(updateAttendanceThunk(attendee, data));
  };

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
    <div className={`manage-member-container`}>
      <div className="manage-member-left">
        {attendee.picture ? (
          <div className="member-image">
            <img src={attendee.picture} alt="" className="member-image"></img>
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

        <div className="">
          <div className="member-name">
            {attendee.firstName}&nbsp;
            {attendee.lastName}
          </div>
          <div className="member-s2">
            {attendee.Attendance[0].status[0].toUpperCase()}
            {attendee.Attendance[0].status.slice(1)}
          </div>
          <div className="member-s2">
            Joined {formatDateString(attendee.Attendance[0].updatedAt)}
          </div>
        </div>
      </div>

      <div className="member-btns">
        {sessionUser && sessionUser.id === attendee.id && (
          <div className="youu">You!</div>
        )}
        {sessionUser && sessionUser.id !== attendee.id && (
          <button
            className="remove-btn1"
            onClick={() => handleClickDM(attendee)}
          >
            <i className="fa-solid fa-message"></i>Chat
          </button>
        )}

        {attendee.Attendance[0].status === "attending" &&
          eventOrganizerId === sessionUser.id && (
            <button className="remove-btn" onClick={handleClickLeave}>
              Remove from event
            </button>
          )}

        {attendee.Attendance[0].status === "pending" && (
          <>
            <button
              className="remove-btn2"
              onClick={() => updateAttendeeStatus(attendee, "attending")}
            >
              Approve
            </button>
            <button className="remove-btn" onClick={handleClickLeave}>
              Decline
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ManageAttendeeCard;
