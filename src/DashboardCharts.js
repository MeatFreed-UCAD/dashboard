import React, { useEffect, useState } from "react";
import * as dayjs from "dayjs";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getUserModel } from "./DataModel";
import { useNavigate } from "react-router-dom";
import logo from './meatfreed-logo.png';

import './styles/style.css';
import { getDataModel } from './DataModel';
import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";

function DashboardCharts() {
    const [user, loading, error] = useAuthState(auth);
    const dataModel = getDataModel();
    const navigate = useNavigate();
    const [restaurantName, setRestaurantName] = useState("");


    const [restaurantClickData, setRestaurantClickData] = useState("");
    const [offerClickData, setOfferClickData] = useState("");
    //sample data for running chart
    const [restaurantChartData, setRestaurantChartData] = useState({
        labels: ["Feb 1", "Feb 2", "Feb 3", "Feb 4"],
        datasets: [{
            label: "Number of Clicks",
            data: [1, 2, 1, 3],
            backgroundColor: ["#780000"]
        }]
    });

    const [offerChartData, setOfferChartData] = useState({
        labels: ["Feb 1", "Feb 2", "Feb 3", "Feb 4"],
        datasets: [{
            labels: "Number of Clicks",
            data: [2, 1, 1, 2],
        }]
    });

    function chartData(clickdata) {

        //using the original numeric date to sort the incoming data
        clickdata.sort((a, b) => a.date - b.date);

        //create a dictionary
        const clickDataCounts = {};

        //uses the formatted date to display as a chart label
        //counts the unique date values in the clickdata array and stores the count in a key-value pair
        for (var i = 0; i < clickdata.length; i++) {
            clickDataCounts[clickdata[i].dateFormatted] = 1 + (clickDataCounts[clickdata[i].dateFormatted] || 0)
        }
        console.log(clickDataCounts)

        //sets restaurant chart data
        // setRestaurantChartData({
        //     labels: Object.keys(clickDataCounts).map((key) => key),
        //     datasets: [{
        //         labels: "Number of Clicks",
        //         data: clickDataCounts,
        //     }]
        // })

        return clickDataCounts;
    }

    useEffect(() => {
        dataModel.fetchRestaurantClicks(user);

        const dataModelListenerId = dataModel.addListener(() => {
            setRestaurantName(dataModel.getRestaurantName());
            setRestaurantClickData(dataModel.getRestaurantClickData());
            // console.log("Restaurant Clicks" + restaurantClickData)

            setOfferClickData(dataModel.getOfferClickData());
            // console.log("Offer Clicks" + offerClickData)
        });

        //for meatfreed data to be rendered on first page load
        // chartData(restaurantClickData)

        return (() => {
            dataModel.removeListener(dataModelListenerId);
        });
    }, [user, loading]);

    //the same function can be used for offers and restaurant clicks, unless changes are made to the data

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
                    {/* <li>CAMPAIGNS</li> */}
                    <li>
                        <button type="button" className="btn btn-light" onClick={dataModel.logout}>
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
            <div className="content">
                <h1>{restaurantName}</h1>
                <div className="viz-container">
                    <div className="chart-container">
                        <h3>Restaurant Clicks</h3>
                        <button className="btn btn-dark" onClick={() => {
                            let mChartData = chartData(restaurantClickData);
                            setRestaurantChartData({
                                labels: Object.keys(mChartData).map((key) => key),
                                datasets: [{
                                    label: "Number of Clicks - Restaurants",
                                    data: mChartData,
                                    backgroundColor: ["#780000"],
                                    pointRadius: 6
                                }]
                            })
                        }}>Refresh Data </button>
                        <LineChart chartData={restaurantChartData} />
                    </div>

                    <div className="chart-container">
                        <h3>Offer Clicks</h3>
                        <button className="btn btn-dark" onClick={() => {
                            let mChartData = chartData(offerClickData);
                            setOfferChartData({
                                labels: Object.keys(mChartData).map((key) => key),
                                datasets: [{
                                    label: "Number of Clicks",
                                    data: mChartData,
                                    backgroundColor: ["#41566b"],
                                    pointRadius: 6
                                }]
                            })
                        }}>Refresh Data</button>
                        <LineChart chartData={offerChartData} />
                    </div>
                </div>
                <div className="list-container">

                </div>
            </div>
        </>
    )
}

export default DashboardCharts;