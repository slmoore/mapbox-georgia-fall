import PropTypes from 'prop-types'

/**
 * Mapbox Popup content component
 * 
 * @param {Object} props 
 * @returns {JSX}
 */
const MarkerPopup = (props) => {
    return (
        <p className="map__popup__content">{props.title}</p>
    );
}

MarkerPopup.propTypes = {
    title: PropTypes.string.isRequired
}

export default MarkerPopup;