import { useState } from "react";
const LoginForm = ({ handleSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = (event) => {
    event.preventDefault();
    handleSubmit(username, password);
  };
  return (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <div>
        <label>
          username:
          <input
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            type="text"
          ></input>
        </label>
      </div>

      <div>
        <label>
          password:
          <input
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            type="text"
          ></input>
        </label>
      </div>

      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
