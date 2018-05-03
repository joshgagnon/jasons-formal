"use strict";
function render(payload) {
    return {
        type: Jason.Actions.Types.RENDER,
        payload: payload
    };
}
exports.render = render;
function download(payload) {
    return {
        type: Jason.Actions.Types.DOWNLOAD,
        payload: payload
    };
}
exports.download = download;
function updateRender(payload) {
    return {
        type: Jason.Actions.Types.UPDATE_RENDER,
        payload: payload
    };
}
exports.updateRender = updateRender;
function showSave() {
    return {
        type: Jason.Actions.Types.SHOW_SAVE,
        payload: null
    };
}
exports.showSave = showSave;
function hideSave() {
    return {
        type: Jason.Actions.Types.HIDE_SAVE,
        payload: null
    };
}
exports.hideSave = hideSave;
function showLoad() {
    return {
        type: Jason.Actions.Types.SHOW_LOAD,
        payload: null
    };
}
exports.showLoad = showLoad;
function hideLoad() {
    return {
        type: Jason.Actions.Types.HIDE_LOAD,
        payload: null
    };
}
exports.hideLoad = hideLoad;
function showRestore() {
    return {
        type: Jason.Actions.Types.SHOW_RESTORE,
        payload: null
    };
}
exports.showRestore = showRestore;
function hideRestore() {
    return {
        type: Jason.Actions.Types.HIDE_RESTORE,
        payload: null
    };
}
exports.hideRestore = hideRestore;
function showConfirmation(payload) {
    return {
        type: Jason.Actions.Types.SHOW_CONFIRMATION,
        payload: payload
    };
}
exports.showConfirmation = showConfirmation;
function hideConfirmation(payload) {
    return {
        type: Jason.Actions.Types.HIDE_CONFIRMATION,
        payload: payload
    };
}
exports.hideConfirmation = hideConfirmation;
function showPreview(payload) {
    return {
        type: Jason.Actions.Types.SHOW_PREVIEW,
        payload: payload
    };
}
exports.showPreview = showPreview;
function hidePreview(payload) {
    return {
        type: Jason.Actions.Types.HIDE_PREVIEW,
        payload: payload
    };
}
exports.hidePreview = hidePreview;
function showComplete(payload) {
    return {
        type: Jason.Actions.Types.SHOW_COMPLETE,
        payload: payload
    };
}
exports.showComplete = showComplete;
function hideComplete(payload) {
    return {
        type: Jason.Actions.Types.HIDE_COMPLETE,
        payload: payload
    };
}
exports.hideComplete = hideComplete;
function requestSavedList(payload) {
    return {
        type: Jason.Actions.Types.REQUEST_SAVED_LIST,
        payload: payload
    };
}
exports.requestSavedList = requestSavedList;
function updateSavedList(payload) {
    return {
        type: Jason.Actions.Types.UPDATE_SAVED_LIST,
        payload: payload
    };
}
exports.updateSavedList = updateSavedList;
function saveState(payload) {
    return {
        type: Jason.Actions.Types.SAVE_STATE,
        payload: payload
    };
}
exports.saveState = saveState;
function loadState(payload) {
    return {
        type: Jason.Actions.Types.LOAD_STATE,
        payload: payload
    };
}
exports.loadState = loadState;
function deleteState(payload) {
    return {
        type: Jason.Actions.Types.DELETE_STATE,
        payload: payload
    };
}
exports.deleteState = deleteState;
function setWizardPage(payload) {
    return {
        type: Jason.Actions.Types.SET_WIZARD_PAGE,
        payload: payload
    };
}
exports.setWizardPage = setWizardPage;
