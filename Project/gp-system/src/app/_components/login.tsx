"use client";
import Link from "next/link";
import { useState } from "react";
import "~/styles/temp.css"

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Login with", username, password);
    // will put login logic here
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-form">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
       <button type="submit" className="login-button"><Link href="/upcoming">Login</Link></button>

      </form>
      <div className="register-link">
        Don't have an account? <Link href="/register">Register here</Link>
      </div>
    </div>
  );
}

export { Login }