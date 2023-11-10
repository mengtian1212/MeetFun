import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_GROUPS = "groups/LOAD_GROUPS";
export const LOAD_SINGLE_GROUP = "groups/LOAD_SINGLE_GROUP";
export const LOAD_CURRENT_GROUPS = "groups/LOAD_CURRENT_GROUPS";

export const CREATE_GROUP = "groups/CREATE_GROUP";
export const ADD_GROUP_IMAGES_BY_GROUPID = "groups/ADD_GROUP_IMAGES_BY_GROUPID";
export const UPDATE_GROUP = "groups/UPDATE_GROUP";
export const DELETE_GROUP = "groups/DELETE_GROUP";
export const DELETE_GROUPIMAGE = "groups/DELETE_GROUPIMAGE";

/**  Action Creators: */
export const loadGroupsAction = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});

export const loadCurrentGroupsAction = (groups) => ({
  type: LOAD_CURRENT_GROUPS,
  payload: groups,
});

export const loadSingleGroupAction = (group) => ({
  type: LOAD_SINGLE_GROUP,
  group,
});

export const receiveGroupAction = (payload) => ({
  type: CREATE_GROUP,
  payload,
});

export const addGroupImagesAction = (groupImages) => ({
  type: ADD_GROUP_IMAGES_BY_GROUPID,
  groupImages,
}); //groupImages is an array of object [{id, url, preview},{id, url, preview}]

export const editGroupAction = (payload) => ({
  type: UPDATE_GROUP,
  payload,
});

export const deleteGroupAction = (groupId) => ({
  type: DELETE_GROUP,
  groupId,
});

export const deleteGroupImageAction = (imgId) => ({
  type: DELETE_GROUPIMAGE,
  imgId,
});

/** Thunk Action Creators: */
export const fetchGroupsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/groups");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadGroupsAction(data.Groups));
  }
};

export const fetchCurrentGroupsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/groups/current");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadCurrentGroupsAction(data.Groups));
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const fetchSingleGroupThunk = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadSingleGroupAction(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const createGroupThunk = (formData, sessionUser) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const newGroup = await res.json();
  if (res.ok) {
    await dispatch(receiveGroupAction({ newGroup, sessionUser }));
    return newGroup;
  }
};

//groupImages is an array of object [{id, url, preview},{id, url, preview}]
export const addGroupImagesThunk =
  (groupImages, groupId) => async (dispatch) => {
    let newGroupImages = [];
    for (let groupImage of groupImages) {
      const res = await csrfFetch(`/api/groups/${groupId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupImage),
      });
      if (res.ok) {
        const newImageObj = await res.json();
        newGroupImages.push(newImageObj);
      }
    }
    await dispatch(addGroupImagesAction(newGroupImages));
    return newGroupImages;
  };

export const updateGroupThunk =
  (formData, sessionUser1) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${formData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const updatedGroup = await res.json();
    if (res.ok) {
      await dispatch(editGroupAction({ updatedGroup, sessionUser1 }));
      return updatedGroup;
    }
  };

export const updateGroupPreviewImageThunk =
  (newPreviewImageObj, oldPreviewImageId, groupId) => async (dispatch) => {
    await csrfFetch(`/api/group-images/${oldPreviewImageId}`, {
      method: "DELETE",
    });
    const res = await csrfFetch(`/api/groups/${groupId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPreviewImageObj),
    });
    if (res.ok) {
      const newImageObj = await res.json();
      const newGroupImages = [newImageObj];
      await dispatch(addGroupImagesAction(newGroupImages));
      return newImageObj;
    }
  };

export const deleteGroupImageThunk = (imgId) => async (dispatch) => {
  const response = await csrfFetch(`/api/group-images/${imgId}`, {
    method: "DELETE",
  });
  if (response.status < 400) {
    const data = await response.json();
    dispatch(deleteGroupImageAction(imgId));
    return data;
  }
};

export const deleteGroupThunk = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });
  if (response.status < 400) {
    const data = await response.json();
    dispatch(deleteGroupAction(groupId));
    return data;
  }
};

const initialState = { allGroups: {}, singleGroup: {}, currentGroups: {} };

/** Groups Reducer: */
const groupsReducer = (state = initialState, action) => {
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
    case LOAD_CURRENT_GROUPS:
      const groupsState1 = { ...state, currentGroups: {} };
      action.payload.forEach(
        (group) => (groupsState1.currentGroups[group.id] = group)
      );
      return groupsState1;
    case LOAD_SINGLE_GROUP:
      return { ...state, singleGroup: { ...action.group } };
    case CREATE_GROUP:
      const { newGroup, sessionUser } = action.payload;
      const newSingleGroupState = {
        ...newGroup,
        GroupImages: [],
        Organizer: {
          id: newGroup.organizerId,
          firstName: sessionUser.firstName,
          lastName: sessionUser.lastName,
        },
        Venues: [],
      };
      return {
        ...state,
        allGroups: {},
        singleGroup: newSingleGroupState,
      };
    case ADD_GROUP_IMAGES_BY_GROUPID:
      return {
        ...state,
        allGroups: {},
        singleGroup: {
          ...state.singleGroup,
          GroupImages: action.newGroupImages,
        },
      };
    case UPDATE_GROUP: // exactly the same as CREATE_GROUP, just the variable name change
      const { updatedGroup, sessionUser1 } = action.payload;
      const updatedSingleGroupState = {
        ...updatedGroup,
        GroupImages: [],
        Organizer: {
          id: updatedGroup.organizerId,
          firstName: sessionUser1.firstName,
          lastName: sessionUser1.lastName,
        },
        Venues: [],
      };
      return {
        ...state,
        allGroups: {},
        singleGroup: updatedSingleGroupState,
      };

    case DELETE_GROUP:
      const newAllGroups = { ...state.allGroups };
      delete newAllGroups[action.groupId];
      return { ...state, allGroups: newAllGroups, singleGroup: {} };
    case DELETE_GROUPIMAGE:
      const images = [...state.singleGroup.GroupImages];
      const targetImageIdx = images.findIndex((obj) => obj.id === action.imgId);
      if (targetImageIdx !== -1) {
        images.splice(targetImageIdx, 1);
      }
      return {
        ...state,
        allGroups: {},
        singleGroup: { ...state.singleGroup, GroupImages: images },
      };
    default:
      return state;
  }
};

export default groupsReducer;
