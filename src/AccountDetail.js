import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserModel } from "./DataModel";
import './styles/style.css';

function AccountDetail() {
  const location = useLocation();
  const item = location.state ? location.state.item : null;
  const editMode = (item != null);
  const userModel = getUserModel();
  const [email, setEmail] = useState(item ? item.email : '');
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(item ? item.name.split(' ')[0] : '');
  const [lastName, setLastName] = useState(item ? item.name.split(' ')[1] : '');
  const navigate = useNavigate();

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
        {
          item?' ':
        <input
          type="password"
          className="inputBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />}
          <button
            className="btn btn-dark"
            type="button"
            onClick={() => {navigate(-1);}}
          >
            Cancel
          </button>
        <button type="button" className="btn btn-primary" onClick={() => {
            if (!firstName) alert("Please enter the user's first name");
            if (!lastName) alert("Please enter the user's last name");
            userModel.registerWithEmailAndPassword(`${firstName} ${lastName}`, email, password);
            navigate('account');
          }
        }>
         {editMode ? "Save" : "Add User"}
        </button>
      </div>
    </div>
  );
}
export default AccountDetail;