/** Action Type Constants: */
export const LOAD_GROUPS = "groups/LOAD_GROUPS";
export const LOAD_SINGLE_GROUP = "groups/LOAD_SINGLE_GROUP";

/**  Action Creators: */
export const loadGroups = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});

export const loadSingleGroup = (group) => ({
  type: LOAD_SINGLE_GROUP,
  group,
});

/** Thunk Action Creators: */
export const fetchGroups = () => async (dispatch) => {
  const res = await fetch("/api/groups");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadGroups(data.Groups));
  }
};

export const fetchSingleGroup = (groupId) => async (dispatch) => {
  const res = await fetch(`/api/groups/${groupId}`);
  console.log("in the thunk..");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadSingleGroup(data));
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
      console.log({
        ...state,
        allGroups: { ...groupsState, optionalOrderedList: [] },
      });
      return {
        ...state,
        allGroups: { ...groupsState, optionalOrderedList: [] },
      };
    case LOAD_SINGLE_GROUP:
      return { ...state, singleGroup: { ...action.group } };
    default:
      return state;
  }
};

export default groupsReducer;
