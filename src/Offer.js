import "./styles/style.css";

function Offer(props) {
    const {description, valid, expDate, numClicks} = props;
    return <div className="offer-box">
        <div className="offer-content">
            <span>{description}</span>
            <span>{valid}</span>
            <span>{expDate}</span>
            <span>{numClicks}</span>
        </div>

        </div>
}
export default Offer;