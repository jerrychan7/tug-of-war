import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../appCtx';

const Game = () => {
  const { roomId, roomSize, playerId, leftCount, rightCount } = useContext(AppContext);
  const [selectedSide, setSelectedSide] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (waiting) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      if (countdown === 0) {
        clearInterval(interval);
        // 开始比赛逻辑
        console.log('比赛开始');
      }

      return () => clearInterval(interval);
    }
  }, [waiting, countdown]);

  const handleSideSelect = (side) => {
    setSelectedSide(side);
    setWaiting(true);
    // 发送选择请求到服务器
    console.log(`玩家 ${playerId} 选择加入 ${side}`);
  };

  return (
    <div className="game">
      <h1>房间ID: {roomId}</h1>
      <div className="team-info">
        <div className="team">
          <h2>左边队伍</h2>
          <p>总人数: {leftCount}</p>
          <p>已选人数: {selectedSide === 'left' ? leftCount + 1 : leftCount}</p>
          <button onClick={() => handleSideSelect('left')} disabled={selectedSide !== null}>加入左边</button>
        </div>
        <div className="team">
          <h2>右边队伍</h2>
          <p>总人数: {rightCount}</p>
          <p>已选人数: {selectedSide === 'right' ? rightCount + 1 : rightCount}</p>
          <button onClick={() => handleSideSelect('right')} disabled={selectedSide !== null}>加入右边</button>
        </div>
      </div>
      {waiting && (
        <div className="countdown">
          <h2>等待其他玩家加入...</h2>
          <p>比赛将在 {countdown} 秒后开始</p>
        </div>
      )}
    </div>
  );
};

export default Game;
