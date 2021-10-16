import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux'
import App from './app/components/App';
import appReducer from './app/state/reducers';
import geoReducer from './geo/state/reducers';
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import thunk from 'redux-thunk';
import Amplify from 'aws-amplify';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

const store = createStore(combineReducers({
    app: appReducer,
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
