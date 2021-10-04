import './App.css';
import { actionReady, actionMonthChanged, actionPointSelected } from './geo/state/actions';
import { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { FALL_MARKER_ID, MAP_STYLE, MAP_TOKEN, OCTOBER } from './constants';
import dataset, { GEORGIA_NOVEMBER, GEORGIA_OCTOBER, peakNovember, peakOctober } from './geo/data/georgia-fall';
import fallLeaf from './geo/assets/fall-leaf-icon.svg';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import MarkerPopup from './geo/components/MarkerPopup';
import MonthFilter from './geo/components/MonthFilter';
import ReactDOMServer from 'react-dom/server';
import Sidebar from './geo/components/Sidebar';

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
// ! add proptypes

const mapStateToProps = (state) => {
  return {
    lng: state.geo.lng,
    lat: state.geo.lat,
    zoom: state.geo.zoom,
    isLoading: state.geo.isLoading,
    month: state.geo.month,
    selected: state.geo.selected
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    mapReady: () => { dispatch(actionReady()) },
    monthChanged: (data) => { dispatch(actionMonthChanged(data)) },
    pointSelected: (data) => { dispatch(actionPointSelected(data)) }
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.mapContainer = createRef();
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
  }

  componentDidMount() {
    this.map = this.createMap(MAP_TOKEN, this.mapContainer.current, MAP_STYLE, this.props);

    // ! change map.on() calls to await map.once('event');

    // ! everything should wait for 'load' anyways meaning move and click are either nested in a callback or await the promise
    const { map, props, svgToImage, handleMapClick } = this;

    map.on('load', () => {

      svgToImage(fallLeaf, 20, 20).then(fallMarker => {
        // add image
        const markerName = FALL_MARKER_ID;
        map.addImage(markerName, fallMarker);

        dataset.forEach((item) => {
          // add datasets and layers
          map.addSource(item.id, {
            type: 'geojson',
            data: item.data
          });

          // add symbol layer
          map.addLayer({
            id: item.id,
            type: 'symbol',
            source: item.id,
            layout: {
              'icon-image': markerName,
              'icon-allow-overlap': true,
              visibility: item.id === GEORGIA_OCTOBER ? 'visible' : 'none'
            }
          });
        });

        map.on('click', handleMapClick);

        // ready action dispatched to update the DOM
        props.mapReady();
      }).catch(err => {
        console.log(`error loading image: ${err}`);
      });
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.map) {
      return;
    }

    const { month } = this.props;
    if (month === OCTOBER) {
      this.map.setLayoutProperty(GEORGIA_OCTOBER, 'visibility', 'visible');
      this.map.setLayoutProperty(GEORGIA_NOVEMBER, 'visibility', 'none');
      return;
    }

    this.map.setLayoutProperty(GEORGIA_OCTOBER, 'visibility', 'none');
    this.map.setLayoutProperty(GEORGIA_NOVEMBER, 'visibility', 'visible');
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

  handleMonthChange(event) {
    if (this.props.month === event.target.value) {
      return;
    }

    this.props.monthChanged(event.target.value);
  }

  handleMapClick(event) {
    const features = this.map.queryRenderedFeatures(event.point);
    if (!(features && features.length)) {
      return;
    }

    const feature = features[0];
    const { id, title } = feature.properties;
    const { coordinates } = feature.geometry;
    if (!(typeof id === 'number' && title && coordinates.length === 2)) {
      return;
    }

    new mapboxgl.Popup({
      anchor: 'bottom',
      offset: [0, -15],
      className: 'map__popup',
    })
      .setLngLat(coordinates)
      .setHTML(ReactDOMServer.renderToString(<MarkerPopup title={title} />))
      .addTo(this.map);

    // scrolling to selected point - important that this is the last operation to the handler
    this.props.pointSelected(id);
  }

  render() {
    const { isLoading, month, selected } = this.props;

    return (
      <div className="app">
        <Sidebar dataset={month === OCTOBER ? peakOctober : peakNovember} selected={selected} />
        <section ref={this.mapContainer} className="map">
          <p className={isLoading ? 'loading' : 'hidden'}>Loading...</p>
          <MonthFilter activeMonth={month} handleMonthChange={this.handleMonthChange} />
        </section>
      </div>
    );
  }
}

// Redux connected App
export default connect(mapStateToProps, mapDispatchToProps)(App);
