
const defaultState = {
    lat: 33.753746,
    lng: -84.386330,
    zoom: 9
};

const geoReducer = (state = defaultState, action) => {
    const nextState = {...state};
    switch(action.type) {
        default:
            return nextState;
    }
};

export default geoReducer;