import { useState } from "react";
import { loginUser } from "../services/authService";
import React from "react";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    const data = await loginUser({
      email,
      password
    });

    localStorage.setItem("token", data.token);
  };

  return (
    <div className="flex flex-col gap-3">

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>

    </div>
  );
};

export default Login;