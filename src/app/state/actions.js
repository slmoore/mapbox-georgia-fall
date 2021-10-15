export const MONTH_CHANGED = 'MONTH_CHANGED';
export const actionMonthChanged = (data) => {
    return {
        type: MONTH_CHANGED,
        payload: data
    }
}

export const POINT_SELECTED = 'POINT_SELECTED';
export const actionPointSelected = (data) => {
    return {
        type: POINT_SELECTED,
        payload: data
    }
};

export const FULLSCREEN = 'FULLSCREEN';
export const actionFullscreen = (status) => {
    return {
        type: FULLSCREEN,
        payload: status
    }
}

export const EXIT_FULLSCREEN = 'EXIT_FULLSCREEN';
export const actionExitFullscreen = (status) => {
    return {
        type: EXIT_FULLSCREEN,
        payload: status
    }
}
