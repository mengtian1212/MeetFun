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
    <section>
      <h2>Are you sure you want to delete this group?</h2>
      <button onClick={handleClickDelete}>Yes! Delete it</button>
      <button onClick={closeModal}>Cancel</button>
    </section>
  );
}

export default DeleteGroupModal;
