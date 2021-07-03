import React from "react";
import ReactModal from "react-modal";

import '../styles/confirm-modal.scss';

type confirmModalProps = {
  modalIsOpen: boolean;
  closeModal: any;
  children?: React.ReactNode;
}

export function ConfirmModal({
  modalIsOpen,
  closeModal,
  children
}: confirmModalProps) {
  return (
    <ReactModal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      className="modal"
      overlayClassName="overlay"
    >
      {children}
    </ReactModal>
  );
}