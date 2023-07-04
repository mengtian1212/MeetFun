function EventListCard({ event }) {
  return (
    <>
      <div className="group-list-card cursor d">
        <div className="event-list-car">
          <div className="event-card-top">
            <div className="group-list-img-container">
              <img
                src={
                  event.previewImage === `No preview image for this event`
                    ? "https://i0.wp.com/orstx.org/wp-content/uploads/2019/10/no-photo-available-icon-12.jpg?fit=300%2C245&ssl=1"
                    : event.previewImage
                }
                alt="placeholder"
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

          <p className="event-card-bottom">
            The theme of this meetFun event is {event.name}. However, the
            organizer doesn't provide any description yet. Please click to check
            more details or dm the organizer for detailed information. We look
            forward to seeing you there!
          </p>
        </div>
      </div>
    </>
  );
}

export default EventListCard;
