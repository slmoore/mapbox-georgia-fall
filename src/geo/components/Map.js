import { actionReady, actionNotSupported, actionError, thunkGetMapMeta } from '../state/actions';
import { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { COMPLETE, FALL_MARKER_ID, NOVEMBER, OCTOBER } from '../../constants';
import { renderToString } from 'react-dom/server';
import fallLeaf from '../assets/fall-leaf-icon.svg';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl'; // webworker source is incompatible with react-scripts transpilation. loader disabled
import MarkerPopup from './MarkerPopup';
import MonthFilter from './MonthFilter';
import Loading from './Loading';
import PropTypes from 'prop-types';
import FullscreenButton from './FullscreenButton';

const mapStateToProps = (state) => {
    return {
        lng: state.geo.lng,
        lat: state.geo.lat,
        zoom: state.geo.zoom,
        isLoading: state.geo.isLoading,
        month: state.app.month,
        selected: state.app.selected,
        dataset: state.app.dataset,
        isSupported: state.geo.isSupported,
        isError: state.geo.isError,
        fetchStatus: state.geo.fetchStatus,
        mapboxData: state.geo.mapboxData
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        mapReady: () => { dispatch(actionReady()) },
        notSupported: () => { dispatch(actionNotSupported()) },
        errorFound: () => { dispatch(actionError()) },
        getMapboxData: () => { dispatch(thunkGetMapMeta()) }
    }
};

/**
 * Map component including Mapbox map instance and interactions.
 */
class Map extends Component {
    constructor(props) {
        super(props);
        this.mapContainer = createRef();
        this.handleMapClick = this.handleMapClick.bind(this);
        this.showPopup = this.showPopup.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.addCursorListeners = this.addCursorListeners.bind(this);
        this.handleMapMonth = this.handleMapMonth.bind(this);
    }

    /**
     * Component mounted lifecycle method.
     * 
     * Dispatch fetch action.
     */
    componentDidMount() {
        if (!mapboxgl.supported()) {
            this.props.notSupported();
            return;
        }
        
        this.props.getMapboxData();
    }
    
    /**
     * Component updated lifecycle method.
     * 
     * Update the component based on changes to data fetched, month changes, and markers selected.
     * 
     * @param {Object} prevProps 
     */
    componentDidUpdate(prevProps) {
        const { month, selected, dataset, fetchStatus, errorFound } = this.props;
        const mapboxData = this.props.mapboxData || {};
        
        // mapbox fetch status changed
        if (fetchStatus !== prevProps.fetchStatus) {
            if (fetchStatus === COMPLETE) {
                if (!(mapboxData.tkn && mapboxData.style)) {
                    errorFound();
                    return;
                }

                this.map = this.createMap(mapboxData.tkn, this.mapContainer.current, mapboxData.style, this.props);
                this.mapBootstrap();
            }
        }

        if (!this.map) {
            return;
        }

        // month changed
        if (month !== prevProps.month) {
            if (month === OCTOBER) {
                this.handleMapMonth(OCTOBER, NOVEMBER, 0);
            } else {
                this.handleMapMonth(NOVEMBER, OCTOBER, 14);
            }
        }

        // selected item changed
        if (selected !== prevProps.selected) {
            const { coordinates, title } = this.getPopupData(dataset, month, selected);
            this.showPopup(coordinates, title);
        }
    }

    /**
     * Bootstrap the Mapbox map and dispatch ready action.
     */
    async mapBootstrap() {
        const { map, props, svgToImage, handleMapClick, addCursorListeners } = this;
        const { mapReady, selected, dataset, month } = props;

        await map.once('load');

        try {
            const fallMarker = await svgToImage(fallLeaf, 20, 20);

            // add image
            const markerName = FALL_MARKER_ID;
            map.addImage(markerName, fallMarker);

            for (let key in dataset) {
                // add datasets and layers
                map.addSource(key, {
                    type: 'geojson',
                    data: dataset[key]
                });

                // add symbol layer
                map.addLayer({
                    id: key,
                    type: 'symbol',
                    source: key,
                    layout: {
                        'icon-image': markerName,
                        'icon-allow-overlap': true,
                        visibility: key === month ? 'visible' : 'none'
                    }
                });
            }

            map.on('click', handleMapClick);
            addCursorListeners(props.month);

            // popup on first available feature
            const coordinates = dataset[month].features[selected].geometry.coordinates;
            const title = dataset[month].features[selected].properties.title;
            if (coordinates && title) {
                this.showPopup(coordinates, title);
            }

            await map.once('render');

            // ready action dispatched to update the DOM
            mapReady();
        } catch (err) {
            console.log(`error bootstrapping map: ${err}`);
        }
    }

    /**
     * Build popup data from dataset.
     *  
     * @param {Object} dataset 
     * @param {string} month 
     * @param {number} id 
     * @returns {{ coordinates, title }}
     */
    getPopupData(dataset, month, id) {
        return dataset[month].features.reduce((accumulator, item) => {
            if (item.properties.id === id) {
                accumulator.coordinates = item.geometry.coordinates;
                accumulator.title = item.properties.title;
            }
            return accumulator;
        }, {});
    }

    /**
     * Handle changes to the month for the map.
     * Layout changes, and listener updates.
     * 
     * @param {string} nextMonth 
     * @param {string} prevMonth 
     * @param {number} id 
     */
    handleMapMonth(nextMonth, prevMonth, id) {
        this.map.setLayoutProperty(prevMonth, 'visibility', 'none');
        this.map.setLayoutProperty(nextMonth, 'visibility', 'visible');
        this.addCursorListeners(nextMonth, prevMonth);
    }

    /**
     * Convert SVG image to HTMLImageElement.
     * Used by the Mapbox API for setting Markers.
     * 
     * @param {string} svgSrc 
     * @param {number} width 
     * @param {number} height 
     * @returns {Promise<HTMLImageElement|Error>}
     */
    svgToImage(svgSrc, width, height) {
        // create HTMLImageElement from svg
        const img = new Image(width, height);
        const promise = new Promise((resolve, reject) => {
            img.addEventListener('load', () => {
                resolve(img);
            });
            img.addEventListener('error', (e) => {
                reject(e);
            });
        });
        img.src = svgSrc;
        return promise;
    }

    /**
     * Create Mapbox map instance.
     * Instance will be reused for the lifecycle of the Map component.
     * 
     * @param {string} token 
     * @param {Element} container 
     * @param {string} style 
     * @param {Object} props 
     * @returns {MapboxMap}
     */
    createMap(token, container, style, props) {
        if (this.map) {
            return this.map;
        }

        const { lng, lat, zoom } = props;
        mapboxgl.accessToken = token;
        return new mapboxgl.Map({
            container,
            style,
            center: [lng, lat],
            zoom
        });
    }

    /**
     * Handle click DOM events on the Map component.
     * Dispatch an action with the Feature id if the point selected includes Feature coordinates.
     * 
     * @param {Event} event 
     */
    handleMapClick(event) {
        event.preventDefault();

        const features = this.map.queryRenderedFeatures(event.point);
        if (!(features && features.length)) {
            return;
        }

        const feature = features[0];
        const { id } = feature.properties;
        if (typeof id !== 'number') {
            return;
        }

        this.props.pointSelected(id);
    }

    /**
     * Render Mapbox popup.
     * Enforces only 1 popup is shown at a time.
     * 
     * @param {[number, number]]} coordinates
     * @param {string} title 
     */
    showPopup(coordinates, title) {
        if (this.popup) {
            this.popup.remove();
        }

        this.popup = new mapboxgl.Popup({
            focusAfterOpen: false,
            anchor: 'bottom',
            offset: [0, -10],
            className: 'map__popup'
        })
            .setLngLat(coordinates)
            .setHTML(renderToString(<MarkerPopup title={title} />));

        this.popup.addTo(this.map);
    }

    /**
     * Handle mouse enter event styles.
     */
    handleMouseEnter() {
        this.map.getCanvas().style.cursor = 'pointer';
    }

    /**
     * Handle mouse leave event styles.
     */
    handleMouseLeave() {
        this.map.getCanvas().style.cursor = '';
    }

    /**
     * Toggle layer event listeners.
     * 
     * @param {string} layerOn 
     * @param {string} layerOff 
     */
    addCursorListeners(layerOn, layerOff) {
        if (layerOff) {
            this.map.off('mouseenter', layerOff, this.handleMouseEnter);
            this.map.off('mouseleave', layerOff, this.handleMouseLeave);
        }

        this.map.on('mouseenter', layerOn, this.handleMouseEnter);
        this.map.on('mouseleave', layerOn, this.handleMouseLeave);
    }

    /**
     * Render Map component
     * 
     * @returns {JSX}
     */
    render() {
        const { handleMonthChange, isLoading, month, isSupported, isError, handleFullscreen } = this.props;

        return (
            <section ref={this.mapContainer} className="map">
                <div className={isSupported ? 'hidden' : 'error'}>This browser is not supported.</div>
                <div className={isError ? 'error' : 'hidden'}>An error occurred, please try again later.</div>
                <Loading isLoading={isLoading} />
                <div className="mapTools">
                    <MonthFilter activeMonth={month} handleMonthChange={handleMonthChange} />
                    <FullscreenButton handleFullscreen={handleFullscreen} />
                </div>
            </section>
        );
    }
}

Map.propTypes = {
    lng: PropTypes.number.isRequired,
    lat: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
    month: PropTypes.string.isRequired,
    selected: PropTypes.number.isRequired,
    dataset: PropTypes.object.isRequired,
    mapReady: PropTypes.func.isRequired,
    isSupported: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    fetchStatus: PropTypes.string.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);