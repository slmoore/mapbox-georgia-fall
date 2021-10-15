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