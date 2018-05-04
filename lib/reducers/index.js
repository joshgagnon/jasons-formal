"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var react_router_redux_1 = require("react-router-redux");
var redux_form_1 = require("redux-form");
var reducers_1 = require("./reducers");
var appReducer = redux_1.combineReducers({
    routing: react_router_redux_1.routerReducer,
    form: redux_form_1.reducer,
    dialogs: reducers_1.dialogs,
    saved: reducers_1.saved,
    document: reducers_1.document,
    wizard: reducers_1.wizard
});
exports.default = appReducer;
//# sourceMappingURL=index.js.map