import { useHistory, useParams } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import ReactModal from 'react-modal';

import { useRoom } from '../hooks/useRoom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { RoomCode } from '../components/RoomCode';
import { Button } from '../components/Button';
import { Question } from '../components/Question';

import '../styles/room.scss';

import { database } from '../services/firebase';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    });

    history.push('/');
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  async function handleDeleteQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
  }

  function handleClickOnLogo() {
    history.push('/');
  }

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  function handleModalAnswerDelete(event: FormEvent, questionId: string, confirm: boolean) {
    event.preventDefault();
    if (confirm)
      handleDeleteQuestion(questionId);
    closeModal();
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img
            src={logoImg}
            alt="Logo Letmeask"
            onClick={handleClickOnLogo}
          />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {
            questions.length > 0 &&
            <span>{questions.length} pergunta{questions.length !== 1 ? 's' : null}</span>
          }
        </div>

        <div className="questions-list">
          {questions.map(q => {
            return (
              <Question
                key={q.id}
                author={q.author}
                content={q.content}
                isAnswered={q.isAnswered}
                isHighlighted={q.isHighlighted}
              >
                {!q.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(q.id)}
                    >
                      <img src={answerImg} alt="Answer question" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(q.id)}
                    >
                      <img src={checkImg} alt="Highlight question" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={openModal}
                >
                  <img src={deleteImg} alt="Remove question" />
                </button>
                <ReactModal
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  ariaHideApp={false}
                  className="modal"
                  overlayClassName="overlay"
                >
                  <header>
                    <h2>Deseja realmente excluir essa pergunta?</h2>
                  </header>

                  <form>
                    <Button
                      onClick={(e) => handleModalAnswerDelete(e, q.id, false)}
                      isOutlined
                    >
                      Cancelar
                    </Button>

                    <Button
                      onClick={(e) => handleModalAnswerDelete(e, q.id, true)}
                    >
                      Excluir
                    </Button>


                  </form>
                </ReactModal>

              </Question>
            );
          })}
        </div>

      </main>

    </div>
  );
}