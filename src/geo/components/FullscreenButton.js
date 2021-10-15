import icon from '../assets/fullscreen.png';

const FullscreenButton = (props) => {
    return (
        <button className="fullscreen" onClick={props.handleFullscreen}><img src={icon} alt="fullscreen" /></button>
    );
};

export default FullscreenButton;