import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import { getAdminModel } from './DataModel';
import './styles/style.css';

function UserOverview() {
    const location = useLocation();
    const adminModel = getAdminModel();
    const item = location.state ? location.state : null;
    const navigate = useNavigate();

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
      <div>
        <h2>{item.name}</h2>
        Email: {item.email}
        Referrals count: {item.referralsCount}
        <Link to="/accountDetail" state={{item: item}}>
            <button type="button" className="btn btn-dark">
            Edit
            </button>
        </Link>
        <button type="button" className="btn btn-dark" onClick={() => handleDelete(item)}>
          Delete
        </button>
        <button type="button" className="btn btn-dark" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    )
}
export default UserOverview;