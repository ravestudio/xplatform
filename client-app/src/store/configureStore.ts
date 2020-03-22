import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { reducer as formReducer } from 'redux-form'
import { History } from 'history';
import { ApplicationState, reducers } from './'


export default function configureStore(history: History, initialState?: any) {

    const middleware = [
        thunk,
        routerMiddleware(history)
    ];

    const enhancers = [];
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
        enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
    }

    const rootReducer = combineReducers({
        ...reducers,
        router: connectRouter(history),
        form: formReducer
    });

    return createStore(rootReducer, initialState, compose(applyMiddleware(...middleware), ...enhancers))

}