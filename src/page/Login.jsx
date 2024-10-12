import React, { useState } from 'react';

// function 

export default function Login() {
  const [username, setUsername] = useState('');
  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };
  
  const handleLoginClick = () => {
    console.log('Login button clicked with username:', username);
    // 在这里添加登录逻辑
  };

  return (
    <div>
      <h1>Login</h1>
      <label>Username: </label>
      <input value={username} onChange={handleInputChange}></input>
      <button onClick={handleLoginClick}>Login</button>
    </div>
  );
}
