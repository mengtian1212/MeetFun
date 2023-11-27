import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_ALL_DIRECT_CHATS = "directChats/LOAD_ALL_DIRECT_CHATS";
export const LOAD_SINGLE_DIRECT_CHAT = "directChats/LOAD_SINGLE_DIRECT_CHAT";
export const LOAD_ALL_USERS = "directChats/LOAD_ALL_USERS";

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

export const loadAllUsers = (allUsers) => {
  return {
    type: LOAD_ALL_USERS,
    payload: allUsers,
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
    dispatch(loadAllDirectChats(normalizedData));
    return normalizedData;
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

export const fetchAllUsersThunk = () => async (dispatch) => {
  const res = await csrfFetch(`/api/direct-chats/users`);
  if (res.ok) {
    const data = await res.json();
    const normalizedData = {};
    data.users.forEach((user) => {
      normalizedData[user.id] = user;
    });
    return dispatch(loadAllUsers(normalizedData));
  }
};

export const createNewDMThunk = (otherUserId) => async (dispatch) => {
  const res = await csrfFetch(`/api/direct-chats/new/${otherUserId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  console.log("in thunk!!!!!");
  console.log("in thunk!!!!!eeeee");
  if (res.ok) {
    await dispatch(loadAllDirectChats());
    const chatId = await res.json();
    console.log("in thunk!!!!!", chatId);

    return chatId.id;
  }
};

/** DirectChats Reducer: */
const initialState = {
  allDirectChats: {},
  singleDirectChat: {
    messages: {},
    directChat: {},
  },
  allUsers: {},
};

const directChatsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ALL_DIRECT_CHATS:
      return { ...state, allDirectChats: action.payload };
    case LOAD_SINGLE_DIRECT_CHAT:
      return { ...state, singleDirectChat: action.payload };
    case LOAD_ALL_USERS:
      return { ...state, allUsers: action.payload };
    default:
      return state;
  }
};

export default directChatsReducer;
