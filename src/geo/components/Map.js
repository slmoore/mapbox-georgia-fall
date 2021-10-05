import { actionReady } from '../state/actions';
import { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { FALL_MARKER_ID, MAP_STYLE, MAP_TOKEN, NOVEMBER, OCTOBER } from '../../constants';
import { renderToString } from 'react-dom/server';
import fallLeaf from '../assets/fall-leaf-icon.svg';
import mapboxgl from 'mapbox-gl';
import MarkerPopup from './MarkerPopup';
import MonthFilter from './MonthFilter';
import Loading from './Loading';
import PropTypes from 'prop-types';

const mapStateToProps = (state) => {
    return {
        lng: state.geo.lng,
        lat: state.geo.lat,
        zoom: state.geo.zoom,
        isLoading: state.geo.isLoading,
        month: state.app.month,
        selected: state.app.selected,
        dataset: state.app.dataset
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        mapReady: () => { dispatch(actionReady()) }
    }
};

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

    componentDidMount() {
        this.map = this.createMap(MAP_TOKEN, this.mapContainer.current, MAP_STYLE, this.props);
        this.mapBootstrap();
    }

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
            addCursorListeners(OCTOBER);

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

    componentDidUpdate(prevProps) {
        if (!this.map) {
            return;
        }
        const { month, selected, dataset } = this.props;

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

    getPopupData(dataset, month, id) {
        return dataset[month].features.reduce((accumulator, item) => {
            if (item.properties.id === id) {
                accumulator.coordinates = item.geometry.coordinates;
                accumulator.title = item.properties.title;
            }
            return accumulator;
        }, {});
    }

    handleMapMonth(nextMonth, prevMonth, id) {
        this.map.setLayoutProperty(prevMonth, 'visibility', 'none');
        this.map.setLayoutProperty(nextMonth, 'visibility', 'visible');
        this.addCursorListeners(nextMonth, prevMonth);
    }

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

    handleMouseEnter() {
        this.map.getCanvas().style.cursor = 'pointer';
    }

    handleMouseLeave() {
        this.map.getCanvas().style.cursor = '';
    }

    addCursorListeners(layerOn, layerOff) {
        if (layerOff) {
            this.map.off('mouseenter', layerOff, this.handleMouseEnter);
            this.map.off('mouseleave', layerOff, this.handleMouseLeave);
        }

        this.map.on('mouseenter', layerOn, this.handleMouseEnter);
        this.map.on('mouseleave', layerOn, this.handleMouseLeave);
    }

    render() {
        const { handleMonthChange, isLoading, month } = this.props;

        return (
            <section ref={this.mapContainer} className="map">
                <Loading isLoading={isLoading} />
                <MonthFilter activeMonth={month} handleMonthChange={handleMonthChange} />
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);