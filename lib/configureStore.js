"use strict";
exports.__esModule = true;
var redux_1 = require("redux");
var reducers_1 = require("./reducers");
var react_router_redux_1 = require("react-router-redux");
var redux_logger_1 = require("redux-logger");
var redux_saga_1 = require("redux-saga");
var sagas_1 = require("./sagas");
// using any for history due to changes in ts definition
function configureStore(history, initialState) {
    if (initialState === void 0) { initialState = {}; }
    var loggerMiddleware = redux_logger_1.createLogger();
    var sagaMiddleware = redux_saga_1["default"]();
    var middleware = DEV ? redux_1.applyMiddleware(sagaMiddleware, loggerMiddleware, react_router_redux_1.routerMiddleware(history)) : redux_1.applyMiddleware(sagaMiddleware, react_router_redux_1.routerMiddleware(history));
    var createStoreWithMiddleware = redux_1.compose(middleware)(redux_1.createStore);
    var store = createStoreWithMiddleware(reducers_1["default"], initialState);
    sagaMiddleware.run(sagas_1["default"]);
    return store;
}
exports["default"] = configureStore;
