import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  formatDateTime,
  replaceThirdCommaDot,
} from "../../utils/helper-functions";

function DashboardEventCard({ eventId, attendeeType }) {
  const history = useHistory();
  const event = useSelector((state) => state.events?.allEvents[eventId]);

  return (
    <section
      onClick={
        attendeeType === "organizer"
          ? () => history.push(`/manage-events/${eventId}`)
          : () => history.push(`/events/${eventId}`)
      }
      className="dash-group-container"
    >
      <section className="group-list-img-container1">
        <img
          src={
            event.previewImage === `No preview image for this event`
              ? // ? "https://i0.wp.com/orstx.org/wp-content/uploads/2019/10/no-photo-available-icon-12.jpg?fit=300%2C245&ssl=1"
                "https://secure.meetupstatic.com/next/images/find/emptyResultsIcon.svg"
              : event.previewImage
          }
          alt="No event preview"
          className="img-class"
        />
      </section>

      <section className="dash-group-middle">
        <div className="group-name">
          <h2>{event.name}</h2>
        </div>
        <div className="dash-group-middle1">
          <i className="fa-solid fa-calendar-days"></i>
          {replaceThirdCommaDot(formatDateTime(event.startDate))}
        </div>
      </section>

      {attendeeType !== "pending" && new Date(event.startDate) > new Date() && (
        <section className="dash-group-nummembers1">
          <i className="fa-solid fa-comment-dots"></i>Event Chat
        </section>
      )}
    </section>
  );
}

export default DashboardEventCard;
