import "./UpdateGroup.css";
import { useParams, useHistory, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { USSTATES } from "../../../utils/helper-functions";
import { capitalizeFirstChar } from "../../../utils/helper-functions";

import {
  fetchSingleGroupThunk,
  updateGroupThunk,
  updateGroupPreviewImageThunk,
  addGroupImagesThunk,
  deleteGroupImageThunk,
} from "../../../store/groups";

function UpdateGroup() {
  const history = useHistory();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const { groupId } = useParams();
  const group = useSelector((state) =>
    state.groups.singleGroup ? state.groups.singleGroup : null
  );

  let oldPreviewImgUrl = "";
  let oldPreviewImgId;
  const previewImage = group?.GroupImages?.find((img) => img.preview === true);
  if (previewImage && Object.keys(previewImage).length > 0) {
    oldPreviewImgUrl = previewImage.url;
    oldPreviewImgId = previewImage.id;
  }
  const [city, setCity] = useState(group?.city || "");
  const [state, setState] = useState(group?.state || "");
  const [name, setName] = useState(group?.name || "");
  const [about, setAbout] = useState(group?.about || "");
  const [type, setType] = useState(group?.type || "");
  const [privateStatus, setPrivateStatus] = useState(
    group?.private ? "private" : "public"
  );
  const [previewImgUrl, setPreviewImgUrl] = useState(oldPreviewImgUrl || "");

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    dispatch(fetchSingleGroupThunk(Number(groupId)));
  }, [dispatch, groupId]);

  const resetForm = () => {
    setCity("");
    setState("");
    setName("");
    setAbout("");
    setType("");
    setPrivateStatus("");
    setPreviewImgUrl("");
    // setPreviewStatus("");
    return;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationErrors({});
    const err = {};
    if (city.trim().length === 0) err.city = "City is required";
    if (!state) err.state = "Please select a state";
    if (name.trim().length === 0) err.name = "Name is required";
    if (about.trim().length < 30)
      err.about = "Description must be at least 30 characters long";
    if (!type) err.type = "Please select a group type";
    if (privateStatus.length === 0)
      err.privateStatus = "Please select a visibility type";
    if (
      previewImgUrl.trim().length > 0 &&
      !previewImgUrl.trim().endsWith(".png") &&
      !previewImgUrl.trim().endsWith(".jpg") &&
      !previewImgUrl.trim().endsWith(".jpeg") &&
      !previewImgUrl.trim().endsWith(".webp")
    ) {
      err.previewImgUrl = "Image URL must end in .png .jpg or .jpeg";
    }

    if (Object.values(err).length) {
      setValidationErrors(err);
      return;
    }

    const newPreviewImageObj = previewImgUrl.trim().length
      ? {
          url: previewImgUrl.trim(),
          preview: true,
        }
      : {};

    const formData = {
      id: group.id,
      name: capitalizeFirstChar(name),
      about: about.trim(),
      type,
      private: privateStatus === "private" ? true : false,
      city: capitalizeFirstChar(city),
      state,
    };

    // data preparation done, now dispatch thunks
    dispatch(updateGroupThunk(formData, sessionUser))
      .then(async (updatedGroup) => {
        if (!oldPreviewImgUrl && newPreviewImageObj?.url) {
          await dispatch(
            addGroupImagesThunk([newPreviewImageObj], updatedGroup.id)
          );
        } else if (
          oldPreviewImgUrl &&
          newPreviewImageObj?.url &&
          oldPreviewImgUrl !== newPreviewImageObj?.url
        ) {
          await dispatch(
            updateGroupPreviewImageThunk(
              newPreviewImageObj,
              oldPreviewImgId,
              updatedGroup.id
            )
          );
        } else if (oldPreviewImgUrl && !newPreviewImageObj?.url) {
          await dispatch(deleteGroupImageThunk(oldPreviewImgId));
        }
        history.push(`/groups/${updatedGroup.id}`);
      })
      .catch(async (err) => {
        const errors = await err.json();
        setValidationErrors(errors.errors);
      });
  };

  if (!sessionUser) {
    setTimeout(() => history.push(`/`), 3000);
    window.scroll(0, 0);
    return (
      <div className="need-log-in">
        <h2 className="">Please log in to create a group</h2>
        <h2>Redirect to home page...</h2>
      </div>
    );
  } else if (group?.organizerId !== sessionUser.id) {
    setTimeout(() => history.push(`/groups`), 3000);
    window.scroll(0, 0);
    return (
      <div className="need-log-in">
        <h2 className="">Unauthorized to update this group</h2>
        <h2>Redirect to all groups...</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="event-or-group-container">
        <NavLink exact to={`/groups/${groupId}`} className="event-or-group">
          Back to current group
        </NavLink>
      </div>
      <form onSubmit={handleSubmit} className="group-form-container">
        <div className="title-container">
          <h2>UPDATE YOUR GROUP'S INFORMATION</h2>
          <h3>
            We'll walk you through a few steps to update your group's
            information
          </h3>
        </div>
        <div className="1st-container">
          <h2>First, set your group's location.</h2>
          <p>
            Meetup groups meet locally, in person and online. We'll connect you
            with people in your area, and more can join you online.
          </p>
          <div className="city-state-input-container">
            <input
              placeholder="City"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <select
              placeholder="(select one)"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">Select State</option>
              {USSTATES.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </div>
          {validationErrors.city && (
            <div className="errors">{validationErrors.city}</div>
          )}
          {validationErrors.state && (
            <div className="errors">{validationErrors.state}</div>
          )}
        </div>

        <div className="1st-container">
          <h2>What is the name of your group?</h2>
          <p>
            Choose a name that will give people a clear idea of what the group
            is about. Feel free to get creative!
          </p>
          <input
            placeholder="What is your group name?"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {validationErrors.name && (
            <div className="errors">{validationErrors.name}</div>
          )}
        </div>
        <div className="1st-container">
          <h2>Now describe what your group will be about</h2>
          <p>People will see this when we promote your group.</p>
          <p>1. What's the purpose of the group?</p>
          <p>2. Who should join?</p>
          <p>3. What will you do at your events?</p>
          <input
            placeholder="Please write at least 30 characters"
            type="textarea"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
          {validationErrors.about && (
            <div className="errors">{validationErrors.about}</div>
          )}
        </div>
        <div className="1st-container">
          <h2>Final steps...</h2>
          <div className="final-step-questions">
            <p>Is this an in person or online group?</p>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">(select one)</option>
              <option value="In person">In person</option>
              <option value="Online">Online</option>
            </select>
            {validationErrors.type && (
              <div className="errors">{validationErrors.type}</div>
            )}
          </div>
          <p>Is this group private or public?</p>
          <select
            value={privateStatus}
            onChange={(e) => setPrivateStatus(e.target.value)}
          >
            <option value="">(select one)</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
          {validationErrors.privateStatus && (
            <div className="errors">{validationErrors.privateStatus}</div>
          )}
          <p>
            Please add in image url as the preview image for your group below:
            Optional if you would like to decide later. You might change another
            preview page by putting a new image url or delete the url to reset
            the preview image.
          </p>
          <input
            type="text"
            value={previewImgUrl}
            onChange={(e) => setPreviewImgUrl(e.target.value)}
          />
          {validationErrors.previewImgUrl && (
            <div className="errors">{validationErrors.previewImgUrl}</div>
          )}
          {/* <p>Set as preview image?</p>
        <input
          type="checkbox"
          checked={previewStatus}
          onChange={(e) => setPreviewStatus(!previewStatus)}
        />
        {!validationErrors.previewStatus && (
          <div className="errors">{validationErrors.previewStatus}</div>
        )} */}
        </div>
        <button type="submit">Update My Group</button>
      </form>
    </div>
  );
}

export default UpdateGroup;
