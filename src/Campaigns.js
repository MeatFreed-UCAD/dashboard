import logo from './meatfreed-logo.png';
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useEffect, useState } from "react";
import { getDataModel } from './DataModel';
import { auth, getUserModel } from "./DataModel";
import { useNavigate } from "react-router-dom";
import './styles/style.css';


function Campaigns() {
    const [restaurantName, setRestaurantName] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    const dataModel = getDataModel();
    const userModel = getUserModel();
    const [name, setName] = useState("");

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        dataModel.fetchRestaurantInfo(user);
        const listenerId = userModel.addListener(() => {
          setName(userModel.userName);
        });
        const dataModelListenerId = dataModel.addListener(() => {
          setRestaurantName(dataModel.name);
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

                

                <div className="campaign-content">
                    <h1>{restaurantName}</h1>
                    <ul className="stats-items">
                        <li>
                            <span className="stats-number">3</span>
                            <span className="stats-text">CAMPAIGNS ACTIVE</span>
                        </li>
                        <li>
                            <span className="stats-number">0</span>
                            <span className="stats-text">CAMAPAIGNS EXPIRED</span>
                        </li>
                        <li>
                            <span className="stats-number">66</span>
                            <span className="stats-text">TOTAL CLICKS</span>
                        </li>
                    </ul>

                    <div className="campaign-list-columns">
                        <table>
                            <thead>
                                <tr className="campaign-table-header">
                                <th>Campaign Description</th>
                                <th>Expiration Date</th>
                                <th>Campaign Clicks</th>
                                </tr>
                            </thead>
                        </table>

                        <table>
                            <thead>
                                <tr className="campaign-table">
                                <th>GoVegan Campaign</th>
                                <th>06/02/22</th>
                                <th>32</th>
                                <button type="button" className="campaign-button" onClick={() => navigate("/individualCampaigns")}>View</button>
                                </tr>
                            </thead>
                        </table>

                        <table>
                            <thead>
                                <tr className="campaign-table">
                                <th>MeatLess Campaign</th>
                                <th>06/017/22</th>
                                <th>22</th>
                                <button type="button" className="campaign-button" onClick={() => navigate("/individualCampaigns")}>View</button>
                                </tr>
                            </thead>
                        </table>

                        <table>
                            <thead>
                                <tr className="campaign-table">
                                <th>VeganDay Campaign</th>
                                <th>06/28/22</th>
                                <th>12</th>
                                <button type="button" className="campaign-button" onClick={() => navigate("/individualCampaigns")}>View</button>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
            
        </>

    )
}

export default Campaigns;