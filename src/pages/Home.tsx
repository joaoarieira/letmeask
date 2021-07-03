import { useHistory } from 'react-router-dom';
import { FormEvent, useState, useRef } from 'react';

import { useAuth } from '../hooks/useAuth';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon-colored.svg';

import '../styles/auth.scss';

import { Button } from '../components/Button';
import { database } from '../services/firebase';

export function Home() {
  const [roomCode, setRoomCode] = useState('');

  const history = useHistory();

  const { user, signInWithGoogle } = useAuth();

  const inputRef = useRef<HTMLInputElement>(null);

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '')
      return;

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      const { current } = inputRef;
      if (current !== null) {
        current.classList.add('shaked');
        setTimeout(() => current.classList.remove('shaked'), 1000);
      }
      setRoomCode('');
      return;
    }

    if (roomRef.val().closedAt) {
      const { current } = inputRef;
      if (current !== null) {
        current.classList.add('shaked');
        setTimeout(() => current.classList.remove('shaked'), 1000);
      }
      setRoomCode('');
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração representando perguntas e repostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>

          <div className="separator">ou entre em uma sala</div>

          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
              ref={inputRef}
            />

            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}