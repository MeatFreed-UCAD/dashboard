import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, getUserModel } from './DataModel';
import { useAuthState } from "react-firebase-hooks/auth";
import logo from './meatfreed-logo.png';
import './styles/style.css';

function LoginAdmin() {
  const userModel = getUserModel();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }
    if(user) {
      userModel.fetchAdmin(user);
    }
    const listenerId = userModel.addListener(() => {
      setIsAdmin(userModel.isAdmin);
    });
    if (user && isAdmin) {
      navigate("/admin");
    }
    return(() => {
      userModel.removeListener(listenerId);
    });
  }, [user, loading, isAdmin]);

  return (
    <div className="main">
      {pageLoading? <div>Loading</div>:
      <div className="inputContainer">
        <img src={logo} className="login-logo" alt="meatfreed-login-logo"></img>
        <h5> Login as an Admin</h5>
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
          onClick={() => {
            setPageLoading(true);
            userModel.logInWithEmailAndPassword(email, password);
          }}>
          Login
        </button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
      </div>
    }
    </div>
  );
}
export default LoginAdmin;