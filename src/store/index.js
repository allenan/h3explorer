import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
} from 'redux';
import thunk from 'redux-thunk';

import { explorerReducer } from './reducer';

const composeEnhancer =
    process.env.NODE_ENV === "production"
        ? compose
        : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    explorer: explorerReducer,
});

const store = createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(thunk))
);

export default store;
