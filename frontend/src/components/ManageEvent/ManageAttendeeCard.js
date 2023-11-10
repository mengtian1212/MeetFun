import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { formatDateString, getRandomColor } from "../../utils/helper-functions";
import {
  deleteAttendanceThunk,
  updateAttendanceThunk,
} from "../../store/attendances";

function ManageAttendeeCard({ attendee, eventOrganizerId }) {
  const { eventId } = useParams();
  const dispatch = useDispatch();
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

  return (
    <div className={`manage-member-container`}>
      <div className="manage-member-left">
        <div
          className={`member-image`}
          style={{
            backgroundColor: getRandomColor(),
          }}
        >
          {attendee?.Attendance[0].status === "organizer" && (
            <div className="organ-c"></div>
          )}
          <span>
            {attendee?.firstName[0]}
            {attendee?.lastName[0]}
          </span>
        </div>

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
          <button className="remove-btn1">
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
