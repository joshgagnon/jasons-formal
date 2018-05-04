"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.document = function (state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case "@@JASONS_FORMAL/UPDATE_RENDER" /* UPDATE_RENDER */:
            return __assign({}, state, action.payload);
    }
    return state;
};
exports.dialogs = function (state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case "@@JASONS_FORMAL/SHOW_CONFIRMATION" /* SHOW_CONFIRMATION */:
            return __assign({}, state, { showing: 'confirmation', confirmation: action.payload });
        case "@@JASONS_FORMAL/HIDE_CONFIRMATION" /* HIDE_CONFIRMATION */:
            return __assign({}, state, { showing: null, confirmation: null });
        case "@@JASONS_FORMAL/SHOW_SAVE" /* SHOW_SAVE */:
            return __assign({}, state, { showing: 'save' });
        case "@@JASONS_FORMAL/HIDE_SAVE" /* HIDE_SAVE */:
            return __assign({}, state, { showing: null });
        case "@@JASONS_FORMAL/SHOW_LOAD" /* SHOW_LOAD */:
            return __assign({}, state, { showing: 'load' });
        case "@@JASONS_FORMAL/HIDE_LOAD" /* HIDE_LOAD */:
            return __assign({}, state, { showing: null });
        case "@@JASONS_FORMAL/SHOW_RESTORE" /* SHOW_RESTORE */:
            return __assign({}, state, { showing: 'restore' });
        case "@@JASONS_FORMAL/HIDE_RESTORE" /* HIDE_RESTORE */:
            return __assign({}, state, { showing: null });
        case "@@JASONS_FORMAL/SHOW_PREVIEW" /* SHOW_PREVIEW */:
            return __assign({}, state, { showing: 'preview' });
        case "@@JASONS_FORMAL/HIDE_PREVIEW" /* HIDE_PREVIEW */:
            return __assign({}, state, { showing: null });
        case "@@JASONS_FORMAL/SHOW_COMPLETE" /* SHOW_COMPLETE */:
            return __assign({}, state, { showing: 'complete' });
        case "@@JASONS_FORMAL/HIDE_COMPLETE" /* HIDE_COMPLETE */:
            return __assign({}, state, { showing: null });
    }
    return state;
};
exports.saved = function (state, action) {
    if (state === void 0) { state = { list: [] }; }
    switch (action.type) {
        case "@@JASONS_FORMAL/UPDATE_SAVED_LIST" /* UPDATE_SAVED_LIST */:
            return __assign({}, action.payload);
    }
    return state;
};
exports.wizard = function (state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case "@@JASONS_FORMAL/SET_WIZARD_PAGE" /* SET_WIZARD_PAGE */:
            return __assign({}, state, (_a = {}, _a[action.payload.name] = { page: action.payload.page }, _a));
    }
    return state;
    var _a;
};
//# sourceMappingURL=reducers.js.map