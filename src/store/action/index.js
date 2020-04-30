import { UPDATE_INDEXES } from './action';

export const updateIndexes = payload => dispatch => {
    dispatch({
        type: UPDATE_INDEXES,
        payload
    });
}