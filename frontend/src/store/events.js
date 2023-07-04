/** Action Type Constants: */
export const LOAD_EVENTS = "events/LOAD_EVENTS";

/**  Action Creators: */
export const loadEvents = (events) => ({
  type: LOAD_EVENTS,
  events,
});

/** Thunk Action Creators: */
export const fetchEvents = () => async (dispatch) => {
  const res = await fetch("/api/events");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadEvents(data.Events));
  }
};

/** Events Reducer: */
const eventsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_EVENTS:
      const eventsState = {};
      action.events.forEach((event) => {
        eventsState[event.id] = event;
      });
      return {
        ...state,
        allEvents: eventsState,
      };
    default:
      return state;
  }
};

export default eventsReducer;
