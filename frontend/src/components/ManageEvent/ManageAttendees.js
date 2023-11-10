import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import {
  fetchEventAttendancesThunk,
  fetchEventAttendeesThunk,
  fetchMyAttendancesThunk,
} from "../../store/attendances";
import ManageAttendeeCard from "./ManageAttendeeCard";

function ManageAttendees({ targetEvent }) {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoading, setIsLoading] = useState(true);

  const attendees = useSelector((state) => state.attendances?.eventAttendees);
  const eventAttendeesAll = attendees && Object.values(attendees);

  //event organizer (only 1 person)
  const eventOrganizer = eventAttendeesAll.filter(
    (a) => a.Attendance[0].status === "organizer"
  );

  // event attendees
  const attends = eventAttendeesAll.filter(
    (a) => a.Attendance[0].status === "attending"
  );

  // event pending
  const pendingAttendances = eventAttendeesAll.filter(
    (a) => a.Attendance[0].status === "pending"
  );

  console.log("eventAttendeesAll", eventAttendeesAll, eventOrganizer);
  useEffect(() => {
    dispatch(fetchEventAttendeesThunk(eventId))
      .then(() => dispatch(fetchEventAttendancesThunk(eventId)))
      .then(() => {
        if (sessionUser) dispatch(fetchMyAttendancesThunk());
      })
      .then(() => setIsLoading(false));
    window.scroll(0, 0);
  }, [dispatch, eventId]);

  if (isLoading) return null;
  return (
    <div className="manage-member-out">
      {eventOrganizer?.length > 0 && (
        <section>
          <h2 className="member-title">
            Event Host ({eventOrganizer?.length})
          </h2>
          <section className="manage-member-single">
            {eventOrganizer?.length > 0 &&
              eventOrganizer?.map((attendee) => (
                <ManageAttendeeCard
                  key={attendee.id}
                  attendee={attendee}
                  eventOrganizerId={attendee.id}
                />
              ))}
          </section>
        </section>
      )}

      <section>
        <h2 className="member-title">Attendees ({attends?.length})</h2>
        {attends?.length > 0 ? (
          <section className="group-list-card show-as-white-card1">
            {attends?.length > 0 &&
              attends?.map((attendee) => (
                <ManageAttendeeCard
                  key={attendee.id}
                  attendee={attendee}
                  eventOrganizerId={eventOrganizer[0].id}
                />
              ))}
          </section>
        ) : (
          <div>No attendees found</div>
        )}
      </section>

      <section>
        <h2 className="member-title">
          Pending Attendance ({pendingAttendances?.length})
        </h2>
        {pendingAttendances?.length > 0 ? (
          <section className="group-list-card show-as-white-card1">
            {pendingAttendances?.length > 0 &&
              pendingAttendances?.map((attendee) => (
                <ManageAttendeeCard
                  key={attendee.id}
                  attendee={attendee}
                  eventOrganizerId={eventOrganizer[0].id}
                />
              ))}
          </section>
        ) : (
          <div>No pending requests</div>
        )}
      </section>
    </div>
  );
}

export default ManageAttendees;
