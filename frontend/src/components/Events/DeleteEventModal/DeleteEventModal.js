import { useDispatch } from "react-redux";
import "./DeleteEventModal.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useModal } from "../../../context/Modal";
import { deleteEventThunk } from "../../../store/events";

function DeleteEventModal({ eventId, groupId }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  const handleClickDelete = async (e) => {
    const res = await dispatch(deleteEventThunk(eventId));
    if (res.message === "Successfully deleted") {
      closeModal();
      return history.push(`/groups/${groupId}`);
    } else {
      alert(res.message);
    }
  };

  return (
    <section className="delete-modal modal-container">
      <h2 className="delete-title">Confirm Delete</h2>
      <h3 className="delete-text">
        Are you sure you want to remove this event?
      </h3>
      <div className="delete-btn-container">
        <button onClick={closeModal} className="yes-delete  no-keep cursor">
          No (Keep Event)
        </button>

        <button onClick={handleClickDelete} className="yes-delete  cursor">
          Yes (Delete Event)
        </button>
      </div>
    </section>
  );
}

export default DeleteEventModal;
