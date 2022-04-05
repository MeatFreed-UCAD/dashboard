import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from "react";
import { getDataModel } from './DataModel';
import './styles/style.css';
import { GeoPoint } from 'firebase/firestore';

function Details() {
    const location = useLocation();
    const dataModel = getDataModel();
    const item = location.state ? location.state.item : null;
    const editMode = (item != null);
    const [name, setName] = useState(item ? item.name : '');
    const [address, setAddress] = useState(item ? item.address : '');
    const [geohash, setGeohash] = useState(item ? item.geohash : '');
    const [placeId, setPlaceId] = useState(item ? item.place_id: '');
    const [latitude, setLatitude] = useState(item ? item.location._lat : '');
    const [longitude, setLongitude] = useState(item ? item.location._long : '');
    const navigate = useNavigate();
    return (
      <div className="main">
        <div className="inputContainer">
          <form className='inputWithLabel'>
            <label>
              Restaurant
            </label>
            <input type="text" className="inputBox" value={name} onChange={(e) => setName(e.target.value)}/>
          </form>
          <form className='inputWithLabel'>
            <label>
              Address
            </label>
            <input type="text" className="inputBox" value={address} onChange={(e) => setAddress(e.target.value)}/>
          </form>
          <form className='inputWithLabel'>
            <label>
              Geohash
            </label>
            <input type="text" className="inputBox" value={geohash} onChange={(e) => setGeohash(e.target.value)}/>
          </form>
          <form className='inputWithLabel'>
            <label>
              place_id
            </label>
            <input type="text" className="inputBox" value={placeId} onChange={(e) => setPlaceId(e.target.value)}/>
          </form>
          <form className='inputWithLabel'>
            <label>
              Latitude
            </label>
            <input type="text" className="inputBox" value={latitude} onChange={(e) => setLatitude(e.target.value)}/>
          </form>
          <form className='inputWithLabel'>
            <label>
              Longitude
            </label>
            <input type="text" className="inputBox" value={longitude} onChange={(e) => setLongitude(e.target.value)}/>
          </form>
          <button
            className="btn btn-dark"
            type="button"
            onClick={() => {navigate(-1);}}
          >
            Cancel
          </button>

          <button
            className="btn btn-primary"
            type="button"
            onClick={()=>{
              if (editMode) {
                item.name = name;
                item.address = address;
                item.geohash = geohash;
                item.place_id = placeId;
                item.location = new GeoPoint(latitude, longitude);
                dataModel.updateItem(item.key, item);
              } else {
                // update data model
                dataModel.addItem({
                name: name,
                address: address,
                geohash: geohash,
                place_id: placeId,
                location: new GeoPoint(latitude, longitude)
                }); // let the data model add the key
              }
              navigate("/admin");
            }}
          >
            {editMode ? "Save" : "Add Restaurant"}
          </button>
          </div>
  </div>
    )
}
export default Details;