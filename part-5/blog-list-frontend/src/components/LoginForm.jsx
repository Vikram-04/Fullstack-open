import { Button, TextField } from "@mui/material";
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
        <TextField
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
          type="text"
          variant="standard"
          label="Username"
        ></TextField>
      </div>

      <div>
        <TextField
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          type="text"
          label="Password"
          variant="standard"
        ></TextField>
      </div>

      <Button type="submit" variant="contained" style={{ marginTop: 15 }}>
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
