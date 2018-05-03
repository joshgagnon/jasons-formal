"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function render(payload) {
    return {
        type: "@@JASONS_FORMAL/RENDER" /* RENDER */,
        payload: payload
    };
}
exports.render = render;
function download(payload) {
    return {
        type: "@@JASONS_FORMAL/DOWNLOAD" /* DOWNLOAD */,
        payload: payload
    };
}
exports.download = download;
function updateRender(payload) {
    return {
        type: "@@JASONS_FORMAL/UPDATE_RENDER" /* UPDATE_RENDER */,
        payload: payload
    };
}
exports.updateRender = updateRender;
function showSave() {
    return {
        type: "@@JASONS_FORMAL/SHOW_SAVE" /* SHOW_SAVE */,
        payload: null
    };
}
exports.showSave = showSave;
function hideSave() {
    return {
        type: "@@JASONS_FORMAL/HIDE_SAVE" /* HIDE_SAVE */,
        payload: null
    };
}
exports.hideSave = hideSave;
function showLoad() {
    return {
        type: "@@JASONS_FORMAL/SHOW_LOAD" /* SHOW_LOAD */,
        payload: null
    };
}
exports.showLoad = showLoad;
function hideLoad() {
    return {
        type: "@@JASONS_FORMAL/HIDE_LOAD" /* HIDE_LOAD */,
        payload: null
    };
}
exports.hideLoad = hideLoad;
function showRestore() {
    return {
        type: "@@JASONS_FORMAL/SHOW_RESTORE" /* SHOW_RESTORE */,
        payload: null
    };
}
exports.showRestore = showRestore;
function hideRestore() {
    return {
        type: "@@JASONS_FORMAL/HIDE_RESTORE" /* HIDE_RESTORE */,
        payload: null
    };
}
exports.hideRestore = hideRestore;
function showConfirmation(payload) {
    return {
        type: "@@JASONS_FORMAL/SHOW_CONFIRMATION" /* SHOW_CONFIRMATION */,
        payload: payload
    };
}
exports.showConfirmation = showConfirmation;
function hideConfirmation(payload) {
    return {
        type: "@@JASONS_FORMAL/HIDE_CONFIRMATION" /* HIDE_CONFIRMATION */,
        payload: payload
    };
}
exports.hideConfirmation = hideConfirmation;
function showPreview(payload) {
    return {
        type: "@@JASONS_FORMAL/SHOW_PREVIEW" /* SHOW_PREVIEW */,
        payload: payload
    };
}
exports.showPreview = showPreview;
function hidePreview(payload) {
    return {
        type: "@@JASONS_FORMAL/HIDE_PREVIEW" /* HIDE_PREVIEW */,
        payload: payload
    };
}
exports.hidePreview = hidePreview;
function showComplete(payload) {
    return {
        type: "@@JASONS_FORMAL/SHOW_COMPLETE" /* SHOW_COMPLETE */,
        payload: payload
    };
}
exports.showComplete = showComplete;
function hideComplete(payload) {
    return {
        type: "@@JASONS_FORMAL/HIDE_COMPLETE" /* HIDE_COMPLETE */,
        payload: payload
    };
}
exports.hideComplete = hideComplete;
function requestSavedList(payload) {
    return {
        type: "@@JASONS_FORMAL/REQUEST_SAVED_LIST" /* REQUEST_SAVED_LIST */,
        payload: payload
    };
}
exports.requestSavedList = requestSavedList;
function updateSavedList(payload) {
    return {
        type: "@@JASONS_FORMAL/UPDATE_SAVED_LIST" /* UPDATE_SAVED_LIST */,
        payload: payload
    };
}
exports.updateSavedList = updateSavedList;
function saveState(payload) {
    return {
        type: "@@JASONS_FORMAL/SAVE_STATE" /* SAVE_STATE */,
        payload: payload
    };
}
exports.saveState = saveState;
function loadState(payload) {
    return {
        type: "@@JASONS_FORMAL/LOAD_STATE" /* LOAD_STATE */,
        payload: payload
    };
}
exports.loadState = loadState;
function deleteState(payload) {
    return {
        type: "@@JASONS_FORMAL/DELETE_STATE" /* DELETE_STATE */,
        payload: payload
    };
}
exports.deleteState = deleteState;
function setWizardPage(payload) {
    return {
        type: "@@JASONS_FORMAL/SET_WIZARD_PAGE" /* SET_WIZARD_PAGE */,
        payload: payload
    };
}
exports.setWizardPage = setWizardPage;
//# sourceMappingURL=index.js.map