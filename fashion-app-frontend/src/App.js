import React, { useState } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  if (user) {
    return <Dashboard user={user} onLogout={() => setUser(null)} />;
  }

  return <LoginPage onLogin={setUser} />;
}

export default App;