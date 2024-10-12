import React, { useState } from 'react';

/*
  onSelect: function
    (option: string, arg: string) => void
    option:
      'create', arg: roomSize (default 2)
      'join', arg: 'roomId'
      // 'watch', arg: 'roomId'

*/

const UserSelect = ({ onSelect, getHistory }) => {
  const [gameOption, setGameOption] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [history, setHistory] = useState(null);

  const handleRoomIdChange = (event) => {
    setRoomId(event.target.value);
  };

  const handleJoinRoom = () => {
    onSelect('join', roomId);
  };

  const handleGetHistory = () => {
    getHistory().then((data) => {
      setHistory(data);
    });
  };

  return (
    <div className="user-select">
      <h2>请选择操作</h2>
      {!gameOption ? (
        <>
          <button onClick={() => setGameOption('play')}>进行游戏</button>
          <button onClick={() => handleGetHistory()}>查看历史</button>
          {/* <button onClick={() => onSelect('watch')}>旁观战局</button> */}
        </>
      ) : gameOption === 'play' ? (
        <>
          <h3>请选择</h3>
          <button onClick={() => setGameOption(null) }>返回</button>
          {/* 默认创建两人房间 */}
          <button onClick={() => onSelect('create')}>创建房间</button>
          <button onClick={() => setGameOption('join')}>加入房间</button>
        </>
      ) : gameOption === 'join' ? (
        <>
          <button onClick={() => setGameOption('play') }>返回</button>
          <label>输入房间ID：</label>
          <input
            type="text"
            value={roomId}
            onChange={handleRoomIdChange}
          />
          <button onClick={handleJoinRoom}>加入</button>
        </>
      ) : gameOption === 'history' ? (
        <>
          <button onClick={() => setGameOption(null) }>返回</button>
          <h3>查看历史</h3>
          { history
            ? (<ul>
                { history.map((item) => <li>
                  输赢：{item.isWinner}
                  点击次数：{item.clickCounts}
                  时间：{item.createdAt}
                </li>) }
              </ul>)
            : (<p>获取中</p>)
          }
        </>
      ) : null}
    </div>
  );
};

export default UserSelect;
