

// ! Is this popup accessible?
// ! Is this map accessible?
const MarkerPopup = (props) => {
    return (
        <p className="map__popup__content">{props.title}</p>
    );
}

export default MarkerPopup;