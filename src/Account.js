import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, getUserModel } from "./DataModel";
import './styles/style.css';
import Restaurant from './Restaurant';
import { getAdminModel, getDataModel } from './DataModel';
import logo from './meatfreed-logo.png';

function Account() {
  const [user, loading, error] = useAuthState(auth);
  const userModel = getUserModel();
  const navigate = useNavigate();
  const adminModel = getAdminModel();
  const dataModel = getDataModel();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/");
    userModel.fetchAdmin(user);
    adminModel.fetchUsers();
    const adminModelListenerId = adminModel.addListener(() => {
      let newUsers = Array.from(adminModel.users);
      setUsers(newUsers);
    });
    return(() => {
      adminModel.removeListener(adminModelListenerId);
    });
  }, [user, loading]);

  const handleDelete = (user) => {
    const text = "Are you sure you want to delete user " + user.name + "?";
    if (window.confirm(text) == true) {
      adminModel.deleteItem(user.key);
      alert("Deleted!");
    }else{
      alert("You canceled!");
    }
  };

  return (
    <>
    <div className="nav">
      <img src={logo} alt="Logo" className="logo"/>
      <ul className="nav-items">
        <li>
          <button type="button" className="btn btn-light" onClick={dataModel.logout}>
            Logout
          </button>
        </li>
      </ul>
    </div>

    {userModel.isAdmin ?
    <div className="content">
      <h1>Welcome Admin</h1>
      <Link to={{pathname: "/admin"}}>
        <button type="button" className="btn btn-dark">
          Manage restaurants
        </button>
      </Link>
      <Link to={{pathname: "/accountDetail"}}>
        <button type="button" className="btn btn-dark">
          Add user
        </button>
      </Link>
      
      <table>
        {/* <thead>
          <tr className="table-header">
            <th>Offer Description</th>
            <th>Expiration Date</th>
            <th>Offer Clicks</th>
          </tr>
        </thead> */}
        <tbody>
          {users.map((user, i) => <Restaurant key={i} item={user} onDelete={handleDelete} 
          onClickEvent={() => {
            navigate("/userOverview", {state: user});
          }}
          />)}
        </tbody>
      </table>
    </div>
    : ''}
    </>
  );
  
}
export default Account;