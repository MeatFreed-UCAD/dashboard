import logo from './meatfreed-logo.png';
import Offer from './Offer';
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getUserModel } from "./DataModel";
import { getDataModel } from './DataModel';
import { useNavigate } from "react-router-dom";
import './styles/style.css';



function IndividualCampaigns() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const userModel = getUserModel();
    const navigate = useNavigate();
    const dataModel = getDataModel();
    const [offers, setOffers] = useState([]);
    const [numOffers, setNumOffers] = useState("");

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        dataModel.fetchOfferData(user);
        dataModel.fetchOfferClicks(user);
        const listenerId = userModel.addListener(() => {
          setName(userModel.userName);
        });
        const dataModelListenerId = dataModel.addListener(() => {
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

                <button type="button" className="individual-campaign-back-button" onClick={() => navigate("/campaigns")}>Back</button>
                <div className="campaign-content">
                    <h1>Campaign Name</h1>
                    <h3>05/02/22 - 06/01/22</h3>
                    <div className="campaign-content-items">
                        <div className="campaign-offers">
                            <h3>Offers in this Campaign</h3>
                            <table>
                                <thead>
                                    <tr className="campaign-offer-header-sample-section">
                                    <th>Offer Description</th>
                                    <th>Expiration Date</th>
                                    <th>Offer Clicks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {offers.map((offer, i) => <Offer key={i} description={offer.description} expDate={offer.when} numClicks={offer.clicksCount} />)}
                                </tbody>
                            </table>
                            <table>
                                <thead>
                                    <tr className="campaign-offer-sample-section">
                                        <th>20% Off</th>
                                        <th>06/12/22</th>
                                        <th>41</th>
                                        <button type="button" className="campaign-button" onClick={() => navigate("/individualCampaigns")}>View</button>
                                    </tr>
                                </thead>
                            </table>
                            <table>
                                <thead>
                                    <tr className="campaign-offer-sample-section">
                                        <th>50% Off</th>
                                        <th>06/16/22</th>
                                        <th>32</th>
                                        <button type="button" className="campaign-button" onClick={() => navigate("/individualCampaigns")}>View</button>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        
                       
                        <div className="individual-campaign-bottom-section">
                            <div className="events">
                                <h3>Events in this Campaign</h3>
                                <table>
                                    <thead>
                                        <tr className="campaign-sample-bottom-section">
                                        <th>Vegan Time</th>
                                        <button type="button" className="campaign-button" onClick={() => navigate("/individualCampaigns")}>View</button>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div className="campaign-businesses">
                                <h3>Businesses in this Campaign</h3>
                                <table>
                                    <thead>
                                        <tr className="campaign-sample-bottom-section">
                                        <th>Mrs.Smith's</th>
                                        <button type="button" className="campaign-button" onClick={() => navigate("/individualCampaigns")}>View</button>
                                        </tr>
                                    </thead>
                                </table>
                                <table>
                                    <thead>
                                        <tr className="campaign-sample-bottom-section">
                                        <th>VegeWorld</th>
                                        <button type="button" className="campaign-button" onClick={() => navigate("/individualCampaigns")}>View</button>
                                        </tr>
                                    </thead>
                                </table>
                                <table>
                                    <thead>
                                        <tr className="campaign-sample-bottom-section">
                                        <th>Aroma</th>
                                        <button type="button" className="campaign-button" onClick={() => navigate("/individualCampaigns")}>View</button>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>   
                    </div>
                </div>
            </div>
            
        </>

    )
}

export default IndividualCampaigns;