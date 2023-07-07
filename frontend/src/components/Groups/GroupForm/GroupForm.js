import "./GroupForm.css";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createGroupThunk, updateGroupThunk } from "../../../store/groups";
import { USSTATES } from "../../../utils/helper-functions";
import { capitalizeFirstChar } from "../../../utils/helper-functions";

const GroupForm = ({ group, formType }) => {
  const [city, setCity] = useState(group?.city || "");
  const [state, setState] = useState(group?.state || "");
  const [name, setName] = useState(group?.name || "");
  const [about, setAbout] = useState(group?.about || "");
  const [type, setType] = useState(group?.type || "");
  // const [privateStatus, setPrivateStatus] = useState(
  //   (group?.private && group?.private === true ? "private" : "public") || ""
  // );
  let isprivate = "";
  if (formType === "Update Group") {
    if (group?.private) isprivate = "private";
    else isprivate = "public";
  }
  const [privateStatus, setPrivateStatus] = useState(isprivate);

  const [imageUrl, setImageUrl] = useState(group?.imgUrl || "");
  const [previewStatus, setPreviewStatus] = useState(
    group?.imgUrl ? true : false
  );

  const [validationErrors, setValidationErrors] = useState({});

  const history = useHistory();
  const dispatch = useDispatch();

  const sessionUser = useSelector((state) => state.session.user);
  const resetForm = () => {
    setCity("");
    setState("");
    setName("");
    setAbout("");
    setType("");
    setPrivateStatus("");
    setImageUrl("");
    setPreviewStatus("");
    return;
  };

  const handleSubmit = async (e) => {
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
      imageUrl.trim().length > 0 &&
      !imageUrl.trim().endsWith(".png") &&
      !imageUrl.trim().endsWith(".jpg") &&
      !imageUrl.trim().endsWith(".jpeg") &&
      !imageUrl.trim().endsWith(".webp")
    ) {
      err.imageUrl = "Image URL must end in .png .jpg or .jpeg";
    }
    if (imageUrl.trim().length > 0 && !previewStatus) {
      err.preview = "Please select the image preview type";
    }

    if (Object.values(err).length) {
      setValidationErrors(err);
      return;
    }
    const imageData = imageUrl.trim().length
      ? [
          {
            url: imageUrl,
            preview: true,
          },
        ]
      : [];
    const formData = {
      id: formType === "Update Group" ? group.id : null,
      city: capitalizeFirstChar(city),
      state,
      name: capitalizeFirstChar(name),
      about: about.trim(),
      type,
      private: privateStatus === "private" ? true : false,
      // imageDataArr: imageData,
    };
    let res;
    if (formType === "Create Group") {
      res = await dispatch(createGroupThunk(formData, sessionUser));
    } else {
      res = await dispatch(updateGroupThunk(formData));
    }
    if (res.id) {
      resetForm();
      history.push(`/groups/${res.id}`);
      window.scroll(0, 0);
    } else {
      setValidationErrors(res.errors);
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    resetForm();
    setValidationErrors({});
    window.scrollTo(0, 0);
    // history.push("/");
  };

  if (!sessionUser) {
    setTimeout(() => history.push("/"), 3000);
    window.scroll(0, 0);
    return (
      <div className="need-log-in">
        <h2 className="">Please log in to create a group</h2>
        <h2>Redirect to Home page...</h2>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="group-form-container">
      <div className="title-container">
        <h2>
          {formType === "Create Group"
            ? "BECOME AN ORGANIZER"
            : "UPDATE YOUR GROUP'S INFORMATION"}
        </h2>
        <h3>
          {formType === "Create Group"
            ? "We'll walk you through a few steps to build your local community"
            : "We'll walk you through a few steps to update your group's information"}
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
        <h2>
          {formType === "Create Group"
            ? "What will your group's name be?"
            : "What is the name of your group?"}
        </h2>
        <p>
          {formType === "Create Group"
            ? "Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind."
            : "Choose a name that will give people a clear idea of what the group is about. Feel free to get creative!"}
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
        <p>
          {formType === "Create Group"
            ? "People will see this when we promote your group, but you'll be able to add to it later, too."
            : "People will see this when we promote your group."}
        </p>
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
          Optional if you would like to decide later.
        </p>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        {validationErrors.imageUrl && (
          <div className="errors">{validationErrors.imageUrl}</div>
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
      <button type="submit">{formType}</button>
      <button type="button" onClick={handleCancelClick}>
        Reset
      </button>
    </form>
  );
};

export default GroupForm;
