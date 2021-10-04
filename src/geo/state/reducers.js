import { GEORGIA_LAT_LNG, MAP_ZOOM, OCTOBER } from "../../constants";
import { READY, MONTH_CHANGED, POINT_SELECTED } from "./actions";

const defaultState = {
    lat: GEORGIA_LAT_LNG[0],
    lng: GEORGIA_LAT_LNG[1],
    zoom: MAP_ZOOM,
    isLoading: true,
    month: OCTOBER,
    selected: 0
};

const geoReducer = (state = defaultState, action) => {
    const nextState = {...state};
    switch(action.type) {
        case READY:
            nextState.isLoading = false;
            return nextState;
        case MONTH_CHANGED:
            nextState.month = action.payload;
            return nextState;
        case POINT_SELECTED:
            nextState.selected = action.payload;
            return nextState;
        default:
            return nextState;
    }
};

export default geoReducer;