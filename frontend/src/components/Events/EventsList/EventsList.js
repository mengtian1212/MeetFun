import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./EventsList.css";
import "./Calendar.css";

import { restoreCSRF } from "../../../store/csrf";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventsThunk } from "../../../store/events";

import EventListCard from "./EventListCard";
import LoadingPage from "../../LoadingPage/LoadingPage";

function EventsList() {
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [filteredEvents, setFilteredEvents] = useState(null);
  const [afterFilteredEvents, setAfterFilteredEvents] = useState(null);

  useEffect(() => {
    dispatch(fetchEventsThunk());
    window.scroll(0, 0);
  }, [dispatch]);

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

  // on calandar, show dots under dates with events
  const eventsWithDots = eventsSorted?.reduce((acc, event) => {
    const eventDate = new Date(event.startDate).toDateString();
    if (!acc[eventDate]) {
      acc[eventDate] = [];
    }
    acc[eventDate].push(event);
    return acc;
  }, {});
  console.log("eventsWithDots", eventsWithDots);

  const tileContent = ({ date, view }) => {
    const eventDate = date.toDateString();
    if (eventsWithDots[eventDate] && view === "month") {
      return (
        <div className={`calendar-dot`}>
          {/* Add a dot or any other indicator here */}
          &bull;
        </div>
      );
    }
    return null;
  };

  // calendar operations:
  const reset = () => {
    setFilteredEvents(null);
    setDate((prev) => new Date());
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);

    // Filter events based on the selected date
    const filteredEvents = eventsSorted?.filter((event) => {
      // Modify the condition to match the selected date
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getFullYear() === selectedDate.getFullYear() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getDate() === selectedDate.getDate()
      );
    });

    // Set the filtered events
    setFilteredEvents(filteredEvents);

    const afterSelectedDateEventsArr = eventsSorted?.filter((event) => {
      const startDateTime = new Date(event.startDate).getTime();
      const selectedDateTime = new Date(selectedDate).getTime();
      console.log("startDateTime", startDateTime, event.startDate);
      console.log("selectedDateTime", selectedDateTime, selectedDate);
      return startDateTime >= selectedDateTime;
    });

    afterSelectedDateEventsArr?.sort((a, b) => {
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
    setAfterFilteredEvents(afterSelectedDateEventsArr);
  };

  if (eventsSorted?.length === 0) return <LoadingPage />;

  return (
    <>
      <div className="event-page-container">
        <section>
          <div id="groups-in-meetfun">Events in MeetFun</div>
          <div className="list-item list-item-events">
            {!filteredEvents &&
              eventsSorted &&
              eventsSorted?.map((event, index) => (
                <div key={event.id}>
                  {index === 0 ||
                  new Date(event.startDate).toDateString() !==
                    new Date(
                      eventsSorted[index - 1].startDate
                    ).toDateString() ? (
                    // Render a header when startDate changes
                    <h2 className="event-header">
                      {new Date().toDateString() ===
                      new Date(event.startDate).toDateString()
                        ? "Today"
                        : new Date(event.startDate).toDateString()}
                    </h2>
                  ) : null}
                  {index === 0 ||
                    (new Date(event.startDate).toDateString() ==
                      new Date(
                        eventsSorted[index - 1].startDate
                      ).toDateString() && (
                      // Render a header when startDate changes
                      <div className="hor-line"></div>
                    ))}
                  <EventListCard event={event} />
                </div>
              ))}
            {filteredEvents && filteredEvents?.length === 0 && (
              <>
                <h2 className="event-header">
                  {date.toDateString() === new Date().toDateString()
                    ? "Today"
                    : date.toDateString()}
                </h2>
                <div className="event-match">
                  <img
                    src="https://secure.meetupstatic.com/next/images/home/Calendar2.svg"
                    alt=""
                    className="event-match-img"
                  />
                  <div className="no-match-text">
                    No matches found for {date.toDateString()}
                  </div>
                </div>
              </>
            )}
            {filteredEvents &&
              afterFilteredEvents?.map((event, index) => (
                <div key={event.id}>
                  {index === 0 ||
                  new Date(event.startDate).toDateString() !==
                    new Date(
                      afterFilteredEvents[index - 1].startDate
                    ).toDateString() ? (
                    <h2 className="event-header">
                      {new Date(event.startDate).toDateString() ===
                      new Date().toDateString()
                        ? "Today"
                        : new Date(event.startDate).toDateString()}
                    </h2>
                  ) : null}
                  {index === 0 ||
                    (new Date(event.startDate).toDateString() ===
                      new Date(
                        afterFilteredEvents[index - 1].startDate
                      ).toDateString() && <div className="hor-line"></div>)}
                  <EventListCard event={event} />
                </div>
              ))}
          </div>
        </section>
        <section>
          <button
            onClick={reset}
            className="view-all-events-btn event-or-group"
          >
            View All Events
          </button>
          <p>Selected Date: {date.toDateString()}</p>
          <Calendar
            onChange={handleDateChange}
            value={date}
            minDate={new Date("2023-01-02")}
            maxDate={new Date("2025-12-31")}
            minDetail="year"
            calendarType="gregory"
            tileContent={tileContent}
          />
        </section>
      </div>
    </>
  );
}

export default EventsList;
