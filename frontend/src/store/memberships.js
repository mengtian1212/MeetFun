import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_GROUP_MEMBERS = "memberships/LOAD_GROUP_MEMBERS";
export const LOAD_GROUP_MEMBERSHIPS = "memberships/LOAD_GROUP_MEMBERSHIPS";
export const LOAD_MY_MEMBERSHIPS = "memberships/LOAD_MY_MEMBERSHIPS";
export const ADD_MEMBERSHIP = "memberships/ADD_MEMBERSHIP";
export const UPDATE_MEMBERSHIP = "memberships/UPDATE_MEMBERSHIP";
export const DELETE_MEMBERSHIP = "memberships/DELETE_MEMBERSHIP";

/**  Action Creators: */
export const loadGroupMembersAction = (members) => ({
  type: LOAD_GROUP_MEMBERS,
  payload: members,
});

export const loadGroupMembershipsAction = (memberships) => ({
  type: LOAD_GROUP_MEMBERSHIPS,
  payload: memberships,
});

export const loadMyMembershipsAction = (memberships) => ({
  type: LOAD_MY_MEMBERSHIPS,
  payload: memberships,
});

export const addMembershipAction = (membership) => ({
  type: ADD_MEMBERSHIP,
  payload: membership,
});

export const updateMembershipAction = (membership) => ({
  type: UPDATE_MEMBERSHIP,
  payload: membership,
});

export const deleteMembershipAction = (membership) => ({
  type: DELETE_MEMBERSHIP,
  payload: membership,
});

/** Thunk Action Creators: */
export const fetchGroupMembersThunk = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}/members`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadGroupMembersAction(data.Members));
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const fetchGroupMembershipsThunk = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}/memberships`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadGroupMembershipsAction(data.Memberships));
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const fetchMyMembershipsThunk = () => async (dispatch) => {
  const res = await csrfFetch(`/api/memberships`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadMyMembershipsAction(data.myMemberships));
  } else {
    const errors = await res.json();
    return errors;
  }
};

// no membership -> pending
export const addMembershipThunk = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}/membership`, {
    method: "POST",
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(addMembershipAction(data));
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const updateMembershipThunk = (member, data) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${data.groupId}/membership`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (res.ok) {
    const membership = await res.json();
    member.Membership[0].status = membership.status;
    const payload = { membership: membership, member: member };

    console.log("in thunk payload", payload);
    dispatch(updateMembershipAction(payload));
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const deleteMembershipThunk = (myMembership) => async (dispatch) => {
  const res = await csrfFetch(
    `/api/groups/${myMembership.groupId}/membership`,
    {
      method: "DELETE",
      body: JSON.stringify({ memberId: myMembership.userId }),
    }
  );
  if (res.ok) {
    const message = await res.json();
    dispatch(deleteMembershipAction(myMembership));
    return message;
  } else {
    const errors = await res.json();
    return errors;
  }
};

/** Memberships Reducer: */
const initialState = {
  groupMembers: {},
  groupMemberships: {},
  myMemberships: {},
};
const membershipsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_GROUP_MEMBERS:
      const newState = { ...state, groupMembers: {} };
      action.payload.forEach(
        (member) => (newState.groupMembers[member.id] = member)
      );
      return newState;
    case LOAD_GROUP_MEMBERSHIPS:
      const newState1 = { ...state, groupMemberships: {} };
      action.payload.forEach(
        (membership) => (newState1.groupMemberships[membership.id] = membership)
      );
      return newState1;
    case LOAD_MY_MEMBERSHIPS: {
      const newState = { ...state, myMemberships: {} };
      action.payload.forEach(
        (myMembership) =>
          (newState.myMemberships[myMembership.id] = myMembership)
      );
      return newState;
    }
    case ADD_MEMBERSHIP:
      const newState2 = { ...state };
      newState2.groupMemberships = {
        ...newState2.groupMemberships,
        [action.payload.id]: action.payload,
      };
      newState2.myMemberships = {
        ...newState2.myMemberships,
        [action.payload.id]: action.payload,
      };
      return newState2;
    case UPDATE_MEMBERSHIP:
      const newState4 = {
        ...state,
        groupMembers: { ...state.groupMembers },
        groupMemberships: { ...state.groupMemberships },
        myMemberships: { ...state.myMemberships },
      };
      newState4.groupMembers = {
        ...newState4.groupMembers,
        [action.payload.member.id]: action.payload.member,
      };
      newState4.groupMemberships = {
        ...newState4.groupMemberships,
        [action.payload.membership.id]: action.payload.membership,
      };
      // newState4.myMemberships = {
      //   ...newState4.myMemberships,
      //   [action.payload.membership.id]: action.payload.membership,
      // };
      return newState4;
    case DELETE_MEMBERSHIP:
      const newState3 = {
        ...state,
        groupMembers: { ...state.groupMembers },
        groupMemberships: { ...state.groupMemberships },
        myMemberships: { ...state.myMemberships },
      };
      delete newState3.groupMembers[action.payload.userId];
      delete newState3.groupMemberships[action.payload.id];
      delete newState3.myMemberships[action.payload.id];
      return newState3;
    default:
      return state;
  }
};

export default membershipsReducer;
