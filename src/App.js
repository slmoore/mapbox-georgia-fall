import './App.css';
import { actionReady, actionMoved } from './geo/state/actions';
import { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { MAP_LAYER_ID, MAP_STYLE, MAP_TOKEN } from './constants';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import ReactDOMServer from 'react-dom/server';
import MarkerPopup from './geo/components/MarkerPopup';
import georgiaFallData, { GEORGIA_FALL_ID } from './geo/data/georgia-fall';
import fallLeaf from './geo/assets/fall-leaf-icon.svg';

/**
 * 
 * -------------------------------------------
 * | image         |        | filter Oct Nov |
 * |               |        |----------------|
 * | description   |                         |
 * | hours         |  Map with Icons         |
 * | fees          |  First is pre-selected  |
 * | driving time  |  as Amicalola           |
 * | from Atlanta  |                         |
 * |               |                         |
 * | Attribution   |                         |
 * | to georgia    |                         |
 * | source        |                         |
 * |------------------------------------------
 * 
 */



// ! move to a Map component, App then simply renders Map and anything else that is a component

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

    // ! change map.on() calls to await map.once('event');

    // ! everything should wait for 'load' anyways meaning move and click are either nested in a callback or await the promise
    const { map, svgToImage } = this;

    map.on('load', () => {

      svgToImage(fallLeaf, 50, 50).then(fallMarker => {
          // add image
          const markerName = 'fall-marker';
          map.addImage(markerName, fallMarker);
  
          // add dataset
          map.addSource(GEORGIA_FALL_ID, {
            type: 'geojson',
            data: georgiaFallData
          });
  
          // add symbol layer
          map.addLayer({
            id: GEORGIA_FALL_ID,
            type: 'symbol',
            source: GEORGIA_FALL_ID,
            layout: {
              'icon-image': markerName,
              'icon-allow-overlap': true
            }
          });
      }).catch(err => {
        console.log(`error loading image: ${err}`);
      })

      // ready action dispatched to update the DOM
      this.props.mapReady();
    });

    map.on('move', () => {
      // moved action dispatched to update the coordinates and zoom level
      const center = map.getCenter();
      const zoom = map.getZoom();
      this.props.mapMoved({
        lat: center.lat.toFixed(4),
        lng: center.lng.toFixed(4),
        zoom: zoom.toFixed(2),
      });
    });

    map.on('click', MAP_LAYER_ID, (event) => {
      if (!(event.features && event.features.length)) {
        return;
      }
      const feature = event.features[0];
      const { title, description, image } = feature.properties;
      const { coordinates } = feature.geometry;

      new mapboxgl.Popup({
        anchor: 'right',
        offset: [-15, 0],
        className: 'map__popup',
      })
        .setLngLat(coordinates)
        .setHTML(ReactDOMServer.renderToString(<MarkerPopup title={title} description={description} image={image} />))
        .addTo(map);
    });
  }

  svgToImage(svgSrc, width, height) {
      // create HTMLImageElement from svg
      const img = new Image(width, height);
      const promise = new Promise((resolve, reject) => {
        img.addEventListener('load', (e) => {
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
