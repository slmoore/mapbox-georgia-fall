import { API } from 'aws-amplify';
import { LOCAL, MBGF, APIFUNC } from '../../constants';

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
export const actionFetchComplete = (data) => {
    return {
        type: FETCH_COMPLETE,
        payload: data
    }
}

export const thunkGetMapMeta = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(actionFetchStart());
            let data;
            if (LOCAL) {
                const response = await fetch(`/${MBGF}`);
                data = await response.json();
            } else {
                data = await API.get(MBGF, APIFUNC);
            }
            dispatch(actionFetchComplete(Object.freeze(data)));
        } catch (error) {
            console.log(`LOCAL:${LOCAL} error:${error}`);
            dispatch(actionFetchComplete(null));
        }
    }
}