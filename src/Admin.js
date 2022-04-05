import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, getUserModel } from "./DataModel";
import './styles/style.css';
import Restaurant from './Restaurant';
import { getDataModel } from './DataModel';
import logo from './meatfreed-logo.png';

function Admin() {
  const [user, loading, error] = useAuthState(auth);
  const userModel = getUserModel();
  const navigate = useNavigate();
  const dataModel = getDataModel();
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/");
    userModel.fetchAdmin(user);
    dataModel.fetchData();
    const dataModelListenerId = dataModel.addListener(() => {
      let newRestaurants = Array.from(dataModel.restaurants);
      setRestaurants(newRestaurants);
    });
    return(() => {
      dataModel.removeListener(dataModelListenerId);
    });
  }, [user, loading]);

  const handleDelete = (restaurant) => {
    const text = "Are you sure you want to delete restaurant " + restaurant.name + "?";
    if (window.confirm(text) == true) {
      dataModel.deleteItem(restaurant.key);
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
      <Link to={{pathname: "/details"}}>
        <button type="button" className="btn btn-dark">
          Add Restaurant
        </button>
      </Link>
      <Link to={{pathname: "/account"}}>
        <button type="button" className="btn btn-dark">
          Manage users
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
          {restaurants.map((restaurant, i) => <Restaurant key={i} item={restaurant} onDelete={handleDelete} 
          onClickEvent={() => {
            navigate("/overview", {state: restaurant});
          }}/>)}
        </tbody>
      </table>
    </div>
    : ''}
    </>
  );
  
}
export default Admin;