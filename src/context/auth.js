import React, { useReducer, createContext, useContext } from 'react';

const initialState = {
  user: (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null,
};

export const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

const authReducer = (state, action) => {
  switch (action.type) {
  case 'LOGIN':
    return { ...state, user: action.payload, };
  case 'LOGOUT':
    return { ...state, user: null, };
  default:
    return state;
  }
};

export const AuthProvider = (props) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    dispatch({
      type: 'LOGIN',
      payload: userData,
    });
  }

  function logout() {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
};

export const useAuth = () => useContext(AuthContext);
