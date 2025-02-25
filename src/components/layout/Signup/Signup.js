import React, { useState } from "react";

const Signup = () => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
  
    const handleSignup = () => {
      // Add your signup logic here
      // For simplicity, you might want to send the newUsername and newPassword to a backend server for storage
      alert('Signup successful!');
    };
  return (
    <>
      <div className="App">
      <h1>Signup Page</h1>
      <label>
        New Username:
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
      </label>
      <br />
      <label>
        New Password:
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleSignup}>Signup</button>
    </div>
    </>
  );
};

export default Signup;