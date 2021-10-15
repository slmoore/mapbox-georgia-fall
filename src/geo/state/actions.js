export const READY = 'READY';
export const actionReady = () => {
    return {
        type: READY,
    }
};

export const NOT_SUPPORTED = 'NOT_SUPPORTED';
export const actionNotSupported = () => {
    return {
        type: NOT_SUPPORTED,
    }
}

export const ERROR = 'ERROR';
export const actionError = () => {
    return {
        type: ERROR,
    }
}

export const FETCH_START = 'FETCH_START';
export const actionFetchStart = () => {
    return {
        type: FETCH_START
    }
}

export const FETCH_COMPLETE = 'FETCH_COMPLETE';
export const thunkGetMapMeta = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(actionFetchStart());
            const response = await fetch('/mbgf')
            const data = await response.json();
            dispatch({ type: FETCH_COMPLETE, payload: data});
        } catch (error) {
            console.log(error);
            dispatch({ type: FETCH_COMPLETE, payload: null});            
        }
    }
}