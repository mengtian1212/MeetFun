import "./CreateEvent.css";
import { useState, useEffect } from "react";
import { useHistory, NavLink, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  capitalizeFirstChar,
  formatDateTime,
} from "../../../utils/helper-functions";
import { fetchSingleGroupThunk } from "../../../store/groups";
import { createEventThunk, addEventImagesThunk } from "../../../store/events";

function CreateEvent() {
  const history = useHistory();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const { groupId } = useParams();
  const group = useSelector((state) => state.groups?.singleGroup);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [privateStatus, setPrivateStatus] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // another dispatch for add event image
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const [validationErrors, setValidationErrors] = useState({});
  const [hasStartDate, setHasStartDate] = useState(false);
  const handleOnChangeStart = (e) => {
    setHasStartDate(e.target.value !== "");
    setStartDate(e.target.value);
  };

  const [hasEndDate, setHasEndDate] = useState(false);
  const handleOnChangeEnd = (e) => {
    setHasEndDate(e.target.value !== "");
    setEndDate(e.target.value);
  };

  const resetForm = () => {
    setName("");
    setType("");
    setPrivateStatus("");
    setPrice("");
    setStartDate("");
    setStartDate(false);
    setEndDate("");
    setHasEndDate(false);
    setImageUrl("");
    setDescription("");
    // setPreviewStatus("");
    setValidationErrors({});
    return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    const err = {};
    if (name.trim().length === 0) {
      err.name = "Name is required";
    }
    if (!type) {
      err.type = "Event type is required";
    }
    if (privateStatus.length === 0) {
      err.privateStatus = "Visibility is required";
    }
    if (price === "") {
      err.price = "Price is required";
    }
    if (!startDate) {
      err.startDate = "Event start date is required";
    }
    if (!endDate) {
      err.endDate = "Event end date is required";
    }
    if (
      imageUrl.trim().length > 0 &&
      !imageUrl.trim().endsWith(".png") &&
      !imageUrl.trim().endsWith(".jpg") &&
      !imageUrl.trim().endsWith(".jpeg") &&
      !imageUrl.trim().endsWith(".webp")
    ) {
      err.imageUrl = "Image URL must end in .png .jpg or .jpeg";
    }
    if (description.trim().length < 30)
      err.description = "Description must be at least 30 characters long";
    if (Object.values(err).length) {
      setValidationErrors(err);
      return;
    }

    const imageData = imageUrl.trim().length
      ? [{ url: imageUrl, preview: true }]
      : [];

    const formData = {
      name: capitalizeFirstChar(name),
      type,
      private: privateStatus === "private" ? true : false,
      price: Number(price),
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      description: description.trim(),
      capacity: 20,
      venueId: group.Venues[0]?.id, /// check here: group.Venues[0] might no exist!
    };

    console.log("GROUP", group);
    console.log("formdata", formData);
    console.log("imageData:", imageData);
    console.log("sessionUser:", sessionUser);

    // data preparation done, now dispatch thunks
    dispatch(createEventThunk(formData, group))
      .then(async (newEvent) => {
        await dispatch(addEventImagesThunk(imageData, newEvent.id));
        history.push(`/events/${newEvent.id}`);
      })
      .catch(async (err) => {
        const errors = await err.json();
        console.log(errors);
        setValidationErrors(errors.errors);
      });
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    resetForm();
    setValidationErrors({});
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    dispatch(fetchSingleGroupThunk(Number(groupId)));
  }, [dispatch, groupId]);

  if (!sessionUser) {
    setTimeout(() => history.push(`/`), 3000);
    window.scroll(0, 0);
    return (
      <div className="need-log-in">
        <h2 className="">Please log in to create a event</h2>
        <h2>Redirect to home page...</h2>
      </div>
    );
  }

  if (
    group &&
    Object.keys(group).length &&
    group?.organizerId !== sessionUser.id
  ) {
    setTimeout(() => history.push(`/groups/${group?.id}`), 3000);
    window.scroll(0, 0);
    return (
      <div className="need-log-in">
        <h2 className="">Unauthorized to create events for this group</h2>
        <h2>Redirect to the group...</h2>
      </div>
    );
  }

  return (
    group &&
    Object.keys(group).length &&
    group?.organizerId === sessionUser.id && (
      <form onSubmit={handleSubmit} className="group-form-container">
        <div className="main-container">
          <NavLink
            exact
            to={`/groups/${group.id}`}
            className="back-to-groups-container"
          >
            <i className={`fa-solid fa-chevron-left arrow`}></i>{" "}
            <span className="event-or-group selected">Back to my group</span>
          </NavLink>

          <div className="title-container">
            <h3 className="biggest">Create an event for {group?.name}</h3>
            <p className="form-description">What is the name of your event?</p>
            <input
              placeholder="Event Name"
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
            <div className="final-step-questions">
              <p className="form-description">
                Is this an in person or online event?
              </p>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={type === "" ? "first-option" : ""}
              >
                <option value="">-- Select event type --</option>
                <option value="In person">In person</option>
                <option value="Online">Online</option>
              </select>
              {validationErrors.type && (
                <div className="errors">{validationErrors.type}</div>
              )}
            </div>
            <div className="final-step-questions">
              <p className="form-description">
                Is this event private or public?
              </p>
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
                What is the price for your event?
              </p>
              <div className="price-container">
                <input
                  placeholder="0"
                  type="number"
                  min="0"
                  max="10000"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="price"
                />
              </div>
              {validationErrors.price && (
                <div className="errors">{validationErrors.price}</div>
              )}
            </div>
          </div>
          <div className="title-container">
            <div className="final-step-questions">
              <p className="form-description">When does your event start?</p>
              <input
                type="datetime-local"
                value={startDate}
                // min={new Date().toISOString()}
                max="2025-12-31T23:59"
                onChange={handleOnChangeStart}
                className={
                  hasStartDate ? "datetime-input has-value" : "datetime-input"
                }
              />

              {validationErrors.startDate && (
                <div className="errors">{validationErrors.startDate}</div>
              )}
            </div>
            <div className="final-step-questions">
              <p className="form-description">When does your event end?</p>
              <input
                type="datetime-local"
                value={endDate}
                // min={startDate}
                max="2025-12-31T23:59"
                onChange={handleOnChangeEnd}
                className={
                  hasEndDate ? "datetime-input has-value" : "datetime-input"
                }
              />
              {validationErrors.endDate && (
                <div className="errors">{validationErrors.endDate}</div>
              )}
            </div>
          </div>
          <div className="title-container">
            <p className="form-description">
              Please add in image url as the preview image for your event below:
              <br />
              optional if you would like to decide later.
            </p>
            <input
              placeholder="Image URL"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="input-box2"
            />
            {validationErrors.imageUrl && (
              <div className="errors">{validationErrors.imageUrl}</div>
            )}
          </div>
          <div className="title-container">
            <p className="form-description">Please describe your event:</p>
            <textarea
              placeholder="Please include at least 30 characters"
              type="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea2"
            />
            {validationErrors.description && (
              <div className="errors">{validationErrors.description}</div>
            )}
          </div>
          <div className="btns-container">
            <button type="submit" className="yes-delete1 cursor">
              Create Event
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
    )
  );
}

export default CreateEvent;
