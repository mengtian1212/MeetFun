import { useHistory } from "react-router-dom";

function EventListCard({ event }) {
  const history = useHistory();
  const handleClick = () => {
    history.push(`/events/${event.id}`);
  };

  return (
    <>
      <div className="group-list-card cursor d" onClick={handleClick}>
        <div className="event-list-car">
          <div className="event-card-top">
            <div className="group-list-img-container">
              <img
                src={
                  event.previewImage === `No preview image for this event`
                    ? "https://i0.wp.com/orstx.org/wp-content/uploads/2019/10/no-photo-available-icon-12.jpg?fit=300%2C245&ssl=1"
                    : event.previewImage
                }
                alt="No preview for this event"
              />
            </div>
            <div className="group-list-text-container">
              <div className="group-name">
                <h3 id="event-date-time">
                  {event.startDate.slice(0, 10)} ·{" "}
                  {event.startDate.slice(11, 19)}
                </h3>
                <h2>{event.name}</h2>
                <h3>
                  {event.Venue?.city.toUpperCase()}
                  {",  "}
                  {event.Venue?.state}
                </h3>
              </div>
            </div>
          </div>

          <p className="event-card-bottom">{event.description}</p>
        </div>
      </div>
    </>
  );
}

export default EventListCard;
