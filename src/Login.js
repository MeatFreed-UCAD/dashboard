import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, getUserModel } from './DataModel';
import { useAuthState } from "react-firebase-hooks/auth";
import './styles/style.css';

function Login() {
  const userModel = getUserModel();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);
  return (
    <div className="main">
      <div className="inputContainer">
        <img src="./meatfreed-logo.png" className="login-logo" alt="meatfreed-login-logo"></img>
        <h5> WELCOME TO YOUR MEATFREED DASHBOARD</h5>
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
        <button
          type="button" className="btn btn-primary"
          onClick={() => userModel.logInWithEmailAndPassword(email, password)}
        >
          Login
        </button>
        <button type="button" className="btn btn-dark" onClick={userModel.signInWithGoogle}>
          Login with Google
        </button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          New user? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Login;