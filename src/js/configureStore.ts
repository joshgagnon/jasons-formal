import { createStore, applyMiddleware, compose} from 'redux';
import rootReducer from './reducers';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';

// using any for history due to changes in ts definition
export default function configureStore(history :any, initialState={}) {
    const loggerMiddleware = createLogger();


    const middleware =  DEV ?  applyMiddleware(
        loggerMiddleware,
        routerMiddleware(history)
    ) : applyMiddleware(
        routerMiddleware(history)
    )

    const createStoreWithMiddleware = compose(middleware)(createStore);
    const store = createStoreWithMiddleware(rootReducer, initialState);


    return store;
}
