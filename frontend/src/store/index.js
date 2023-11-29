import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import sessionReducer from "./session";
import groupsReducer from "./groups";
import eventsReducer from "./events";
import membershipsReducer from "./memberships";
import attendancesReducer from "./attendances";
import directChatsReducer from "./directChats";
import eventChatsReducer from "./eventChats";

const rootReducer = combineReducers({
  // add reducer functions here
  session: sessionReducer,
  groups: groupsReducer,
  events: eventsReducer,
  memberships: membershipsReducer,
  attendances: attendancesReducer,
  directChats: directChatsReducer,
  eventChats: eventChatsReducer,
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
