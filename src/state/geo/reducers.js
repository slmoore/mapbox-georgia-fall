import { MOVED, READY } from "./actions";

const defaultState = {
    lat: 33.753746,
    lng: -84.386330,
    zoom: 9,
    isLoading: true,
};

const geoReducer = (state = defaultState, action) => {
    const nextState = {...state};
    switch(action.type) {
        case READY:
            nextState.isLoading = false;
            return nextState;
        case MOVED: {
            const {lat, lng, zoom} = action.payload;
            nextState.lat = lat;
            nextState.lng = lng;
            nextState.zoom = zoom;
            return nextState;
        }
        default:
            return nextState;
    }
};

export default geoReducer;