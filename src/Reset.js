import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, getUserModel } from "./DataModel";
import './styles/style.css';

function Reset() {
const userModel = getUserModel();
  const [email, setEmail] = useState("");
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <button
          type="button" className="btn btn-primary"
          onClick={() => userModel.sendPasswordReset(email)}
        >
          Send password reset email
        </button>
        {/* <Link type="button" className="btn btn-dark" to="/loginRegister">Back</Link> */}
        <button type="button" className="btn btn-dark" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
}
export default Reset;