"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var root_1 = require("./root");
var configureStore_1 = require("./configureStore");
var react_router_1 = require("react-router");
var react_router_redux_1 = require("react-router-redux");
var store = configureStore_1.default(react_router_1.browserHistory, {});
var history = react_router_redux_1.syncHistoryWithStore(react_router_1.browserHistory, store);
ReactDOM.render(React.createElement(root_1.default, { store: store, history: history }), document.getElementById('main'));
//# sourceMappingURL=main.js.map