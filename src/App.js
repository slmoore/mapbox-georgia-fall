
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Component, createRef } from 'react';
import { connect } from 'react-redux';
import './App.css';
import { MAP_STYLE, MAP_TOKEN } from './constants';


const mapStateToProps = (state) => {
  return {
    lng: state.geo.lng,
    lat: state.geo.lat,
    zoom: state.geo.zoom,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {}
};

class App extends Component {
  constructor(props) {
    super(props);
    this.mapContainer = createRef();
  }

  componentDidMount() {
    this.createMap(MAP_TOKEN, this.mapContainer.current, MAP_STYLE, this.props);
  }

  createMap(token, container, style, props) {
    if (this.map) {
      return;
    }
    
    const { lng, lat, zoom } = props;
    mapboxgl.accessToken = token;
    this.map = new mapboxgl.Map({
      container,
      style,
      center: [lng, lat],
      zoom
    });
  }

  render() {
    return (
      <div>
        <div ref={this.mapContainer} className="map"></div>
        <p className="description">Map for checkpoints and other features coming soon!</p>
      </div>
    );
  }
}

// Redux connected App
export default connect(mapStateToProps)(App);
