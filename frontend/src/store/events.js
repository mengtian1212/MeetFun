import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_EVENTS = "events/LOAD_EVENTS";
export const LOAD_SINGLE_EVENT = "events/LOAD_SINGLE_EVENT";
export const CREATE_EVENT = "events/CREATE_EVENT";
export const ADD_EVENT_IMAGES_BY_EVENTID = "events/ADD_EVENT_IMAGES_BY_EVENTID";
export const DELETE_EVENT = "events/DELETE_EVENT";
export const DELETE_EVENTIMAGE = "events/DELETE_EVENTIMAGE";

/**  Action Creators: */
export const loadEventsAction = (events) => ({
  type: LOAD_EVENTS,
  events,
});

export const loadSingleEventAction = (event) => ({
  type: LOAD_SINGLE_EVENT,
  event,
});

export const receiveEventAction = (payload) => ({
  type: CREATE_EVENT,
  payload,
});

export const addEventImagesAction = (eventImages) => ({
  type: ADD_EVENT_IMAGES_BY_EVENTID,
  eventImages,
}); //eventImages is an array of object [{id, url, preview},{id, url, preview}]

export const deleteEventAction = (eventId) => ({
  type: DELETE_EVENT,
  eventId,
});

export const deleteEventImageAction = (imgId) => ({
  type: DELETE_EVENTIMAGE,
  imgId,
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

export const createEventThunk = (formData, group) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${group.id}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const newEvent = await res.json();
  if (res.ok) {
    await dispatch(receiveEventAction({ newEvent, group }));
    return newEvent;
  }
};

//eventImages is an array of object [{id, url, preview},{id, url, preview}]
export const addEventImagesThunk =
  (eventImages, eventId) => async (dispatch) => {
    let newEventImages = [];
    for (let eventImage of eventImages) {
      const res = await csrfFetch(`/api/events/${eventId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventImage),
      });
      if (res.ok) {
        const newImageObj = await res.json();
        newEventImages.push(newImageObj);
      }
    }
    await dispatch(addEventImagesAction(newEventImages));
    console.log("newEventImages", newEventImages);
    return newEventImages;
  };

export const deleteEventImageThunk = (imgId) => async (dispatch) => {
  const response = await csrfFetch(`/api/event-images/${imgId}`, {
    method: "DELETE",
  });
  if (response.status < 400) {
    const data = await response.json();
    dispatch(deleteEventImageAction(imgId));
    return data;
  }
};

export const deleteEventThunk = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });
  if (response.status < 400) {
    const data = await response.json();
    dispatch(deleteEventAction(eventId));
    return data;
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

    case CREATE_EVENT:
      const { newEvent, group } = action.payload;
      const newSingleEventState = {
        ...newEvent,
        Group: group,
        Venue: group.Venues[0]?.id,
        EventImages: [],
      };
      return { ...state, allEvents: {}, singleEvent: newSingleEventState };
    case ADD_EVENT_IMAGES_BY_EVENTID:
      return {
        ...state,
        allEvents: {},
        singleEvent: {
          ...state.singleEvent,
          EventImages: action.newEventImages,
        },
      };
    case DELETE_EVENT:
      const newAllEvents = { ...state.allEvents };
      delete newAllEvents[action.eventId];
      return { ...state, allEvents: newAllEvents, singleEvent: {} };
    case DELETE_EVENTIMAGE:
      const images = [...state.singleEvent.EventImages];
      const targetImageIdx = images.findIndex((obj) => obj.id === action.imgId);
      if (targetImageIdx !== -1) {
        images.splice(targetImageIdx, 1);
      }
      return {
        ...state,
        allEvents: {},
        singleEvent: { ...state.singleEvent, EventImages: images },
      };
    default:
      return state;
  }
};

export default eventsReducer;
