import { useHistory } from "react-router-dom";
import {
  formatDateTime,
  replaceThirdCommaDot,
} from "../../../utils/helper-functions";

function EventListCard({ event, cardMode }) {
  const history = useHistory();
  const handleClick = () => {
    history.push(`/events/${event.id}`);
    window.scroll(0, 0);
  };

  const cardClassName = cardMode ? "show-as-white-card" : "";

  return (
    <>
      <div
        className={`group-list-card cursor d ${cardClassName}`}
        onClick={handleClick}
      >
        <div className={`event-list-card ${cardClassName} ${cardMode && "aa"}`}>
          <div className="event-card-top">
            <div className="group-list-img-container">
              <img
                src={
                  event.previewImage === `No preview image for this event`
                    ? "https://i0.wp.com/orstx.org/wp-content/uploads/2019/10/no-photo-available-icon-12.jpg?fit=300%2C245&ssl=1"
                    : event.previewImage
                }
                alt="No event preview"
              />
            </div>
            <div className="group-list-text-container">
              <div className={`group-name`}>
                <h3 id={`event-date-time`}>
                  {replaceThirdCommaDot(formatDateTime(event.startDate))}
                </h3>
                <h2 className={cardMode && "text-format-title"}>
                  {event.name}
                </h2>
                {event.Venue && (
                  <h3>
                    {event.Venue?.city.toUpperCase()}
                    {",  "}
                    {event.Venue?.state}
                  </h3>
                )}
              </div>
            </div>
          </div>

          <p className={`event-card-bottom ${cardMode && "text-format-p"}`}>
            {event.description}
          </p>
        </div>
      </div>
    </>
  );
}

export default EventListCard;
