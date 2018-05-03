"use strict";
var effects_1 = require('redux-saga/effects');
var redux_form_1 = require('redux-form');
var axios_1 = require('axios');
var actions_1 = require('../actions');
var Filesaver = require('file-saver');
function rootSaga() {
    yield effects_1.all([
        renderSaga(),
        downloadSaga(),
    ]);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = rootSaga;
function renderSaga() {
    yield effects_1.takeEvery(Jason.Actions.Types.RENDER, render);
    function render(action) {
        yield effects_1.put(actions_1.updateRender({
            downloadStatus: Jason.DownloadStatus.InProgress
        }));
        var data;
        try {
            var response = yield effects_1.call(axios_1.default.post, "/api/render", action.payload.data, { responseType: 'arraybuffer' });
            data = response.data;
            yield effects_1.put(actions_1.updateRender({
                downloadStatus: Jason.DownloadStatus.Complete,
                data: data
            }));
        }
        catch (e) {
            yield effects_1.put(actions_1.updateRender({
                downloadStatus: Jason.DownloadStatus.Failed,
            }));
        }
    }
}
function downloadSaga() {
    yield effects_1.takeEvery(Jason.Actions.Types.DOWNLOAD, render);
    function render(action) {
        yield effects_1.put(actions_1.updateRender({
            downloadStatus: Jason.DownloadStatus.InProgress
        }));
        var data;
        try {
            var response = yield effects_1.call(axios_1.default.post, "/api/render", action.payload, { responseType: 'arraybuffer' });
            data = response.data;
            yield effects_1.put(actions_1.updateRender({
                downloadStatus: Jason.DownloadStatus.Complete,
                data: data
            }));
            var blob = new Blob([data], { type: response.headers['content-type'] });
            var disposition = response.headers['content-disposition'];
            var filename = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)[1].replace(/"/g, '');
            Filesaver.saveAs(blob, filename);
            yield effects_1.put(actions_1.hideComplete({}));
        }
        catch (e) {
            debugger;
            yield effects_1.put(actions_1.updateRender({
                downloadStatus: Jason.DownloadStatus.Failed,
            }));
        }
    }
}
function saveSaga() {
    yield effects_1.takeEvery(Jason.Actions.Types.SAVE_STATE, save);
    function save(action) {
        yield effects_1.put(actions_1.updateSavedList({
            status: Jason.DownloadStatus.InProgress
        }));
        var data;
        try {
            var response = void 0;
            if (action.payload.saved_id) {
                response = yield effects_1.call(axios_1.default.put, "/api/saved/" + action.payload.saved_id, action.payload);
            }
            else {
                response = yield effects_1.call(axios_1.default.post, "/api/saved", action.payload);
            }
            data = response.data;
            yield effects_1.put(actions_1.updateSavedList({
                status: Jason.DownloadStatus.Complete
            }));
        }
        catch (e) {
            yield effects_1.put(actions_1.updateSavedList({
                status: Jason.DownloadStatus.Failed,
            }));
        }
    }
}
function deleteSaga() {
    yield effects_1.takeEvery(Jason.Actions.Types.DELETE_STATE, del);
    function del(action) {
        yield effects_1.put(actions_1.updateSavedList({
            status: Jason.DownloadStatus.InProgress
        }));
        var data;
        try {
            var response = yield effects_1.call(axios_1.default.delete, "/api/saved/" + action.payload.saved_id, action.payload);
            data = response.data;
            yield effects_1.put(actions_1.updateSavedList({
                status: Jason.DownloadStatus.Complete
            }));
        }
        catch (e) {
            yield effects_1.put(actions_1.updateSavedList({
                status: Jason.DownloadStatus.Failed,
            }));
        }
        yield effects_1.put(actions_1.requestSavedList({}));
    }
}
function loadSaga() {
    yield effects_1.takeEvery(Jason.Actions.Types.LOAD_STATE, load);
    function load(action) {
        yield effects_1.put(actions_1.updateSavedList({
            status: Jason.DownloadStatus.InProgress
        }));
        var data;
        try {
            var response = yield effects_1.call(axios_1.default.get, "/api/saved/" + action.payload.saved_id);
            data = response.data;
            yield effects_1.put(actions_1.updateSavedList({
                status: Jason.DownloadStatus.Complete
            }));
            if (data && data.data) {
                yield effects_1.put(redux_form_1.initialize('formLoader', data.data));
            }
        }
        catch (e) {
            yield effects_1.put(actions_1.updateSavedList({
                status: Jason.DownloadStatus.Failed,
            }));
        }
    }
}
function savedListSaga() {
    yield effects_1.takeEvery(Jason.Actions.Types.REQUEST_SAVED_LIST, handle);
    function handle(action) {
        yield effects_1.put(actions_1.updateSavedList({
            status: Jason.DownloadStatus.InProgress
        }));
        var data;
        try {
            var response = yield effects_1.call(axios_1.default.get, "/api/saved");
            data = response.data;
            yield effects_1.put(actions_1.updateSavedList({
                status: Jason.DownloadStatus.Complete,
                list: data
            }));
        }
        catch (e) {
            yield effects_1.put(actions_1.updateSavedList({
                status: Jason.DownloadStatus.Failed,
            }));
        }
    }
}
