import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_ALL_DIRECT_CHATS = "directChats/LOAD_ALL_DIRECT_CHATS";
export const LOAD_SINGLE_DIRECT_CHAT = "directChats/LOAD_SINGLE_DIRECT_CHAT";

/**  Action Creators: */
export const loadAllDirectChats = (allDirectChats) => {
  return {
    type: LOAD_ALL_DIRECT_CHATS,
    payload: allDirectChats,
  };
};

export const loadSingleDirectChat = (singleDirectChat) => {
  return {
    type: LOAD_SINGLE_DIRECT_CHAT,
    payload: singleDirectChat,
  };
};

/** Thunk Action Creators: */
export const fetchAllDirectChatsThunk = () => async (dispatch) => {
  const res = await csrfFetch(`/api/direct-chats/current`);

  if (res.ok) {
    const data = await res.json();
    const normalizedData = {};
    for (let directChat of data.directChats) {
      normalizedData[directChat.id] = directChat;
    }
    return dispatch(loadAllDirectChats(normalizedData));
  }
};

export const fetchSingleDirectChatThunk = (messageId) => async (dispatch) => {
  const res = await csrfFetch(`/api/direct-chats/${messageId}`);

  if (res.ok) {
    const data = await res.json();
    const normalizedData = {};
    data.messages.forEach((message) => {
      normalizedData[message.id] = message;
    });
    return dispatch(
      loadSingleDirectChat({
        directChat: data.directChat,
        messages: normalizedData,
      })
    );
  }
};

/** DirectChats Reducer: */
const initialState = {
  allDirectChats: {},
  singleDirectChat: {
    messages: {},
    directChat: {},
  },
};

const directChatsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ALL_DIRECT_CHATS:
      return { ...state, allDirectChats: action.payload };
    case LOAD_SINGLE_DIRECT_CHAT:
      return { ...state, singleDirectChat: action.payload };
    default:
      return state;
  }
};

export default directChatsReducer;
