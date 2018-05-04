import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form'

import {
    dialogs,
    saved,
    document,
    wizard } from './reducers';


const appReducer: Reducer<any> = combineReducers<any>({
    routing,
    form,
    dialogs,
    saved,
    document,
    wizard
});



export default appReducer;
