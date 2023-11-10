import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_EVENT_ATTENDEES = "attendances/LOAD_EVENT_ATTENDEES";
export const LOAD_EVENT_ATTENDANCES = "attendances/LOAD_EVENT_ATTENDANCES";
export const LOAD_MY_ATTENDANCES = "attendances/LOAD_MY_ATTENDANCES";
export const ADD_ATTENDANCE = "attendances/ADD_ATTENDANCE";
export const UPDATE_ATTENDANCE = "attendances/UPDATE_ATTENDANCE";
export const DELETE_ATTENDANCE = "attendances/DELETE_ATTENDANCE";

/**  Action Creators: */
export const loadEventAttendeesAction = (attendees) => ({
  type: LOAD_EVENT_ATTENDEES,
  payload: attendees,
});

export const loadEventAttendancesAction = (attendances) => ({
  type: LOAD_EVENT_ATTENDANCES,
  payload: attendances,
});

export const loadMyAttendancesAction = (attendances) => ({
  type: LOAD_MY_ATTENDANCES,
  payload: attendances,
});

export const addAttendanceAction = (attendance) => ({
  type: ADD_ATTENDANCE,
  payload: attendance,
});

export const updateAttendanceAction = (attendance) => ({
  type: UPDATE_ATTENDANCE,
  payload: attendance,
});

export const deleteAttendanceAction = (attendance) => ({
  type: DELETE_ATTENDANCE,
  payload: attendance,
});

/** Thunk Action Creators: */
export const fetchEventAttendeesThunk = (eventId) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}/attendees`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadEventAttendeesAction(data.Attendees));
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const fetchEventAttendancesThunk = (eventId) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}/attendances`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadEventAttendancesAction(data.Attendances));
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const fetchMyAttendancesThunk = () => async (dispatch) => {
  const res = await csrfFetch(`/api/attendances`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadMyAttendancesAction(data.myAttendances));
  } else {
    const errors = await res.json();
    return errors;
  }
};

// no attendance -> pending
export const addAttendanceThunk = (eventId) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}/attendance`, {
    method: "POST",
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(addAttendanceAction(data));
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const updateAttendanceThunk = (attendee, data) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${data.eventId}/attendance`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (res.ok) {
    const attendance = await res.json();
    attendee.Attendance[0].status = attendance.status;
    const payload = { attendance: attendance, attendee: attendee };

    console.log("in thunk payload", payload);
    dispatch(updateAttendanceAction(payload));
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const deleteAttendanceThunk = (myAttendance) => async (dispatch) => {
  const res = await csrfFetch(
    `/api/events/${myAttendance.eventId}/attendance`,
    {
      method: "DELETE",
      body: JSON.stringify({ userId: myAttendance.userId }),
    }
  );
  if (res.ok) {
    const message = res.json();
    dispatch(deleteAttendanceAction(myAttendance));
    return message;
  } else {
    const errors = await res.json();
    return errors;
  }
};

/** Attendances Reducer: */
const initialState = {
  eventAttendees: {},
  eventAttendances: {},
  myAttendances: {},
};
const attendancesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_EVENT_ATTENDEES:
      const newState = { ...state, eventAttendees: {} };
      action.payload.forEach(
        (attendee) => (newState.eventAttendees[attendee.id] = attendee)
      );
      return newState;
    case LOAD_EVENT_ATTENDANCES:
      const newState1 = { ...state, eventAttendances: {} };
      action.payload.forEach(
        (attendance) => (newState1.eventAttendances[attendance.id] = attendance)
      );
      return newState1;
    case LOAD_MY_ATTENDANCES: {
      const newState = { ...state, myAttendances: {} };
      action.payload.forEach(
        (myAttendance) =>
          (newState.myAttendances[myAttendance.id] = myAttendance)
      );
      return newState;
    }
    case ADD_ATTENDANCE:
      const newState2 = { ...state };
      newState2.eventAttendances = {
        ...newState2.eventAttendances,
        [action.payload.id]: action.payload,
      };
      newState2.myAttendances = {
        ...newState2.myAttendances,
        [action.payload.id]: action.payload,
      };
      return newState2;
    case UPDATE_ATTENDANCE:
      const newState4 = {
        ...state,
        eventAttendees: { ...state.eventAttendees },
        eventAttendances: { ...state.eventAttendances },
        myAttendances: { ...state.myAttendances },
      };
      newState4.eventAttendees = {
        ...newState4.eventAttendees,
        [action.payload.attendee.id]: action.payload.attendee,
      };
      newState4.eventAttendances = {
        ...newState4.eventAttendances,
        [action.payload.attendance.id]: action.payload.attendance,
      };
      return newState4;
    case DELETE_ATTENDANCE:
      const newState3 = {
        ...state,
        eventAttendees: { ...state.eventAttendees },
        eventAttendances: { ...state.eventAttendances },
        myAttendances: { ...state.myAttendances },
      };
      delete newState3.eventAttendees[action.payload.userId];
      delete newState3.eventAttendances[action.payload.id];
      delete newState3.myAttendances[action.payload.id];
      return newState3;
    default:
      return state;
  }
};

export default attendancesReducer;
