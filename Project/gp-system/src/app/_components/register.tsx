"use client"
import React, { useState } from 'react';
import Link from "next/link";
import "~/styles/temp.css"
import { api } from "~/trpc/react"

const Register: React.FC = () => {
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const register = api.user.registerUser.useMutation();

  const handleRegistration = (event: React.FormEvent) => {
    event.preventDefault();
    register.mutate({ title, fname: firstName, lname: surname, email, password })
    // Validation and registration logic here
  };

  return (
    <div className="container">
      <div className="register-page">
        <h2>Register</h2>
        <form onSubmit={handleRegistration} className="register-form">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label htmlFor="first-name">First Name:</label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <label htmlFor="surname">Surname:</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Create Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="confirm-password">Enter Password Again:</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="register-button">Register</button>
        </form>
        <div className="login-link">
          Already have an account? <Link href="/login">Login here</Link>
        </div>
      </div>
    </div>

      
  );
};

export { Register };
