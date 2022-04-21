import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from "react";
import { getDataModel } from './DataModel';
import './styles/style.css';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

function PartnerDetails() {
    const location = useLocation();
    const dataModel = getDataModel();
    const business = location.state.business ? location.state.business : null;
    const partner = location.state.partner ? location.state.partner : null;
    const editMode = (partner != null);
    const [name, setName] = useState(partner ? partner.partner_name : '');
    const [email, setEmail] = useState(partner ? partner.email : '');
    const oldEmail = email ? email : '';
    const role = 'business_partner';
    const navigate = useNavigate();

    const sendInvitationEmail = (email) => {
      const auth = getAuth();
      sendPasswordResetEmail(auth, email)
        .then(() => {
          alert("Invitation Email has been sent!");
        })
        .catch((error) => {
          alert("Something went wrong!");
          console.log(error);
        });
    };

    return (
      <div className="main">
        <div className="inputContainer">
          <form className='inputWithLabel'>
            <label>
              Name
            </label>
            <input type="text" className="inputBox" value={name} onChange={(e) => setName(e.target.value)}/>
          </form>
          <form className='inputWithLabel'>
            <label>
              Email
            </label>
            <input type="text" className="inputBox" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </form>
          <form className='inputWithLabel'>
            <label>
              Role
            </label>
            <input type="text" className="inputBox" value={role} disabled/>
          </form>
          <form className='inputWithLabel'>
            <label>
              Business
            </label>
            <input type="text" className="inputBox" value={business ? business.name : partner.business_name} disabled/>
          </form>
          <form className='inputWithLabel'>
            <label>
              place_id
            </label>
            <input type="text" className="inputBox" value={business ? business.place_id : partner.place_id} disabled/>
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
                partner.partner_name = name;
                partner.email = email;
                dataModel.updatePartner(partner.key, partner);
                if (oldEmail != email) sendInvitationEmail(email);
              } else {
                // update data model
                dataModel.addPartner({
                  partner_name: name,
                  email: email,
                  business_name: business.name,
                  place_id: business.place_id,
                  role: role
                }); // let the data model add the key
                sendInvitationEmail(email);
              }
              navigate("/overview", {state: business});
            }}
          >
            {editMode ? "Save" : "Add Partner"}
          </button>
          </div>
  </div>
    )
}
export default PartnerDetails;