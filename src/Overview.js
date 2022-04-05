import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import { getDataModel } from './DataModel';
import './styles/style.css';
import Offer from './Offer';

function Overview() {
    const location = useLocation();
    const dataModel = getDataModel();
    const item = location.state ? location.state : null;
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [emails, setEmails] = useState([]);
    const [emailInput, setEmailInput] = useState('');

    useEffect(() => {
        dataModel.fetchOfferData(null, item.place_id);
        dataModel.fetchAssociatedEmails(item.place_id);
        const dataModelListenerId = dataModel.addListener(() => {
          let newOffers = Array.from(dataModel.offers);
          setOffers(newOffers);
          let newEmails = Array.from(dataModel.emails);
          setEmails(newEmails);
        });
        return(() => {
          dataModel.removeListener(dataModelListenerId);
        });
    }, []);

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
      <div>
        <h2>{item.name}</h2>
        Address: {item.address}
        Geohash: {item.geohash}
        Place ID: {item.place_id}
        Latitude: {item.location._lat}
        Longitude: {item.location._long}
        <Link to="/details" state={{item: item}}>
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

      <table>
        <thead>
          <tr className="table-header">
            <th>Offer Description</th>
            <th>Expiration Date</th>
            <th>Offer Clicks</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer, i) => <Offer key={i} description={offer.description} expDate={offer.when} numClicks={offer.clicksCount}/>)}
        </tbody>
      </table>

      <form>
        <label>
          Email Address
        </label>
        <input type="text" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/>
      </form>
      <button type="button" className="btn btn-dark" onClick={()=>{
        dataModel.addEmail({
          name: item.name,
          place_id: item.place_id,
          email: emailInput
        });
      }}>
        Add Email
      </button>
      {emails.map((email, i) => <li key={i}>{email.email}</li>)}
      </div>
    )
}
export default Overview;