import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, getUserModel } from "./DataModel";
import './styles/style.css';
import Offer from './Offer';
import Campaigns from './Campaigns';
import { getDataModel } from './DataModel';
import logo from './meatfreed-logo.png';

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const userModel = getUserModel();
  const navigate = useNavigate();
  const dataModel = getDataModel();
  const [offers, setOffers] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantClicks, setRestaurantClicks] = useState("");
  const [numOffers, setNumOffers] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    console.log(user.email);
    dataModel.fetchRestaurantInfo(user);
    dataModel.fetchOfferData(user);
    dataModel.fetchRestaurantClicks(user);
    dataModel.fetchOfferClicks(user);
    const listenerId = userModel.addListener(() => {
      setName(userModel.userName);
    });
    const dataModelListenerId = dataModel.addListener(() => {
      setRestaurantName(dataModel.name);
      setRestaurantClicks(dataModel.numClicks);
      setNumOffers(dataModel.numOffers);
      let newOffers = Array.from(dataModel.offers);
      setOffers(newOffers);
    });
    return (() => {
      userModel.removeListener(listenerId);
      dataModel.removeListener(dataModelListenerId);
    });
  }, [user, loading]);
  return (
    <>
      <div className="nav">
        <img src={logo} alt="Logo" className="logo" />
        <ul className="nav-items">
          <li>
            <button
              className="btn menu-item-btn"
              onClick={() => navigate("/dashboard")}
            >
              HOME
            </button>
          </li>
          <li>
            <button
              className="btn menu-item-btn"
              onClick={() => navigate("/dashboardCharts")}
            >
              OFFERS
            </button>
          </li>
          <li>
            <button
              className="btn menu-item-btn"
              onClick={() => navigate("/campaigns")}
            >
              CAMPAIGNS
            </button>
          </li>
          <li>
            <button type="button" className="btn btn-light" onClick={dataModel.logout}>
              Logout
            </button>
          </li>
        </ul>
      </div>

      <div className="content">
        <h1>{restaurantName}</h1>
        <ul className="stats-items">
          <li>
            <span className="stats-number">{numOffers}</span>
            <span className="stats-text">OFFERS ACTIVE</span>
          </li>
          <li>
            <span className="stats-number">0</span>
            <span className="stats-text">OFFERS EXPIRED</span>
          </li>
          <li>
            <span className="stats-number">{restaurantClicks}</span>
            <span className="stats-text">TOTAL CLICKS</span>
          </li>
          {/* <li>
          <span className="stats-number">99,999k</span>
          <span className="stats-text">UNIQUE USERS</span>
        </li> */}
        </ul>

        <table>
          <thead>
            <tr className="table-header">
              <th>Offer Description</th>
              <th>Expiration Date</th>
              <th>Offer Clicks</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer, i) => <Offer key={i} description={offer.description} expDate={offer.when} numClicks={offer.clicksCount} />)}
          </tbody>
        </table>

        
      </div>

    </>
  );

}
export default Dashboard;