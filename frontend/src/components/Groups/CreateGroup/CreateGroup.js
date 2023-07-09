import "./CreateGroup.css";
import { useState } from "react";
import { useHistory, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { USSTATES } from "../../../utils/helper-functions";
import { capitalizeFirstChar } from "../../../utils/helper-functions";
import { addGroupImagesThunk, createGroupThunk } from "../../../store/groups";

function CreateGroup() {
  const history = useHistory();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("");
  const [privateStatus, setPrivateStatus] = useState("");
  // another dispatch for add group image
  const [imageUrl, setImageUrl] = useState("");
  // const [previewStatus, setPreviewStatus] = useState(true);

  const [validationErrors, setValidationErrors] = useState({});

  const resetForm = () => {
    setCity("");
    setState("");
    setName("");
    setAbout("");
    setType("");
    setPrivateStatus("");
    setImageUrl("");
    // setPreviewStatus("");
    setValidationErrors({});
    return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    const err = {};
    if (city.trim().length === 0) err.city = "City is required";
    if (!state) err.state = "State is required";
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
      name: capitalizeFirstChar(name),
      about: about.trim(),
      type,
      private: privateStatus === "private" ? true : false,
      city: capitalizeFirstChar(city),
      state,
    };
    console.log("formdata:", formData);
    console.log("imageData:", imageData);
    console.log("sessionUser:", sessionUser);

    // data preparation done, now dispatch thunks
    dispatch(createGroupThunk(formData, sessionUser))
      .then(async (newGroup) => {
        await dispatch(addGroupImagesThunk(imageData, newGroup.id));
        history.push(`/groups/${newGroup.id}`);
      })
      .catch(async (err) => {
        const errors = await err.json();
        setValidationErrors(errors.errors);
      });
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    resetForm();
    setValidationErrors({});
    window.scrollTo(0, 0);
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
      <div className="main-container">
        <NavLink exact to="/groups" className="back-to-groups-container">
          <i className={`fa-solid fa-chevron-left arrow`}></i>{" "}
          <span className="event-or-group selected">Back to all groups</span>
        </NavLink>
        <div className="title-container">
          <h2 className="biggest-green">BECOME AN ORGANIZER</h2>
          <h3 className="biggest">
            We'll walk you through a few steps to build your local community
          </h3>
        </div>
        <div className="title-container">
          <h2 className="biggest">First, set your group's location.</h2>
          <p className="form-description">
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
              // placeholder=""
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={state === "" ? "first-option" : ""}
            >
              <option value="">-- Select State --</option>
              {USSTATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
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

        <div className="title-container">
          <h2 className="biggest">What will your group's name be?</h2>
          <p className="form-description">
            Choose a name that will give people a clear idea of what the group
            is about. Feel free to get creative! You can edit this later if you
            change your mind.
          </p>
          <input
            placeholder="What is your group name?"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-box1"
          />
          {validationErrors.name && (
            <div className="errors">{validationErrors.name}</div>
          )}
        </div>
        <div className="title-container">
          <h2 className="biggest">
            Now describe what your group will be about
          </h2>
          <p className="form-description">
            People will see this when we promote your group, but you'll be able
            to add to it later, too.
          </p>
          <div>
            <p className="form-description1">
              1. What's the purpose of the group?
            </p>
            <p className="form-description1">2. Who should join?</p>
            <p className="form-description1">
              3. What will you do at your events?
            </p>
          </div>
          <textarea
            placeholder="Please write at least 30 characters"
            type="textarea"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
          {validationErrors.about && (
            <div className="errors">{validationErrors.about}</div>
          )}
        </div>
        <div className="title-container">
          <h2 className="biggest">Final steps...</h2>
          <div className="final-step-questions">
            <p className="form-description">
              Is this an in person or online group?
            </p>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={type === "" ? "first-option" : ""}
            >
              <option value="">-- Select group type --</option>
              <option value="In person">In person</option>
              <option value="Online">Online</option>
            </select>
            {validationErrors.type && (
              <div className="errors">{validationErrors.type}</div>
            )}
          </div>
          <div className="final-step-questions">
            <p className="form-description">Is this group private or public?</p>
            <select
              value={privateStatus}
              onChange={(e) => setPrivateStatus(e.target.value)}
              className={privateStatus === "" ? "first-option" : ""}
            >
              <option value="">-- Select visibility type --</option>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
            {validationErrors.privateStatus && (
              <div className="errors">{validationErrors.privateStatus}</div>
            )}
          </div>
          <div className="final-step-questions">
            <p className="form-description">
              Please add in image url as the preview image for your group below:
              <br />
              optional if you would like to decide later.
            </p>
            <input
              placeholder="Preview image URL"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="input-box2"
            />
            {validationErrors.imageUrl && (
              <div className="errors">{validationErrors.imageUrl}</div>
            )}
          </div>

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
        <div className="btns-container">
          <button type="submit" className="yes-delete1 cursor">
            Create Group
          </button>
          <button
            type="button"
            className="yes-delete1 no-keep1 cursor"
            onClick={handleResetClick}
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}

export default CreateGroup;
