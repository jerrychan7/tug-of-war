import React, { useReducer, createContext, useContext } from 'react';

const initialState = {
  room: null,
  user_room: null,
};

export const GameContext = createContext({
  room: null,
  user_room: null,
  setRoom: (room) => {},
  setUserRoomInfo: (user_room) => {},
});

const gameReducer = (state, { type, ...payload }) => {
  switch (type) {
  case 'SET':
    return { ...state, ...payload };
  default:
    return state;
  }
};

export const GameCtxProvider = (props) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setRoom = (room) => {
    dispatch({ type: 'SET', room });
  };

  const setUserRoomInfo = (user_room) => {
    dispatch({ type: 'SET', user_room });
  };

  return (
    <GameContext.Provider
      value={{ room: state.room, user_room: state.user_room, setRoom, setUserRoomInfo }}
      {...props}
    />
  );
};

export const useGameCtx = () => useContext(GameContext);
