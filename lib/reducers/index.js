"use strict";
var redux_1 = require('redux');
var react_router_redux_1 = require('react-router-redux');
var redux_form_1 = require('redux-form');
var document = function (state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case Jason.Actions.Types.UPDATE_RENDER:
            return { state: state, action: .payload };
    }
    return state;
};
var dialogs = function (state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case Jason.Actions.Types.SHOW_CONFIRMATION:
            return { state: state, showing: 'confirmation', confirmation: action.payload };
        case Jason.Actions.Types.HIDE_CONFIRMATION:
            return { state: state, showing: null, confirmation: null };
        case Jason.Actions.Types.SHOW_SAVE:
            return { state: state, showing: 'save' };
        case Jason.Actions.Types.HIDE_SAVE:
            return { state: state, showing: null };
        case Jason.Actions.Types.SHOW_LOAD:
            return { state: state, showing: 'load' };
        case Jason.Actions.Types.HIDE_LOAD:
            return { state: state, showing: null };
        case Jason.Actions.Types.SHOW_RESTORE:
            return { state: state, showing: 'restore' };
        case Jason.Actions.Types.HIDE_RESTORE:
            return { state: state, showing: null };
        case Jason.Actions.Types.SHOW_PREVIEW:
            return { state: state, showing: 'preview' };
        case Jason.Actions.Types.HIDE_PREVIEW:
            return { state: state, showing: null };
        case Jason.Actions.Types.SHOW_COMPLETE:
            return { state: state, showing: 'complete' };
        case Jason.Actions.Types.HIDE_COMPLETE:
            return { state: state, showing: null };
    }
    return state;
};
var saved = function (state, action) {
    if (state === void 0) { state = { list: [] }; }
    switch (action.type) {
        case Jason.Actions.Types.UPDATE_SAVED_LIST:
            return { action: .payload };
    }
    return state;
};
var wizard = function (state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case Jason.Actions.Types.SET_WIZARD_PAGE:
            return (_a = { state: state }, _a[action.payload.name] = { page: action.payload.page }, _a);
    }
    return state;
    var _a;
};
var appReducer = redux_1.combineReducers({
    routing: react_router_redux_1.routerReducer,
    form: redux_form_1.reducer,
    dialogs: dialogs,
    saved: saved,
    document: document,
    wizard: wizard
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = appReducer;
