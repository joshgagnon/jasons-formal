"use strict";
var React = require('react');
var react_router_1 = require('react-router');
var app_1 = require('../components/app');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function () {
    return (React.createElement(react_router_1.Route, {path: '/', component: app_1.default}));
};
