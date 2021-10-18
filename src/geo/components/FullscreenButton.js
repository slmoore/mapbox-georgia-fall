import icon from '../assets/fullscreen.png';

/**
 * Button for toggling fullscreen mode.
 * 
 * @param {Object} props 
 * @returns {JSX}
 */
const FullscreenButton = (props) => {
    return (
        <button className="fullscreen" onClick={props.handleFullscreen}><img src={icon} alt="fullscreen" /></button>
    );
};

export default FullscreenButton;