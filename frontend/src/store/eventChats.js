import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_ALL_EVENT_CHATS = "eventChats/LOAD_ALL_EVENT_CHATS";
export const LOAD_SINGLE_EVENT_CHAT = "eventChats/LOAD_SINGLE_EVENT_CHAT";

/**  Action Creators: */
export const loadAllEventChats = (allEventChats) => {
  return {
    type: LOAD_ALL_EVENT_CHATS,
    payload: allEventChats,
  };
};

export const loadSingleEventChat = (singleEventChat) => {
  return {
    type: LOAD_SINGLE_EVENT_CHAT,
    payload: singleEventChat,
  };
};

/** Thunk Action Creators: */
export const fetchAllEventChatsThunk = () => async (dispatch) => {
  const res = await csrfFetch(`/api/event-chats/current`);

  if (res.ok) {
    const data = await res.json();
    const normalizedData = {};
    for (let event of data.eventChats) {
      normalizedData[event.eventChatId] = event;
    }
    dispatch(loadAllEventChats(normalizedData));
    return normalizedData;
  }
};

export const fetchSingleEventChatThunk = (eventChatId) => async (dispatch) => {
  const res = await csrfFetch(`/api/event-chats/${eventChatId}`);

  if (res.ok) {
    const data = await res.json();
    const normalizedData = {};
    data.messages.forEach((message) => {
      normalizedData[message.id] = message;
    });
    return dispatch(
      loadSingleEventChat({
        eventChat: data.eventChat,
        messages: normalizedData,
      })
    );
  }
};

/** DirectChats Reducer: */
const initialState = {
  allEventChats: {},
  singleEventChat: {
    messages: {},
    eventChat: {},
  },
};

const eventChatsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ALL_EVENT_CHATS:
      return { ...state, allEventChats: action.payload };
    case LOAD_SINGLE_EVENT_CHAT:
      return { ...state, singleEventChat: action.payload };
    default:
      return state;
  }
};

export default eventChatsReducer;
