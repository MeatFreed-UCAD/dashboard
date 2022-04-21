import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { auth, getDataModel } from './DataModel';
import './styles/style.css';
import Offer from './Offer';
import Partner from './Partner';
import logo from './meatfreed-logo.png';

function Overview() {
    const [user, loading, error] = useAuthState(auth);
    const location = useLocation();
    const dataModel = getDataModel();
    const item = location.state ? location.state : null;
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [partners, setPartners] = useState([]);
    // const [emails, setEmails] = useState([]);
    // const [emailInput, setEmailInput] = useState('');

    useEffect(() => {
        if (!user) return navigate("/");
        dataModel.fetchOfferData(null, item.place_id);
        dataModel.fetchPartners(item.place_id);
        // dataModel.fetchAssociatedEmails(item.place_id);
        const dataModelListenerId = dataModel.addListener(() => {
          let newOffers = Array.from(dataModel.offers);
          setOffers(newOffers);
          let newPartners = Array.from(dataModel.partners);
          setPartners(newPartners);
          // let newEmails = Array.from(dataModel.emails);
          // setEmails(newEmails);
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

    const handlePartnerDelete = (partner) => {
      const text = "Are you sure you want to delete partner " + partner.partner_name + "?";
      if (window.confirm(text) == true) {
        dataModel.deletePartner(partner.key);
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
      <div className="content">
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/admin")}>
          Back
        </button>
        <h2>{item.name}</h2>
        <ul className="business-info">
          <li><span className="info-label">Address: </span>{item.address}</li>
          <li><span className="info-label">Geohash: </span>{item.geohash}</li>
          <li><span className="info-label">Place ID: </span>{item.place_id}</li>
          <li><span className="info-label">Latitude: </span>{item.location._lat}</li>
          <li><span className="info-label">Longitude: </span>{item.location._long}</li>
        </ul>
        <div className="row-of-btn overview-btn">
          <button type="button" className="btn btn-primary" onClick={() => {
            navigate("/details", {state: {item: item}});
          }}>
          Edit
          </button>
          <button type="button" className="btn btn-outline-primary" onClick={() => handleDelete(item)}>
            Delete
          </button>
        </div>
        <h3>Offers</h3>
        <table>
          <thead>
            <tr className="table-header">
              <th>Description</th>
              <th>Expiration Date</th>
              <th>Total Clicks</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer, i) => <Offer key={i} description={offer.description} expDate={offer.when} numClicks={offer.clicksCount}/>)}
          </tbody>
        </table>
        <div className="partner-header">
          <h3>Partners</h3>
          <button type="button" className="btn btn-primary" onClick={() => {
              navigate("/partnerDetails", {state: {business: item}});
            }}>
            Add Partner
          </button>
        </div>
        <table>
          <thead>
            <tr className="table-header">
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner, i) => <Partner key={i} business={item} partner={partner} onDelete={handlePartnerDelete}/>)}
          </tbody>
        </table>

        {/* <form>
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
        {emails.map((email, i) => <li key={i}>{email.email}</li>)} */}

      </div>
    </>
    )
}
export default Overview;

