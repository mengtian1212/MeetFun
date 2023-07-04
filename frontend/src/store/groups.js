/** Action Type Constants: */
export const LOAD_GROUPS = "groups/LOAD_GROUPS";

/**  Action Creators: */
export const loadGroups = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});

/** Thunk Action Creators: */
export const fetchGroups = () => async (dispatch) => {
  const res = await fetch("/api/groups");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadGroups(data.Groups));
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
    default:
      return state;
  }
};

export default groupsReducer;
