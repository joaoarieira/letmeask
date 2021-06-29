import React, { useState } from "react";
import ReactModal from "react-modal";

import '../styles/confirm-modal.scss';

type ConfirmModalProps = {
  isOpen: boolean,
  question: string;
  positiveAnswer?: string;
  negativeAnswer?: string;

}

export function ConfirmModal({
  isOpen,
  question,
  positiveAnswer = "Confirmar",
  negativeAnswer = "Cancelar",
  ...otherProps
}: ConfirmModalProps) {
  return (
    <ReactModal
      isOpen={isOpen}
    >
      <h2>{question}</h2>
      <form>
        <button onClick={(e) => e.preventDefault}>{positiveAnswer}</button>
        <button onClick={(e) => e.preventDefault}>{negativeAnswer}</button>
      </form>
    </ReactModal>
  );
}