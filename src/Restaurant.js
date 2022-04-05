import "./styles/style.css";
import { GoPencil, GoTrashcan } from "react-icons/go";
import { Link } from "react-router-dom";


function Restaurant(props) {
    const {item, onDelete, onClickEvent} = props;
    return <tr className="table-body" onClick={onClickEvent}>
        <td>{item.name}</td>
        {/* <td>
            <Link to="/details" state={{item: item}}>
                <GoPencil size={22}/>
            </Link>
        </td> */}
        <td><GoTrashcan size={22} onClick={(e) => {
            onDelete(item);
            e.stopPropagation();
        }}/></td>
    </tr>
}
export default Restaurant;