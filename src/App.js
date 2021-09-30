import './App.css';
import { actionReady, actionMoved } from './state/geo/actions';
import { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { MAP_STYLE, MAP_TOKEN } from './constants';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

const mapStateToProps = (state) => {
  return {
    lng: state.geo.lng,
    lat: state.geo.lat,
    zoom: state.geo.zoom,
    isLoading: state.geo.isLoading,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    mapReady: () => { dispatch(actionReady()) },
    mapMoved: (data) => { dispatch(actionMoved(data)) }
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.mapContainer = createRef();
  }

  componentDidMount() {
    this.map = this.createMap(MAP_TOKEN, this.mapContainer.current, MAP_STYLE, this.props);

    this.map.on('load', () => {
      // ready action dispatched to update the DOM
      this.props.mapReady();
    });

    this.map.on('move', () => {
      // moved action dispatched to update the coordinates and zoom level
      const center = this.map.getCenter();
      const zoom = this.map.getZoom();
      this.props.mapMoved({
        lat: center.lat.toFixed(4),
        lng: center.lng.toFixed(4),
        zoom: zoom.toFixed(2),
      });
    });
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

  render() {
    const { isLoading, lat, lng, zoom } = this.props;

    return (
      <div>
        <div className="sidebar">Latitude {lat} | Longitude {lng} | Zoom {zoom}</div>
        <div ref={this.mapContainer} className="map" />
        <p className={isLoading ? 'loading' : 'hidden'}>Loading...</p>
      </div>
    );
  }
}

// Redux connected App
export default connect(mapStateToProps, mapDispatchToProps)(App);
