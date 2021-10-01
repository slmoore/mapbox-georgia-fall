

// ! Is this popup accessible?
// ! Is this map accessible?
const MarkerPopup = (props) => {
    return (
        <div className="map__popup__content">
            <h3>{props.title}</h3>
            <p>{props.description}</p>
        </div>
    );
}

export default MarkerPopup;