import "./styles/style.css";

function Offer(props) {
    const {description, expDate, numClicks} = props;
    return <tr className="table-body">
        <td>{description}</td>
        <td>{expDate}</td>
        <td>{numClicks}</td>
    </tr>
}
export default Offer;