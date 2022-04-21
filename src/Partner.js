import "./styles/style.css";
import { GoPencil, GoTrashcan } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

function Partner(props) {
    const {business, partner, onDelete} = props;
    const navigate = useNavigate();
    return <tr className="table-body">
        <td>{partner.partner_name}</td>
        <td>{partner.email}</td>
        <td>{partner.role}</td>
        <td>    
            <GoPencil size={22} onClick={() => {
                navigate("/partnerDetails", {state: {partner: partner, business: business}});
            }}/>
        </td>
        <td><GoTrashcan size={22} onClick={(e) => {
            onDelete(partner);
            e.stopPropagation();
        }}/></td>
    </tr>
}
export default Partner;