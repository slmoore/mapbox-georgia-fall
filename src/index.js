import './index.css';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import App from './App';
import geoReducer from './state/geo/reducers';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import reportWebVitals from './reportWebVitals';
import thunk from 'redux-thunk';

const store = createStore(combineReducers({
  geo: geoReducer
}), applyMiddleware(thunk));


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


/**
 * Requirements
 * - must use Redux
 * - must use Mapbox
 * - add running trails to a map of Atlanta
 * - add route highlights to the trails and atlasObscura information 
 * - add elevation colors to the routes
 * - filters by distance
 * - parking for each trail
 * - backpacking toolkit - forms for essentials while packing, templates of decisions to make
 */


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
