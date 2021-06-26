import { useHistory, useParams } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import { RoomCode } from '../components/RoomCode';
import { Button } from '../components/Button';
import { Question } from '../components/Question';

import '../styles/room.scss';

import { database } from '../services/firebase';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
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

  async function handleDeleteQuestion(questionId: string) {
    const remove = window.confirm('Excluir pergunta?');
    if (remove) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  function handleClickOnLogo() {
    history.push('/');
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
          {questions.map(q =>
            <Question key={q.id} author={q.author} content={q.content}>
              <button
                type="button"
                onClick={() => handleDeleteQuestion(q.id)}
              >
                <img src={deleteImg} alt="Remove question" />
              </button>
            </Question>
          )}
        </div>

      </main>

    </div>
  );
}