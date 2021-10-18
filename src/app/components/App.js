import '../styles/App.css';
import '../../geo/styles/Geo.css';
import '../../sidebar/styles/Sidebar.css';
import { actionMonthChanged, actionPointSelected, actionFullscreen, actionExitFullscreen } from '../state/actions';
import { Component, createRef } from 'react';
import { connect } from 'react-redux';
import Map from '../../geo/components/Map';
import Sidebar from '../../sidebar/components/Sidebar';
import PropTypes from 'prop-types';
import { COMPLETE, FAILED, STARTING } from '../../constants';

/**
 * 
 * -------------------------------------------
 * | title         |        | filter Oct Nov |
 * | image         |        |----------------|
 * | description   |                         |
 * | address       |  Map with Icons         |
 * |               |  First is pre-selected  |
 * |               |                         |
 * |               |                         |
 * |               |                         |
 * |               |                         |
 * |               |                         |
 * |               |                         |
 * |------------------------------------------
 * 
 */


const mapStateToProps = (state) => {
    return {
        month: state.app.month,
        selected: state.app.selected,
        dataset: state.app.dataset,
        isFullscreen: state.app.isFullscreen,
        fullscreenStatus: state.app.fullscreenStatus,
        exitFullscreenStatus: state.app.exitFullscreenStatus
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        monthChanged: (data) => { dispatch(actionMonthChanged(data)) },
        pointSelected: (data) => { dispatch(actionPointSelected(data)) },
        fullscreen: (status) => { dispatch(actionFullscreen(status)) },
        exitFullscreen: (status) => { dispatch(actionExitFullscreen(status)) }
    }
};

/**
 * App container component including Sidebar and Map
 */
class App extends Component {
    constructor(props) {
        super(props);
        this.appRef = createRef();
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleFullscreen = this.handleFullscreen.bind(this);
    }

    /**
     * Handle DOM event for month change.
     * 
     * @param {Event} event 
     */
    handleMonthChange(event) {
        if (this.props.month === event.target.value) {
            return;
        }

        this.props.monthChanged(event.target.value);
    }

    /**
     * Handle DOM event for fullscreen mode.
     * 
     * @param {Event} event 
     */
    async handleFullscreen(event) {
        event.preventDefault();
        const { isFullscreen, fullscreen, exitFullscreen } = this.props;

        if (!isFullscreen) {
            fullscreen(STARTING);
            try {
                await this.appRef.current.requestFullscreen();
                fullscreen(COMPLETE);
            } catch (error) {
                console.log(error);
                fullscreen(FAILED);
            }
        } else {
            exitFullscreen(STARTING);
            try {
                await document.exitFullscreen();
                exitFullscreen(COMPLETE);
            } catch (error) {
                console.log(error);
                exitFullscreen(FAILED);
            }
        }
    }

    /**
     * Render App component.
     * 
     * @returns {JSX}
     */
    render() {
        const { appRef, handleFullscreen, handleMonthChange } = this;
        const { dataset, month, selected, pointSelected } = this.props;

        return (
            <div ref={appRef} className="app">
                <Sidebar dataset={dataset} month={month} selected={selected} pointSelected={pointSelected} />
                <Map handleMonthChange={handleMonthChange} pointSelected={pointSelected} handleFullscreen={handleFullscreen} />
            </div>
        );
    }
}

App.propTypes = {
    dataset: PropTypes.object.isRequired,
    month: PropTypes.string.isRequired,
    selected: PropTypes.number.isRequired,
    pointSelected: PropTypes.func.isRequired
}

// Redux connected App
export default connect(mapStateToProps, mapDispatchToProps)(App);
