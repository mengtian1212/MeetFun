import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_EVENTS = "events/LOAD_EVENTS";
export const LOAD_SINGLE_EVENT = "events/LOAD_SINGLE_EVENT";

/**  Action Creators: */
export const loadEventsAction = (events) => ({
  type: LOAD_EVENTS,
  events,
});

export const loadSingleEventAction = (event) => ({
  type: LOAD_SINGLE_EVENT,
  event,
});

/** Thunk Action Creators: */
export const fetchEventsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/events");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadEventsAction(data.Events));
  }
};

export const fetchSingleEventThunk = (eventId) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadSingleEventAction(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const fetchEventsByGroupIdThunk = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}/events`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadEventsAction(data.Events));
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
        singleEvent: {},
      };
    case LOAD_SINGLE_EVENT:
      return { ...state, singleEvent: { ...action.event } };
    default:
      return state;
  }
};

export default eventsReducer;
