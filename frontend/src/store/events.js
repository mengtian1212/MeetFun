import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_EVENTS = "events/LOAD_EVENTS";

/**  Action Creators: */
export const loadEvents = (events) => ({
  type: LOAD_EVENTS,
  events,
});

/** Thunk Action Creators: */
export const fetchEventsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/events");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadEvents(data.Events));
  }
};

export const fetchEventsByGroupIdThunk = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}/events`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadEvents(data.Events));
  } else {
    const errors = await res.json();
    return errors;
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
