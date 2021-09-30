
export const READY = 'READY';
export const actionReady = () => {
    return {
        type: READY,
    }
};

export const MOVED = 'MOVED';
export const actionMoved = (data) => {
    return {
        type: MOVED,
        payload: data,
    }
};
