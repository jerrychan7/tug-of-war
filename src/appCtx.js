import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(-1);
  const [roomSize, setRoomSize] = useState(2);
  const [playerId, setPlayerId] = useState(-1);
  const [leftCount, setLeftCount] = useState(0);
  const [rightCount, setRightCount] = useState(0);

  return (
    <AppContext.Provider value={{
      roomId, setRoomId,
      roomSize, setRoomSize,
      playerId, setPlayerId,
      leftCount, setLeftCount,
      rightCount, setRightCount,
    }}>
      {children}
    </AppContext.Provider>
  );
};
