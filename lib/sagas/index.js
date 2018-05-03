"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var effects_1 = require("redux-saga/effects");
var redux_form_1 = require("redux-form");
var axios_1 = require("axios");
var actions_1 = require("../actions");
var Filesaver = require("file-saver");
function rootSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.all([
                    renderSaga(),
                    downloadSaga(),
                ])];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.default = rootSaga;
function renderSaga() {
    function render(action) {
        var data, response, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects_1.put(actions_1.updateRender({
                        downloadStatus: 1 /* InProgress */
                    }))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 7]);
                    return [4 /*yield*/, effects_1.call(axios_1.default.post, "/api/render", action.payload.data, { responseType: 'arraybuffer' })];
                case 3:
                    response = _a.sent();
                    data = response.data;
                    return [4 /*yield*/, effects_1.put(actions_1.updateRender({
                            downloadStatus: 2 /* Complete */,
                            data: data
                        }))];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5:
                    e_1 = _a.sent();
                    return [4 /*yield*/, effects_1.put(actions_1.updateRender({
                            downloadStatus: 3 /* Failed */,
                        }))];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.takeEvery("@@JASONS_FORMAL/RENDER" /* RENDER */, render)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function downloadSaga() {
    function render(action) {
        var data, response, blob, disposition, filename, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects_1.put(actions_1.updateRender({
                        downloadStatus: 1 /* InProgress */
                    }))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, , 8]);
                    return [4 /*yield*/, effects_1.call(axios_1.default.post, "/api/render", action.payload, { responseType: 'arraybuffer' })];
                case 3:
                    response = _a.sent();
                    data = response.data;
                    return [4 /*yield*/, effects_1.put(actions_1.updateRender({
                            downloadStatus: 2 /* Complete */,
                            data: data
                        }))];
                case 4:
                    _a.sent();
                    blob = new Blob([data], { type: response.headers['content-type'] });
                    disposition = response.headers['content-disposition'];
                    filename = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)[1].replace(/"/g, '');
                    Filesaver.saveAs(blob, filename);
                    return [4 /*yield*/, effects_1.put(actions_1.hideComplete({}))];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 6:
                    e_2 = _a.sent();
                    debugger;
                    return [4 /*yield*/, effects_1.put(actions_1.updateRender({
                            downloadStatus: 3 /* Failed */,
                        }))];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.takeEvery("@@JASONS_FORMAL/DOWNLOAD" /* DOWNLOAD */, render)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function saveSaga() {
    function save(action) {
        var data, response, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects_1.put(actions_1.updateSavedList({
                        status: 1 /* InProgress */
                    }))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 8, , 10]);
                    response = void 0;
                    if (!action.payload.saved_id) return [3 /*break*/, 4];
                    return [4 /*yield*/, effects_1.call(axios_1.default.put, "/api/saved/" + action.payload.saved_id, action.payload)];
                case 3:
                    response = _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, effects_1.call(axios_1.default.post, "/api/saved", action.payload)];
                case 5:
                    response = _a.sent();
                    _a.label = 6;
                case 6:
                    data = response.data;
                    return [4 /*yield*/, effects_1.put(actions_1.updateSavedList({
                            status: 2 /* Complete */
                        }))];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 8:
                    e_3 = _a.sent();
                    return [4 /*yield*/, effects_1.put(actions_1.updateSavedList({
                            status: 3 /* Failed */,
                        }))];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.takeEvery("@@JASONS_FORMAL/SAVE_STATE" /* SAVE_STATE */, save)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function deleteSaga() {
    function del(action) {
        var data, response, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects_1.put(actions_1.updateSavedList({
                        status: 1 /* InProgress */
                    }))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 7]);
                    return [4 /*yield*/, effects_1.call(axios_1.default.delete, "/api/saved/" + action.payload.saved_id, action.payload)];
                case 3:
                    response = _a.sent();
                    data = response.data;
                    return [4 /*yield*/, effects_1.put(actions_1.updateSavedList({
                            status: 2 /* Complete */
                        }))];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5:
                    e_4 = _a.sent();
                    return [4 /*yield*/, effects_1.put(actions_1.updateSavedList({
                            status: 3 /* Failed */,
                        }))];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 7: return [4 /*yield*/, effects_1.put(actions_1.requestSavedList({}))];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.takeEvery("@@JASONS_FORMAL/DELETE_STATE" /* DELETE_STATE */, del)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function loadSaga() {
    function load(action) {
        var data, response, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects_1.put(actions_1.updateSavedList({
                        status: 1 /* InProgress */
                    }))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, , 9]);
                    return [4 /*yield*/, effects_1.call(axios_1.default.get, "/api/saved/" + action.payload.saved_id)];
                case 3:
                    response = _a.sent();
                    data = response.data;
                    return [4 /*yield*/, effects_1.put(actions_1.updateSavedList({
                            status: 2 /* Complete */
                        }))];
                case 4:
                    _a.sent();
                    if (!(data && data.data)) return [3 /*break*/, 6];
                    return [4 /*yield*/, effects_1.put(redux_form_1.initialize('formLoader', data.data))];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [3 /*break*/, 9];
                case 7:
                    e_5 = _a.sent();
                    return [4 /*yield*/, effects_1.put(actions_1.updateSavedList({
                            status: 3 /* Failed */,
                        }))];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.takeEvery("@@JASONS_FORMAL/LOAD_STATE" /* LOAD_STATE */, load)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function savedListSaga() {
    function handle(action) {
        var data, response, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects_1.put(actions_1.updateSavedList({
                        status: 1 /* InProgress */
                    }))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 7]);
                    return [4 /*yield*/, effects_1.call(axios_1.default.get, "/api/saved")];
                case 3:
                    response = _a.sent();
                    data = response.data;
                    return [4 /*yield*/, effects_1.put(actions_1.updateSavedList({
                            status: 2 /* Complete */,
                            list: data
                        }))];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5:
                    e_6 = _a.sent();
                    return [4 /*yield*/, effects_1.put(actions_1.updateSavedList({
                            status: 3 /* Failed */,
                        }))];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.takeEvery("@@JASONS_FORMAL/REQUEST_SAVED_LIST" /* REQUEST_SAVED_LIST */, handle)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
//# sourceMappingURL=index.js.map