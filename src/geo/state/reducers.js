import { GEORGIA_LAT_LNG, MAP_ZOOM } from "../../constants";
import { NOT_SUPPORTED, READY } from "./actions";

const defaultState = {
    lat: GEORGIA_LAT_LNG[0],
    lng: GEORGIA_LAT_LNG[1],
    zoom: MAP_ZOOM,
    isLoading: true,
    isSupported: true
};

const geoReducer = (state = defaultState, action) => {
    const nextState = {...state};
    switch(action.type) {
        case READY:
            nextState.isLoading = false;
            return nextState;
        case NOT_SUPPORTED:
            nextState.isLoading = false;
            nextState.isSupported = false;
            return nextState;
        default:
            return nextState;
    }
};

export default geoReducer;