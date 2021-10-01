import { GEORGIA_LAT_LNG, MAP_ZOOM } from "../../constants";
import { MOVED, READY } from "./actions";

const defaultState = {
    lat: GEORGIA_LAT_LNG[0],
    lng: GEORGIA_LAT_LNG[1],
    zoom: MAP_ZOOM,
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