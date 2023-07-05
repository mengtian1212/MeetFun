import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../../store/events";
import "./EventsList.css";

import EventListCard from "./EventListCard";

function EventsList() {
  const events = Object.values(
    useSelector((state) =>
      state.events.allEvents ? state.events.allEvents : []
    )
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchEvents());
    window.scroll(0, 0);
  }, [dispatch]);

  if (events.length === 0) return null;

  events.sort((a, b) => {
    const dateA = a.startDate;
    const dateB = b.startDate;
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <>
      <div id="groups-in-meetfun">Events in MeetFun</div>
      <div className="list-item">
        {events.map((event) => (
          <EventListCard key={event.id} event={event} />
        ))}
      </div>
    </>
  );
}

export default EventsList;
