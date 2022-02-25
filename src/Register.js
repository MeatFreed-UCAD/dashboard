import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, getUserModel } from "./DataModel";
import './styles/style.css';

function Register() {
  const userModel = getUserModel();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);
  return (
    <div className="main">
      <div className="inputContainer">
        <input
          type="text"
          className="inputBox"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
        />
        <input
          type="text"
          className="inputBox"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />
        <input
          type="text"
          className="inputBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="inputBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="button" className="btn btn-primary" onClick={() => {
            if (!firstName) alert("Please enter your first name");
            if (!lastName) alert("Please enter your last name");
            userModel.registerWithEmailAndPassword(`${firstName} ${lastName}`, email, password);
          }
        }>
          Register
        </button>
        <button
          type="button" className="btn btn-dark"
          onClick={userModel.signInWithGoogle}
        >
          Register with Google
        </button>
        <div>
          Existing user? <Link to="/">Login</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Register;