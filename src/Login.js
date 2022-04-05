import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, getUserModel } from './DataModel';
import { useAuthState } from "react-firebase-hooks/auth";
import logo from './meatfreed-logo.png';
import './styles/style.css';

function Login() {
  // const userModel = getUserModel();
  // const [user, loading, error] = useAuthState(auth);
  const [adminLoading, setAdminLoading] = useState(false);
  // const [adminStatus, setAdminStatus] = useState(0);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (loading) {
  //     return;
  //   }
  //   if (user) {
  //     userModel.fetchAdmin(user);
  //     setAdminLoading(true);
  //     if(adminStatus === 1) navigate("/admin");
  //     if(adminStatus === 2) navigate("/dashboard");
  //   }
  //   const listenerId = userModel.addListener(() => {
  //     console.log(userModel.isAdmin);
  //     if (userModel.isAdmin){
  //       setAdminStatus(1);
  //     } else {
  //       setAdminStatus(2);
  //     }
  //   });
  //   return (() => {
  //     userModel.removeListener(listenerId);
  //   });
  // }, [user, loading, adminStatus]);
  return (
    <div className="main">
      {adminLoading? <div>Loading</div>:
      <div className="inputContainer">
        <img src={logo} className="login-logo" alt="meatfreed-login-logo"></img>
        <h5> WELCOME TO YOUR MEATFREED DASHBOARD</h5>
        <Link type="btn" className="btn btn-light marginBottom"
          to="/loginRegister"
        >
          Login as a Registered User
        </Link>
        <Link type="btn" className="btn btn-light marginBottom"
         to="/loginAdmin"
        >
          Login as an Admin
        </Link>
        <div className="alignLeft">
          Don't have an account? 
        </div>
        <a type="btn" className="btn btn-primary" href="https://docs.google.com/spreadsheets/d/12KIdPhdRdj6AIFhH7JTgu9MVobIRxlZh3SjSSBhDF0Y/edit?usp=sharing">Become a Registered User</a>
      </div>
    }
    </div>
  );
}
export default Login;