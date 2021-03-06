import icon from '../assets/fall-leaf-icon.svg';
import PropTypes from 'prop-types';

/**
 * Loading screen while map is loading.
 * 
 * @param {Object} props 
 * @returns {JSX}
 */
const Loading = (props) => {
    return (
        <div className={props.isLoading ? 'loading' : 'hidden'}>
            <img className="loading__icon" src={icon} alt="falling leaf while map is loading" />
        </div>
    );
}

Loading.propTypes = {
    isLoading: PropTypes.bool.isRequired
};

Loading.defaultProps = {
    isLoading: true
};

export default Loading;