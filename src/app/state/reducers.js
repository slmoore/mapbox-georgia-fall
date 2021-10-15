import { COMPLETE, OCTOBER } from "../../constants";
import dataset from "../../geo/data/GeorgiaFallData";
import { MONTH_CHANGED, POINT_SELECTED, FULLSCREEN, EXIT_FULLSCREEN } from "./actions";

const defaultState = {
    month: OCTOBER,
    selected: 0,
    dataset,
    isFullscreen: false,
    fullscreenStatus: COMPLETE,
    exitFullscreenStatus: COMPLETE
};

const appReducer = (state = defaultState, action) => {
    const nextState = {...state};
    switch(action.type) {
        case MONTH_CHANGED:
            nextState.month = action.payload;
            nextState.selected = state.dataset[action.payload].features[0].properties.id;
            return nextState;
        case POINT_SELECTED:
            nextState.selected = action.payload;
            return nextState;
        case FULLSCREEN:
            nextState.fullscreenStatus = action.payload;
            nextState.isFullscreen = action.payload === COMPLETE ? true : false;
            return nextState;
        case EXIT_FULLSCREEN:
            nextState.exitFullscreenStatus = action.payload;
            nextState.isFullscreen = action.payload === COMPLETE ? true : false;
            return nextState;
        default:
            return nextState;
    }
};

export default appReducer;