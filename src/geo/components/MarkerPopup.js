import PropTypes from 'prop-types'

const MarkerPopup = (props) => {
    return (
        <p className="map__popup__content">{props.title}</p>
    );
}

MarkerPopup.propTypes = {
    title: PropTypes.string.isRequired
}

export default MarkerPopup;