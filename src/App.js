
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Component } from 'react';
import './App.css';
import { MAP_STYLE, MAP_TOKEN } from './constants';





class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.createMap(MAP_TOKEN, 'map', MAP_STYLE);
  }

  createMap(token, container, style) {
    mapboxgl.accessToken = token;
    this.map = new mapboxgl.Map({
      container,
      style
    });
    console.log(this.map);
  }

  render() {
    // ! is this the correct way to assign an id to a JSX element which can be used by an API like mapbox?
    return (
      <div>
        <div id="map" className="map"></div>
        <p className="description">Map for checkpoints and other features coming soon!</p>
      </div>
    );
  }
}

export default App;
