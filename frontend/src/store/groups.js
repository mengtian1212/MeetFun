import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_GROUPS = "groups/LOAD_GROUPS";
export const LOAD_SINGLE_GROUP = "groups/LOAD_SINGLE_GROUP";
export const CREATE_GROUP = "groups/CREATE_GROUP";
export const ADD_GROUP_IMAGES_BY_GROUPID = "groups/ADD_GROUP_IMAGES_BY_GROUPID";
export const UPDATE_GROUP = "groups/UPDATE_GROUP";
export const DELETE_GROUP = "groups/DELETE_GROUP";

/**  Action Creators: */
export const loadGroupsAction = (groups) => ({
  type: LOAD_GROUPS,
  groups,
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

export const editGroupAction = (group) => ({
  type: UPDATE_GROUP,
  group,
});

export const deleteGroupAction = (groupId) => ({
  type: DELETE_GROUP,
  groupId,
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

// export const createGroupThunk = (formData, sessionUser) => async (dispatch) => {
//   try {
//     const res = await csrfFetch(`/api/groups`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     });
//     const newGroup = await res.json();

//     // add group images
//     // const imgRes = await dispatch(addGroupImagesThunk(formData.imageDataArr,newGroup.id));
//     // let newGroupImagesArr = [];
//     // if (formData.imageDataArr.length) {
//     //   for (let groupImage of formData.imageDataArr) {
//     //     const res = await csrfFetch(`/api/groups/${newGroup.id}/images`, {
//     //       method: "POST",
//     //       headers: { "Content-Type": "application/json" },
//     //       body: JSON.stringify(groupImage),
//     //     });

//     //     const newImageObj = await res.json();
//     //     newGroupImagesArr.push(newImageObj);
//     //     await dispatch(
//     //       receiveGroupAction({ newGroup, newGroupImagesArr, sessionUser })
//     //     );
//     //   }
//     // }
//     return newGroup;
//   } catch (err) {
//     console.log("errrrrrrrrr", err);
//     const errors = await err.json();
//     return err;
//   }
// };

export const createGroupThunk = (formData, sessionUser) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (res.ok) {
    console.log("resss ok", res.ok);
    const newGroup = await res.json();
    let newGroupImagesArr = [];
    await dispatch(
      receiveGroupAction({ newGroup, newGroupImagesArr, sessionUser })
    );
    return newGroup;
  } else {
    const errors = await res.json();
    console.log("errrrrrrrrr", errors);
    return errors;
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
      if (!res.ok) {
        const errors = await res.json();
        return errors;
      } else {
        const newImageObj = await res.json();
        newGroupImages.push(newImageObj);
      }
    }
    await dispatch(addGroupImagesAction(newGroupImages));
    return newGroupImages;
  };

export const updateGroupThunk = (group) => async (dispatch) => {
  console.log("beginginging thunk thunk hun");

  const res = await csrfFetch(`/api/groups/${group.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(group),
  });
  console.log("here thunk thunk hun");
  if (res.ok) {
    const updatedGroup = await res.json();
    await dispatch(editGroupAction(updatedGroup));
    return updatedGroup;
  } else {
    const errors = await res.json();
    console.log(errors.name);
    return errors;
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
    case CREATE_GROUP:
      const { newGroup, newGroupImagesArr, sessionUser } = action.payload;
      const newSingleGroupState = {
        ...newGroup,
        GroupImages: newGroupImagesArr,
        Organizer: {
          id: newGroup.organizerId,
          firstName: sessionUser.firstName,
          lastName: sessionUser.lastName,
        },
        Venues: [],
      };
      return { ...state, allGroups: {}, singleGroup: newSingleGroupState };
    case ADD_GROUP_IMAGES_BY_GROUPID:
      return {
        ...state,
        allGroups: {},
        singleGroup: {
          ...state.singleGroup,
          GroupImages: action.newGroupImages,
        },
      };
    case UPDATE_GROUP:
      const updatedAllGroups = { ...state.allGroups };
      updatedAllGroups[action.group.id] = action.group;
      return {
        ...state,
        allGroups: updatedAllGroups,
        singleGroup: { ...state.singleGroup, ...action.group },
      };
    case DELETE_GROUP:
      const newAllGroups = { ...state.allGroups };
      delete newAllGroups[action.groupId];
      return { ...state, allGroups: newAllGroups, singleGroup: {} };
    default:
      return state;
  }
};

export default groupsReducer;
