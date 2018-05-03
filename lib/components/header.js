"use strict";
var React = require('react');
var react_bootstrap_1 = require('react-bootstrap');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function () {
    return React.createElement(react_bootstrap_1.Navbar, {collapseOnSelect: true}, 
        React.createElement(react_bootstrap_1.Navbar.Header, null, 
            React.createElement(react_bootstrap_1.Navbar.Brand, null, 
                React.createElement("a", {href: "#home"})
            )
        ), 
        React.createElement(react_bootstrap_1.Nav, {pullRight: true}, 
            React.createElement(react_bootstrap_1.NavItem, {eventKey: 1, href: "#"}, "Log In")
        ));
};
