import React from "react";
import { useModal } from "../../context/Modal";

function OpenModalMenuItem({
  modalComponent, // component to render inside the modal
  itemText, // text of the menu item that opens the modal
  onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onItemClick) onItemClick();
  };

  // const btnClassName = itemText === "Log In" ? "login" : "signup";
  let btnClassName;
  if (itemText === "Log In") {
    btnClassName = "login";
  } else if (itemText === "Get Started") {
    btnClassName = "start-group";
  } else if (itemText === "Sign Up") {
    btnClassName = "signup";
  } else {
    btnClassName = "";
  }
  return (
    <li onClick={onClick} className={btnClassName}>
      {itemText}
    </li>
  );
}

export default OpenModalMenuItem;
