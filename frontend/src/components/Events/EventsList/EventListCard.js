function EventListItem({ event }) {
  return (
    <>
      <div>Events in MeetFun</div>
      <div>
        {event.name} {event.about}
      </div>
    </>
  );
}

export default EventListItem;
