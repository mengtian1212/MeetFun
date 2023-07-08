import "./DeleteGroupModal.css";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteGroupThunk } from "../../../store/groups";
import { useModal } from "../../../context/Modal";

function DeleteGroupModal({ groupId }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  const handleClickDelete = async (e) => {
    const res = await dispatch(deleteGroupThunk(groupId));
    if (res.message === "Successfully deleted") {
      closeModal();
      return history.push("/groups");
    } else {
      alert(res.message);
    }
  };

  return (
    <section className="delete-modal modal-container">
      <h2 className="delete-title">Confirm Delete</h2>
      <h3 className="delete-text">
        Are you sure you want to remove this group?
      </h3>
      <div className="delete-btn-container">
        <button onClick={closeModal} className="yes-delete  no-keep cursor">
          No (Keep Group)
        </button>

        <button onClick={handleClickDelete} className="yes-delete  cursor">
          Yes (Delete Group)
        </button>
      </div>
    </section>
  );
}

export default DeleteGroupModal;
