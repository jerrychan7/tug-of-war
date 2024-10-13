import React, { useState } from 'react';
import { useAuth } from '../context/auth';
import supabase from '../supabaseClient';

/*
  onSelect: function
    (option: string, arg: string) => void
    option:
      'create', arg: roomSize (default 2)
      'join', arg: 'roomId'
      // 'watch', arg: 'roomId'

*/

const UserSelect = ({ onSelect, getHistory }) => {
  const authCtx = useAuth();
  const isLogin = authCtx.user !== null;
  const [gameOption, setGameOption] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [history, setHistory] = useState(null);

  const handleRoomIdChange = (event) => {
    setRoomId(event.target.value);
  };

  const handleJoinRoom = () => {
    onSelect('join', roomId);
  };

  const handleGetHistory = async () => {
    console.log(authCtx.user);
    const { data, error } = await supabase.from('hist')
      .select('*').eq('uid', authCtx.user.id)
      .order('created_at', { ascending: false });
    if (error && error.code !== 'PGRST116') {
      console.error(error);
      alert('Error');
      return;
    }
    setHistory(data || null);
    setGameOption('history');
  };

  return (
    <div className="user-select">
      <h2>请选择操作</h2>
      {!gameOption ? (
        <>
          { isLogin && <button onClick={() => authCtx.logout()}>Logout</button> }
          <button onClick={() => setGameOption('play')}>Play</button>
          <button onClick={() => handleGetHistory()}>History</button>
          {/* <button onClick={() => onSelect('watch')}>旁观战局</button> */}
        </>
      ) : gameOption === 'play' ? (
        <>
          <h3>请选择</h3>
          <button onClick={() => setGameOption(null) }>Back</button>
          {/* 默认创建两人房间 */}
          <button onClick={() => onSelect('create')}>Create a Room</button>
          <button onClick={() => setGameOption('join')}>Join a Room</button>
        </>
      ) : gameOption === 'join' ? (
        <>
          <button onClick={() => setGameOption('play') }>Back</button>
          <label>Room ID: </label>
          <input
            type="text"
            value={roomId}
            onChange={handleRoomIdChange}
          />
          <button onClick={handleJoinRoom}>Join</button>
        </>
      ) : gameOption === 'history' ? (
        <>
          <button onClick={() => setGameOption(null) }>Back</button>
          <h3>History</h3>
          { history === null
            ? <p>Loading...</p>
            : history.length === 0
            ? <p>No History</p>
            : (<ul>{ history.map((item) =>
                <li>
                  { item.is_winner ? <span>WIN</span> : <span>LOSE</span> }
                  <span>Clicked {item.click_count} time{item.click_count ? 's': ''}</span>
                  <span>{item.created_at}</span>
                </li>) }
              </ul>)
            }
        </>
      ) : null}
    </div>
  );
};

export default UserSelect;
