
import './App.css';
import React, { useState } from 'react';
import Login from './page/Login';
import UserSelect from './component/UserSelect';
import { useAuth } from './context/auth';

function App() {
  const authCtx = useAuth();
  const isLogin = authCtx.user !== null;
  const [selection, setSelection] = useState(null);

  const handleSelect = (option, arg = '') => {
    setSelection(option);
    // 根据选择的操作执行相应的逻辑
    console.log(`用户选择了: ${option} (${arg})`);
  };


  return (
    <div className="App">{ !isLogin
      ? <Login />
      : !selection ? (
          <UserSelect onSelect={handleSelect} />
        ) : (
          <div>
            <h2>你选择了: {selection}</h2>
            {/* 根据选择的操作渲染不同的组件或页面 */}
          </div>
        )
    }
    </div>
  );
}

export default App;
