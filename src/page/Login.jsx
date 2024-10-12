import React, { useState } from 'react';
import supabase from '../supabaseClient';

export default function Login() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [username, setUsername] = useState('');
  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handleLoginClick = async () => {
    setIsLoggingIn(true);
    let { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('username', username)
      .single();
    if (error && error.code !== 'PGRST116') {
      console.error(error);
      alert('Error');
      return;
    }
    if (!data) {
      ({ data, error } = await supabase
        .from('user')
        .insert([{ username }])
        .select()
        .single());
      if (error) {
        console.error(error);
        alert('Error');
        return;
      }
    }
    const user = data;
    ({ data, error } = await supabase
      .from('room_user')
      .select('*')
      .eq('uid', user.id)
      .single());
    if (error && error.code !== 'PGRST116') {
      console.error(error);
      alert('Error');
      return;
    }
    setIsLoggingIn(() => false);
  };

  return (
    <div>
      <h1>Tug of War</h1>
      <input value={username} onChange={handleInputChange} placeholder='username' />
      <p>Input a username to join the game.<br />Remember your username for future logins.</p>
      <button onClick={handleLoginClick} disabled={username === '' || isLoggingIn}>Play</button>
    </div>
  );
}
