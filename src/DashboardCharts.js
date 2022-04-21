import React, { Component, useEffect, useState } from "react";
import { ButtonToolbar, Button, ButtonGroup, InputGroup, Toast } from 'react-bootstrap';
import * as dayjs from "dayjs";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getUserModel } from "./DataModel";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import logo from './meatfreed-logo.png';

import './styles/style.css';
import { getDataModel } from './DataModel';
import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import { endAt } from "firebase/firestore";

function DashboardCharts() {
    const [user, loading, error] = useAuthState(auth);
    const dataModel = getDataModel();
    const navigate = useNavigate();
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantClickData, setRestaurantClickData] = useState("");
    const [offerClickData, setOfferClickData] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState("");
    const [numberofDays, setNumberofDays] = useState(7);

    const [oneChart, isOneChart] = useState(false);

    const [restaurantChartData, setRestaurantChartData] = useState({
        labels: [],
        datasets: [{
            label: "Number of Clicks",
            data: [],
            backgroundColor: ["#780000"],
            pointRadius: 4
        }]
    });

    const [offerChartData, setOfferChartData] = useState({
        labels: [],
        datasets: [{
            label: "Number of Clicks",
            data: [],
            backgroundColor: ["#41566b"],
            pointRadius: 4
        }]
    });

    var chartRenderDate;
    var chartRender;

    //the same function can be used for offers and restaurant clicks, unless changes are made to the data
    // takes in the new date -> checks for a match -> returns +1

    function chartClicks(clickdata, currentDate) {
        console.log("chartClicks called");
        let currentDateFormatted = dayjs(currentDate).format('MMM DD');

        let clickCount = 0;
        for (var i = 0; i < clickdata.length; i++) {
            if (clickdata[i].dateFormatted === currentDateFormatted) {
                clickCount++;
            }
        }
        return clickCount;
    }

    function dataChartArray(numDays, currentDate) {
        console.log("weeklyChartArray called")
        return (
            Array(numDays).fill('').map((i) => ({
                date: new Date(currentDate.setDate(currentDate.getDate() + 1)),
                dateLabel: dayjs(currentDate).format('MMM DD'),
                // TODO: Get real click count
                // clickCount: Math.ceil(Math.random() * 100)
                clickCountRestaurants: chartClicks(restaurantClickData, currentDate),
                clickCountOffers: chartClicks(offerClickData, currentDate)
            }))
        )
    }



    useEffect(() => {
        dataModel.fetchRestaurantClicks(user);
        dataModel.fetchOfferClicks(user);
        const dataModelListenerId = dataModel.addListener(() => {
            setRestaurantName(dataModel.getRestaurantName());

            setRestaurantClickData(dataModel.getRestaurantClickData());
            console.log("Restaurant Clicks", restaurantClickData);

            setOfferClickData(dataModel.getOfferClickData());
            console.log("Offer Clicks", offerClickData);

        });
        return (() => {
            dataModel.removeListener(dataModelListenerId);
        });
    }, [user, loading]);

    useEffect(() => {

        chartRenderDate = new Date(startDate.getTime()); //clone the date
        chartRenderDate = new Date(chartRenderDate.setDate(chartRenderDate.getDate() - 1)); //decrement the date by 1 for charting

        //weekly render array - default
        chartRender = dataChartArray(numberofDays, chartRenderDate);
        console.log("firstChartRender: ", chartRender);

        setRestaurantChartData({
            labels: chartRender.map((item) => item.dateLabel),
            datasets: [{
                label: "Number of Clicks",
                data: chartRender.map((item) => item.clickCountRestaurants),
            }]
        });

        setOfferChartData({
            labels: chartRender.map((item) => item.dateLabel),
            datasets: [{
                label: "Number of Clicks",
                data: chartRender.map((item) => item.clickCountOffers),
            }]
        });

        setEndDate(chartRenderDate);

    }, [restaurantClickData, offerClickData, startDate, numberofDays]);

    console.log("about to render");
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
                <div>
                    <ButtonToolbar className="justify-content-between" aria-label="Toolbar with Button groups">
                        <InputGroup InputGroup className="mb-3">
                            <InputGroup.Text id="btnGroupAddon">Select Start Date: </InputGroup.Text>
                            <div>
                                <DatePicker className="datePickerFormat" selected={startDate} onChange={(newDate) => {
                                    setStartDate(newDate);
                                }} />
                            </div>

                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="btnGroupAddon">Select End Date: </InputGroup.Text>
                            <div>
                                <DatePicker className="datePickerFormat" selected={endDate} onChange={(newDate) => {
                                    if (newDate > startDate) {
                                        const diffTime = Math.abs(newDate - startDate);
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                        setNumberofDays(diffDays + 1);
                                    }
                                }} />
                            </div>
                        </InputGroup>
                        <ButtonGroup aria-label="First group">
                            <Button className="mb-3" variant="secondary" onClick={() => (setNumberofDays(7))}>Weekly View</Button>
                            <Button className="mb-3" variant="secondary" onClick={() => (setNumberofDays(30))}> Monthly View</Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
                <div className="viz-container">
                    <div>
                        <div className="chart-container">
                            <h3>Restaurant Clicks</h3>
                            <LineChart chartData={restaurantChartData} />
                        </div>
                        <div className="chart-container">
                            <h3>Offer Clicks</h3>
                            <LineChart chartData={offerChartData} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardCharts;