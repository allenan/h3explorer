import { UPDATE_INDEXES } from '../action/action';

const initialState = {
    indexes: null
}
export const explorerReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_INDEXES:
            return {
                ...state, indexes: action.payload
            }
        default:
            return state;
    }
}