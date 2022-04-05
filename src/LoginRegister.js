import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, getUserModel } from './DataModel';
import { useAuthState } from "react-firebase-hooks/auth";
import logo from './meatfreed-logo.png';
import './styles/style.css';

function LoginRegister() {
  const userModel = getUserModel();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);
  return (
    <div className="main">
      <div className="inputContainer">
        <img src={logo} className="login-logo" alt="meatfreed-login-logo"></img>
        <h5> Login as a Registered User </h5>
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
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div className="alignLeft">
          Don't have an account? 
        </div>
        <a type="btn" className="btn btn-primary" href="https://docs.google.com/spreadsheets/d/12KIdPhdRdj6AIFhH7JTgu9MVobIRxlZh3SjSSBhDF0Y/edit?usp=sharing">Become a Registered User</a>
      </div>
    </div>
  );
}
export default LoginRegister;