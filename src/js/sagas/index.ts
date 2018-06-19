import { select, takeEvery, put, take, call, all } from 'redux-saga/effects';
import { SagaMiddleware, delay, eventChannel, END } from 'redux-saga';
import * as Axios from 'axios';
import { initialize } from 'redux-form';
import axios from 'axios';
import { updateRender, updateSavedList, requestSavedList, hideComplete } from '../actions';
import * as Filesaver from 'file-saver';





export function *renderSaga() : any {
    yield takeEvery(Jason.Actions.Types.RENDER, render);
    function *render(action: Jason.Actions.Render) {
        yield put(updateRender({
            downloadStatus: Jason.DownloadStatus.InProgress
        }));
        let data;
        try {
            const response = yield call(axios.post, `/api/render`, action.payload.data, {responseType: 'arraybuffer' });
            data = response.data;
            yield put(updateRender({
                downloadStatus: Jason.DownloadStatus.Complete,
                data
            }));

        } catch(e) {
            yield put(updateRender({
                downloadStatus: Jason.DownloadStatus.Failed,
            }));
        }
    }
}


export function *downloadSaga() : any {
    yield takeEvery(Jason.Actions.Types.DOWNLOAD, render);
    function *render(action: Jason.Actions.Render) {
        yield put(updateRender({
            downloadStatus: Jason.DownloadStatus.InProgress
        }));
        let data = action.payload as any, response;
        try {

            if(data.documentsToAppend){
                const body = new FormData();
                const json = {...data, documentsToAppend: null};
                body.append('json', JSON.stringify(json));
                data.documentsToAppend.map((d: any, index: number) => {
                    if(d.id){
                        body.append('existingDocumentsToAppend[]', JSON.stringify({...d, index }));
                    }
                    else{
                        body.append('documentsToAppend[]', d, d.name);
                    }
                });

                response = yield call(axios.post, '/api/render', body, {responseType: 'arraybuffer' });
            }
            else {

                response = yield call(axios.post, '/api/render', data, {responseType: 'arraybuffer' });
            }

            const responseData = response.data;
            yield put(updateRender({
                downloadStatus: Jason.DownloadStatus.Complete,
                data: responseData
            }));

            var blob = new Blob([responseData], {type: response.headers['content-type']});
            const disposition = response.headers['content-disposition'];
            const filename = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)[1].replace(/"/g, '');
            Filesaver.saveAs(blob, filename);
            yield put(hideComplete({}));
        } catch(e) {
            debugger
            yield put(updateRender({
                downloadStatus: Jason.DownloadStatus.Failed,
            }));
        }
    }

}


function *saveSaga() {
    yield takeEvery(Jason.Actions.Types.SAVE_STATE, save);
    function *save(action: Jason.Actions.SaveState) {
        yield put(updateSavedList({
            status: Jason.DownloadStatus.InProgress
        }));
        let data;
        try {
            let response;
            if(action.payload.saved_id){
                response = yield call(axios.put, `/api/saved/${action.payload.saved_id}`, action.payload);
            }
            else{
                response = yield call(axios.post, `/api/saved`, action.payload);

            }
            data = response.data;
            yield put(updateSavedList({
                status: Jason.DownloadStatus.Complete
            }));

        } catch(e) {
            yield put(updateSavedList({
                status: Jason.DownloadStatus.Failed,
            }));
        }
    }

}

function *deleteSaga() {
    yield takeEvery(Jason.Actions.Types.DELETE_STATE, del);
    function *del(action: Jason.Actions.SaveState) {
        yield put(updateSavedList({
            status: Jason.DownloadStatus.InProgress
        }));
        let data;
        try {
            let response = yield call(axios.delete, `/api/saved/${action.payload.saved_id}`, action.payload);
            data = response.data;
            yield put(updateSavedList({
                status: Jason.DownloadStatus.Complete
            }));

        } catch(e) {
            yield put(updateSavedList({
                status: Jason.DownloadStatus.Failed,
            }));
        }
            yield put(requestSavedList({
            }));
    }

}

function *loadSaga() {
    yield takeEvery(Jason.Actions.Types.LOAD_STATE, load);
    function *load(action: Jason.Actions.LoadState) {
        yield put(updateSavedList({
            status: Jason.DownloadStatus.InProgress
        }));
        let data;
        try {
            let response = yield call(axios.get, `/api/saved/${action.payload.saved_id}`);
            data = response.data;

            yield put(updateSavedList({
                status: Jason.DownloadStatus.Complete
            }));
            if(data && data.data){
                yield put(initialize('formLoader', data.data));
            }

        } catch(e) {
            yield put(updateSavedList({
                status: Jason.DownloadStatus.Failed,
            }));
        }
    }
}

function *savedListSaga() {
    yield takeEvery(Jason.Actions.Types.REQUEST_SAVED_LIST, handle);
    function *handle(action: Jason.Actions.RequestSavedList) {
        yield put(updateSavedList({
            status: Jason.DownloadStatus.InProgress
        }));
        let data;
        try {
            const response = yield call(axios.get, `/api/saved`);
            data = response.data;
            yield put(updateSavedList({
                status: Jason.DownloadStatus.Complete,
                list: data
            }));

        } catch(e) {
            yield put(updateSavedList({
                status: Jason.DownloadStatus.Failed,
            }));
        }
    }
}

export default function *rootSaga(): any {
    yield all([
        renderSaga(),
        downloadSaga(),
    ]);
}
