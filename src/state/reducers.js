import { OCTOBER } from "../constants";
import dataset from "../geo/data/georgia-fall";
import { MONTH_CHANGED, POINT_SELECTED } from "./actions";

const defaultState = {
    month: OCTOBER,
    selected: 0,
    dataset
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
        default:
            return nextState;
    }
};

export default appReducer;