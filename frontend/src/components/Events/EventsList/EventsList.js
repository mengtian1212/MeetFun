import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventsThunk } from "../../../store/events";
import "./EventsList.css";

import EventListCard from "./EventListCard";

function EventsList() {
  const events = Object.values(
    useSelector((state) =>
      state.events.allEvents ? state.events.allEvents : {}
    )
  );

  const upcomingEventsArr = events?.filter((event) => {
    const startDateTime = new Date(event.startDate).getTime();
    const currDateTime = new Date().getTime();
    return startDateTime > currDateTime;
  });

  upcomingEventsArr?.sort((a, b) => {
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

  const pastEventsArr = events?.filter((event) => {
    const startDateTime = new Date(event.startDate).getTime();
    const currDateTime = new Date().getTime();
    return startDateTime <= currDateTime;
  });

  pastEventsArr?.sort((a, b) => {
    const dateA = a.startDate;
    const dateB = b.startDate;
    if (dateA < dateB) {
      return 1;
    } else if (dateA > dateB) {
      return -1;
    } else {
      return 0;
    }
  });

  const eventsSorted = [...upcomingEventsArr, ...pastEventsArr];

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchEventsThunk());
    window.scroll(0, 0);
  }, [dispatch]);

  if (eventsSorted.length === 0)
    return (
      <div className="spinner">
        <img
          src="../../image/Spin-1s-118px.gif"
          alt="Loading in progress"
        ></img>
      </div>
    );

  return (
    <>
      <div id="groups-in-meetfun">Events in MeetFun</div>
      <div className="list-item">
        {eventsSorted.map((event) => (
          <EventListCard key={event.id} event={event} />
        ))}
      </div>
    </>
  );
}

export default EventsList;
