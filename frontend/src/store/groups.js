import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_GROUPS = "groups/LOAD_GROUPS";
export const LOAD_SINGLE_GROUP = "groups/LOAD_SINGLE_GROUP";

/**  Action Creators: */
export const loadGroupsAction = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});

export const loadSingleGroupAction = (group) => ({
  type: LOAD_SINGLE_GROUP,
  group,
});

/** Thunk Action Creators: */
export const fetchGroupsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/groups");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadGroupsAction(data.Groups));
  }
};

export const fetchSingleGroupThunk = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`);
  console.log("in the thunk..");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadSingleGroupAction(data));
  } else {
    const errors = await res.json();
    return errors;
  }
};

/** Groups Reducer: */
const groupsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_GROUPS:
      const groupsState = {};
      action.groups.forEach((group) => {
        groupsState[group.id] = group;
      });
      return {
        ...state,
        allGroups: { ...groupsState, optionalOrderedList: [] },
        singleGroup: {},
      };
    case LOAD_SINGLE_GROUP:
      return { ...state, singleGroup: { ...action.group } };
    default:
      return state;
  }
};

export default groupsReducer;
