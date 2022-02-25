import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, getUserModel } from "./DataModel";
import './styles/style.css';

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const userModel = getUserModel();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    userModel.fetchUserName(user);
    const listenerId = userModel.addListener(() => {
      setName(userModel.userName);
    });
    return(() => {
      userModel.removeListener(listenerId);
    });
  }, [user, loading]);
  return (
    <div className="main">
       <div className="inputContainer">
        Logged in as
         <div>{name}</div>
         <div>{user?.email}</div>
         <button type="button" className="btn btn-primary" onClick={userModel.logout}>
          Logout
         </button>
       </div>
     </div>
  );
}
export default Dashboard;