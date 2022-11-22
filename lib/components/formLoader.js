"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
var redux_form_1 = require("redux-form");
var react_redux_1 = require("react-redux");
var schemas_1 = require("../schemas");
var react_bootstrap_1 = require("react-bootstrap");
var json_schemer_1 = require("json-schemer");
var react_flip_move_1 = require("react-flip-move");
var actions_1 = require("../actions");
var DateTimePicker = require("react-widgets/lib/DateTimePicker");
var DropdownList = require("react-widgets/lib/DropdownList");
var ReactWidgetList = require("react-widgets/lib/List");
var moment = require("moment");
exports.required = function (value) { return (value ? undefined : 'Required'); };
function isCheckbox(enums) {
    return enums.length === 2 && ((enums[0] === false && enums[1] === true) || (enums[1] === false && enums[0] === true));
}
var INITIAL_VALUES = {
    "recipient": { "individuals": [{ "_keyIndex": 1, "firstName": "Test", "surname": "Name" }], "contactMethod": { "method": "email", "address": { "country": "New Zealand" }, "email": "pewpwe@email.com" }, "recipientType": "individuals" }, "matter": { "assets": [{ "_keyIndex": 2, "address": "x", "registry": "z", "uniqueIdentifier": "y" }], "matterId": "234" }, "ratesAndApportionments": [{ "_keyIndex": 8, "type": "rate", "description": "test", "amount": "10000" }, { "_keyIndex": 9, "type": "apportionment", "startDate": "1 May 2018", "endDate": "1 May 2019", "description": "test2", "amount": "1000" }], "senders": [{ "_keyIndex": 3, "email": "asdf", "firstName": "x" }], "copyTo": [], "civNumber": "CIV X", "dateString": "1 May 2018", "defendants": [{ "_keyIndex": 4, "name": "Mike Defendant" }], "depositAmount": "2000", "filename": "Vendors Settlement Statement", "filingFee": { "amount": "323243", "include": true }, "plantiffs": [{ "_keyIndex": 5, "name": "Barry Plantiff" }], "purchaseAmount": "100000", "purchaserNames": [{ "_keyIndex": 6, "name": "purch" }], "settlementStatement": { "levies": { "include": false, "instalmentsPaid": {} }, "rates": { "amount": "1", "annumRate": "1", "days": "1", "instalmentsPaid": { "paid": false }, "localAuthourity": "1" }, "totalAmount": "2", "totalCredits": "1", "totalDebits": "2" }, "vendorNames": [{ "_keyIndex": 7, "name": "vend" }], "settlementDate": "15 June 2018"
};
var DROPDOWN_LIST_SIZE = 0;
var SelectList = /** @class */ (function (_super) {
    __extends(SelectList, _super);
    function SelectList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectList.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            React.createElement(ReactWidgetList, __assign({}, this.props)),
            React.createElement("ul", { className: "rw-list" },
                React.createElement("li", { className: "rw-list-option highlight", onClick: function () { return _this.props.onSelect({}); } }, "Custom")));
    };
    return SelectList;
}(React.PureComponent));
var DropdownSuggestionList = /** @class */ (function (_super) {
    __extends(DropdownSuggestionList, _super);
    function DropdownSuggestionList(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { open: false };
        return _this;
    }
    DropdownSuggestionList.prototype.render = function () {
        var _this = this;
        var open = this.state.open;
        var toggleWidget = function () { return _this.setState({ open: !open }); };
        var showCustom = this.props.showCustom;
        return React.createElement("div", { className: "hide-button" },
            React.createElement(react_bootstrap_1.Button, { onClick: function () { !_this.state.open && _this.setState({ open: true }); } },
                this.props.buttonText || '',
                " ",
                React.createElement("span", { className: "caret" })),
            React.createElement(DropdownList, { open: open, filter: true, data: this.props.data, listComponent: showCustom ? SelectList : ReactWidgetList, textField: 'title', value: '', onToggle: toggleWidget, onSelect: function (e) {
                    _this.props.onSelect(e.value);
                    _this.setState({ open: false });
                } }));
    };
    return DropdownSuggestionList;
}(React.PureComponent));
var OverlayMenuItem = function (props) {
    var key = props.key, item = props.item, handleSelect = props.handleSelect, onSelect = props.onSelect;
    return React.createElement(react_bootstrap_1.OverlayTrigger, { key: key, overlay: React.createElement(react_bootstrap_1.Tooltip, { id: item.title }, item.title) },
        React.createElement(react_bootstrap_1.MenuItem, { eventKey: key, onSelect: function () { handleSelect(item.value); onSelect(); } }, item.title));
};
var UnconnectedSuggestions = /** @class */ (function (_super) {
    __extends(UnconnectedSuggestions, _super);
    function UnconnectedSuggestions(props) {
        var _this = _super.call(this, props) || this;
        _this.change = _this.change.bind(_this);
        return _this;
    }
    UnconnectedSuggestions.prototype.change = function (values) {
        var _this = this;
        ///registerField?
        this.props.fieldNames.map(function (name) {
            var field = _this.props[name];
            field.input.onChange(values[name]);
        });
    };
    UnconnectedSuggestions.prototype.render = function () {
        var _this = this;
        var _a = this.props, schema = _a.schema, selector = _a.selector, name = _a.name;
        var suggestionList = json_schemer_1.suggestions(schema);
        if (suggestionList) {
            var sourcePath = json_schemer_1.inputSource(schema);
            if (sourcePath) {
                suggestionList = getFromContext(sourcePath, this.props.context) || [];
            }
            if (!suggestionList.length) {
                return false;
            }
            return React.createElement(react_bootstrap_1.FormGroup, null,
                React.createElement(react_bootstrap_1.Col, { sm: 3, className: "text-right" },
                    React.createElement(react_bootstrap_1.ControlLabel, null, "Lookup")),
                React.createElement(react_bootstrap_1.Col, { sm: 7 },
                    suggestionList.length >= DROPDOWN_LIST_SIZE &&
                        React.createElement(DropdownSuggestionList, { data: suggestionList, onSelect: this.change }),
                    suggestionList.length < DROPDOWN_LIST_SIZE && React.createElement(react_bootstrap_1.DropdownButton, { title: '', id: name }, (suggestionList).map(function (sug, index) {
                        return React.createElement(OverlayMenuItem, { key: index, item: sug, handleSelect: function () { return _this.change(sug.value); } });
                    }))));
        }
        return false;
    };
    return UnconnectedSuggestions;
}(React.PureComponent));
var Suggestions = react_redux_1.connect(function (state, ownProps) {
    //const value = //(ownProps.selector(state, ownProps.name) || {})
    return {};
})(UnconnectedSuggestions);
var UnconnectedFormSet = /** @class */ (function (_super) {
    __extends(UnconnectedFormSet, _super);
    function UnconnectedFormSet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UnconnectedFormSet.prototype.render = function () {
        var _this = this;
        var _a = this.props, schema = _a.schema, subSchema = _a.subSchema, selector = _a.selector, index = _a.index, name = _a.name, showTitle = _a.showTitle, parentTitle = _a.title;
        var properties = schema.properties, title = schema.title;
        var schemaProps = properties;
        if (!properties) {
            return false;
        }
        var keys = Object.keys(schemaProps);
        if (subSchema) {
            keys = keys.concat(Object.keys(subSchema));
        }
        return (React.createElement("fieldset", null,
            (parentTitle || title) && React.createElement("legend", null, parentTitle || title),
            React.createElement(redux_form_1.Fields, { key: index, names: keys, component: Suggestions, schema: schema, name: this.props.name, fieldNames: keys, selector: selector, context: this.props.context }),
            Object.keys(schemaProps).map(function (key, i) {
                return React.createElement(RenderField, { key: i, field: schemaProps[key], name: key, selector: selector, index: index, parentName: name, context: _this.props.context });
            }),
            subSchema && React.createElement(FormSet, { schema: subSchema, name: this.props.name, selector: selector, context: this.props.context })));
    };
    return UnconnectedFormSet;
}(React.PureComponent));
var FormSet = react_redux_1.connect(function (state, ownProps) {
    if (ownProps.schema.oneOf) {
        var getMatchingOneOf = function (oneOfs, value, key) {
            return oneOfs.filter(function (x) { return x.properties[key].enum[0] === value; })[0] || {};
        };
        var selectKey_1;
        var properties_1 = ownProps.schema.properties;
        Object.keys(properties_1).map(function (key, i) {
            if (properties_1[key].enum || properties_1[key].type === 'boolean') {
                selectKey_1 = key;
            }
        });
        if (selectKey_1) {
            var value = (ownProps.selector(state, ownProps.name) || {})[selectKey_1];
            if (value) {
                return {
                    subSchema: getMatchingOneOf(ownProps.schema.oneOf, value, selectKey_1)
                };
            }
        }
    }
    return {};
})(UnconnectedFormSet);
var RenderField = /** @class */ (function (_super) {
    __extends(RenderField, _super);
    function RenderField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RenderField.prototype.render = function () {
        var _a = this.props, name = _a.name, field = _a.field, selector = _a.selector, index = _a.index;
        var title = field.enumeratedTitle ? json_schemer_1.formatString(field.enumeratedTitle, index + 1) : field.title;
        switch (field.type) {
            case 'object': {
                var deepName = this.props.parentName ? this.props.parentName + "." + name : name;
                return React.createElement(redux_form_1.FormSection, { name: name },
                    React.createElement(FormSet, { schema: this.props.field, name: deepName, selector: selector, index: index, context: this.props.context, title: title }));
            }
            case 'array': {
                return React.createElement(redux_form_1.FieldArray, { name: name, component: FieldsArray, props: { field: field.items, title: field.title, selector: selector, index: index }, context: this.props.context });
            }
            case 'string': {
                var subType = json_schemer_1.componentType(field);
                switch (subType) {
                    case 'textarea':
                        return React.createElement(redux_form_1.Field, { title: title, name: name, component: exports.TextAreaFieldRow, context: this.props.context });
                    case 'date':
                        return React.createElement(redux_form_1.Field, { title: title, name: name, component: exports.DateFieldRow, formatDate: field.formatDate, context: this.props.context });
                    default:
                        return React.createElement(redux_form_1.Field, { title: title, name: name, component: exports.TextFieldRow, context: this.props.context, disabled: field.readOnly });
                }
            }
            case 'number': {
                return React.createElement(redux_form_1.Field, { title: title, name: name, component: exports.NumberFieldRow, context: this.props.context });
            }
            case 'boolean':
                return React.createElement(redux_form_1.Field, { title: title, name: name, component: exports.CheckboxFieldRow, context: this.props.context });
            case undefined: {
                // the > 1 check is a easy way to not render the oneOf match structures (causes a duplication of the field)
                if (field.enum && field.enum.length > 1) {
                    if (isCheckbox(field.enum)) {
                        return React.createElement(redux_form_1.Field, { title: title, name: name, component: exports.CheckboxFieldRow, context: this.props.context });
                    }
                    return React.createElement(redux_form_1.Field, { title: title, name: name, component: exports.SelectFieldRow, context: this.props.context },
                        React.createElement("option", { value: "", disabled: true }, "Please Select..."),
                        field.enum.map(function (f, i) {
                            return React.createElement("option", { key: i, value: f }, field.enumNames ? field.enumNames[i] : f);
                        }));
                }
            }
        }
        return false;
    };
    return RenderField;
}(React.PureComponent));
var MoveUpButton = /** @class */ (function (_super) {
    __extends(MoveUpButton, _super);
    function MoveUpButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MoveUpButton.prototype.render = function () {
        var _a = this.props, swapFields = _a.swapFields, index = _a.index, numItems = _a.numItems, forceDisplay = _a.forceDisplay;
        var disabled = index === 0;
        if (disabled && !forceDisplay) {
            return false;
        }
        return (React.createElement("button", { type: "button", className: "btn btn-default", onClick: function () { return swapFields(index, index - 1); }, disabled: disabled },
            React.createElement(react_bootstrap_1.Glyphicon, { glyph: "arrow-up" })));
    };
    return MoveUpButton;
}(React.PureComponent));
var MoveDownButton = /** @class */ (function (_super) {
    __extends(MoveDownButton, _super);
    function MoveDownButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MoveDownButton.prototype.render = function () {
        var _a = this.props, swapFields = _a.swapFields, index = _a.index, numItems = _a.numItems, forceDisplay = _a.forceDisplay;
        var disabled = index + 1 === numItems;
        if (disabled && !forceDisplay) {
            return false;
        }
        return (React.createElement("button", { type: "button", className: "btn btn-default", onClick: function () { return swapFields(index, index + 1); }, disabled: disabled },
            React.createElement(react_bootstrap_1.Glyphicon, { glyph: "arrow-down" })));
    };
    return MoveDownButton;
}(React.PureComponent));
var RemoveButton = /** @class */ (function (_super) {
    __extends(RemoveButton, _super);
    function RemoveButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RemoveButton.prototype.render = function () {
        var _a = this.props, index = _a.index, numItems = _a.numItems, minItems = _a.minItems, forceDisplay = _a.forceDisplay, removeField = _a.removeField;
        var disabled = minItems >= numItems;
        if (disabled && !forceDisplay) {
            return false;
        }
        return (React.createElement("button", { type: "button", className: "btn btn-default", onClick: function () { return removeField(index); }, disabled: disabled },
            React.createElement(react_bootstrap_1.Glyphicon, { glyph: "remove" })));
    };
    return RemoveButton;
}(React.PureComponent));
var ListItemControls = /** @class */ (function (_super) {
    __extends(ListItemControls, _super);
    function ListItemControls() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListItemControls.prototype.render = function () {
        var _a = this.props, index = _a.index, numItems = _a.numItems, inline = _a.inline, _b = _a.fields, swap = _b.swap, remove = _b.remove;
        return React.createElement("div", { className: (inline ? 'btn-group' : 'btn-group-vertical') + " btn-group-xs", style: { position: 'absolute', right: 0, top: 0 } },
            React.createElement(MoveUpButton, { key: 0, index: index, swapFields: swap, numItems: numItems, forceDisplay: true }),
            React.createElement(MoveDownButton, { key: 1, index: index, swapFields: swap, numItems: numItems, forceDisplay: true }),
            React.createElement(RemoveButton, { key: 2, index: index, removeField: remove, numItems: numItems, forceDisplay: true }));
    };
    return ListItemControls;
}(React.PureComponent));
var FieldsArray = /** @class */ (function (_super) {
    __extends(FieldsArray, _super);
    function FieldsArray() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FieldsArray.prototype.add = function () {
        var _a = this.props, fields = _a.fields, field = _a.field;
        var suggestionList = json_schemer_1.suggestions(field);
        if (suggestionList) {
            var sourcePath = json_schemer_1.inputSource(field);
            if (sourcePath) {
                suggestionList = getFromContext(sourcePath, this.props.context) || [];
            }
            if (suggestionList.length < DROPDOWN_LIST_SIZE) {
                return React.createElement(react_bootstrap_1.DropdownButton, { title: json_schemer_1.addItem(field), id: fields.name },
                    (suggestionList).map(function (sug, index) {
                        return React.createElement(OverlayMenuItem, { key: index, item: sug, handleSelect: function () { return fields.push(__assign({ _keyIndex: json_schemer_1.getKey() }, sug.value)); } });
                    }),
                    React.createElement(react_bootstrap_1.MenuItem, { divider: true }),
                    React.createElement(react_bootstrap_1.MenuItem, { eventKey: suggestionList.length, onSelect: function () { return fields.push({ _keyIndex: json_schemer_1.getKey() }); } }, "Custom"));
            }
            else {
                return React.createElement(DropdownSuggestionList, { showCustom: true, data: suggestionList, onSelect: function (sug) { return fields.push(__assign({ _keyIndex: json_schemer_1.getKey() }, sug)); }, buttonText: json_schemer_1.addItem(field) });
            }
        }
        return React.createElement(react_bootstrap_1.Button, { onClick: function () { return fields.push({ _keyIndex: json_schemer_1.getKey() }); } }, json_schemer_1.addItem(field));
    };
    FieldsArray.prototype.render = function () {
        var _this = this;
        var _a = this.props, fields = _a.fields, field = _a.field, title = _a.title, selector = _a.selector;
        var inline = json_schemer_1.controlStyle(field) === 'inline';
        return React.createElement("fieldset", { className: "list" },
            title && React.createElement("legend", null, title),
            React.createElement(react_flip_move_1.default, { duration: 250, easing: "ease-out" }, fields.map(function (name, index) {
                return React.createElement("div", { key: fields.get(index)._keyIndex, className: "list-item" },
                    React.createElement("div", { style: { position: 'relative', minHeight: inline ? 0 : 70 } },
                        React.createElement(RenderField, { key: fields.get(index)._keyIndex + ' ' + index, name: name, field: field, selector: selector, index: index, context: _this.props.context }),
                        React.createElement(ListItemControls, { fields: fields, index: index, numItems: fields.length, name: name, inline: inline })),
                    index < fields.length - 1 && React.createElement("hr", null));
            })),
            this.props.meta.error && React.createElement("div", { className: "alert alert-danger" }, this.props.meta.error.map(function (error, index) { return React.createElement("div", { key: index },
                error,
                " "); })),
            React.createElement("div", { className: "text-center form-group" }, this.add()));
    };
    return FieldsArray;
}(React.PureComponent));
function FieldRow(Component) {
    return /** @class */ (function (_super) {
        __extends(Wrapped, _super);
        function Wrapped() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Wrapped.prototype.getValidationState = function () {
            if (this.props.meta.touched) {
                return this.props.meta.valid ? 'success' : 'error';
            }
            return null;
        };
        Wrapped.prototype.render = function () {
            var props = this.props;
            return React.createElement(react_bootstrap_1.FormGroup, { validationState: this.getValidationState() },
                React.createElement(react_bootstrap_1.Col, { sm: 3, className: "text-right" },
                    React.createElement(react_bootstrap_1.ControlLabel, null, props.title)),
                React.createElement(react_bootstrap_1.Col, { sm: this.props.columnWidth || 7 },
                    React.createElement(Component, __assign({}, props)),
                    React.createElement(react_bootstrap_1.FormControl.Feedback, null)));
        };
        return Wrapped;
    }(React.PureComponent));
}
var RenderForm = /** @class */ (function (_super) {
    __extends(RenderForm, _super);
    function RenderForm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RenderForm.prototype.render = function () {
        var schema = this.props.schema;
        return React.createElement(react_bootstrap_1.Form, { horizontal: true },
            React.createElement("p", null),
            React.createElement(FormSet, { schema: schema, selector: redux_form_1.formValueSelector(this.props.form), showTitle: false, context: this.props.context }),
            this.props.error && React.createElement("div", { className: "alert alert-danger" }, this.props.error.map(function (error, index) { return React.createElement("div", { key: index },
                error,
                " "); })));
    };
    return RenderForm;
}(React.PureComponent));
var InjectedRenderForm = redux_form_1.reduxForm({})(RenderForm);
var SchemaView = /** @class */ (function (_super) {
    __extends(SchemaView, _super);
    function SchemaView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SchemaView.prototype.render = function () {
        return React.createElement("pre", null, JSON.stringify(this.props.schema.properties, null, 4));
    };
    return SchemaView;
}(React.PureComponent));
var FormView = /** @class */ (function (_super) {
    __extends(FormView, _super);
    function FormView(props) {
        var _this = _super.call(this, props) || this;
        _this.reset = _this.reset.bind(_this);
        return _this;
    }
    FormView.prototype.reset = function () {
        this.props.reset(this.props.name, json_schemer_1.setDefaults(this.props.schema, {}, this.props.initialValues || INITIAL_VALUES));
    };
    FormView.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement(InjectedRenderForm, { schema: this.props.schema, form: this.props.name, key: this.props.name, validate: this.props.validate, initialValues: json_schemer_1.setDefaults(this.props.schema, {}, this.props.initialValues || INITIAL_VALUES), context: this.props.context }),
            React.createElement("div", { className: "button-row" },
                React.createElement(react_bootstrap_1.Button, { onClick: this.reset }, "Reset"),
                React.createElement(react_bootstrap_1.Button, { bsStyle: 'success', onClick: this.props.showComplete }, "Finish"),
                React.createElement(react_bootstrap_1.Button, { bsStyle: 'info', onClick: this.props.showPreview }, "Preview")));
    };
    return FormView;
}(React.PureComponent));
var Errors = /** @class */ (function (_super) {
    __extends(Errors, _super);
    function Errors(props) {
        var _this = _super.call(this, props) || this;
        _this.navWillLeave = _this.navWillLeave.bind(_this);
        return _this;
    }
    Errors.prototype.navWillLeave = function () {
        if (localStorage) {
            localStorage.setItem('saved', JSON.stringify({
                values: this.props.values,
                name: this.props.name
            }));
        }
    };
    Errors.prototype.componentDidMount = function () {
        window.addEventListener('beforeunload', this.navWillLeave);
        if (localStorage.getItem('saved')) {
            try {
                var state = JSON.parse(localStorage.getItem('saved'));
                // if parses, a good start
                this.props.showRestore();
            }
            catch (e) {
                localStorage.removeItem('saved');
            }
        }
    };
    Errors.prototype.componentWillUnmount = function () {
        window.removeEventListener('beforeunload', this.navWillLeave);
    };
    Errors.prototype.touchAll = function () {
        var fields = json_schemer_1.getFieldsFromErrors(this.props.errors);
        (_a = this.props).touch.apply(_a, [this.props.name].concat(fields));
        var _a;
    };
    Errors.prototype.render = function () {
        return false;
    };
    return Errors;
}(React.PureComponent));
var ConnectedErrors = react_redux_1.connect(function (state, ownProps) {
    var values = redux_form_1.getFormValues(ownProps.name)(state);
    return { errors: redux_form_1.getFormSyncErrors(ownProps.name)(state), values: values, dirty: redux_form_1.isDirty(ownProps.name)(state) };
}, { touch: redux_form_1.touch, showRestore: actions_1.showRestore }, undefined, { withRef: true })(Errors);
var WizardView = /** @class */ (function (_super) {
    __extends(WizardView, _super);
    function WizardView(props) {
        var _this = _super.call(this, props) || this;
        _this.nextStep = _this.nextStep.bind(_this);
        _this.prevStep = _this.prevStep.bind(_this);
        _this.finish = _this.finish.bind(_this);
        _this.reset = _this.reset.bind(_this);
        return _this;
    }
    WizardView.prototype.lastStep = function () {
        return this.props.page === this.props.schema.wizard.steps.length - 1;
    };
    WizardView.prototype.firstStep = function () {
        return this.props.page === 0;
    };
    WizardView.prototype.validate = function () {
        if (!this.refs.form.valid) {
            this.refs.errors.getWrappedInstance().touchAll();
            return false;
        }
        return true;
    };
    WizardView.prototype.nextStep = function () {
        if (this.validate() && !this.lastStep()) {
            this.props.setWizardPage(this.props.page + 1);
        }
    };
    WizardView.prototype.finish = function () {
        if (this.validate()) {
            this.props.showComplete();
        }
    };
    WizardView.prototype.prevStep = function () {
        if (!this.firstStep()) {
            this.props.setWizardPage(this.props.page - 1);
        }
    };
    WizardView.prototype.reset = function () {
        this.props.reset(this.props.name, json_schemer_1.setDefaults(this.props.schema, {}, this.props.initialValues || INITIAL_VALUES));
    };
    WizardView.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement("br", null),
            React.createElement(react_bootstrap_1.ProgressBar, { striped: true, bsStyle: "success", now: (this.props.page + 1) / (this.props.schema.wizard.steps.length) * 100, label: "Step " + (this.props.page + 1) + " of " + this.props.schema.wizard.steps.length }),
            React.createElement(InjectedRenderForm, { ref: "form", schema: json_schemer_1.getSubSchema(this.props.schema, this.props.page), form: this.props.name, key: this.props.name + "-" + this.props.page, validate: this.props.validatePages[this.props.page], destroyOnUnmount: false, forceUnregisterOnUnmount: true, initialValues: json_schemer_1.setDefaults(this.props.schema, {}, this.props.initialValues || INITIAL_VALUES), context: this.props.context }),
            React.createElement(ConnectedErrors, { ref: "errors", name: this.props.name, key: this.props.page }),
            React.createElement("div", { className: "button-row" },
                React.createElement(react_bootstrap_1.Button, { onClick: this.reset }, "Reset"),
                !this.firstStep() && React.createElement(react_bootstrap_1.Button, { onClick: this.prevStep }, "Back"),
                !this.lastStep() && React.createElement(react_bootstrap_1.Button, { bsStyle: 'success', onClick: this.nextStep }, "Next"),
                (this.lastStep() || true) && React.createElement(react_bootstrap_1.Button, { bsStyle: 'success', onClick: this.finish }, "Finish"),
                React.createElement(react_bootstrap_1.Button, { bsStyle: 'info', onClick: this.props.showPreview }, "Preview")));
    };
    return WizardView;
}(React.PureComponent));
var ConnectedWizardView = react_redux_1.connect(function (state, ownProps) { return ({
    page: (state.wizard[ownProps.name] || { page: 0 }).page
}); }, function (dispatch, ownProps) { return ({
    setWizardPage: function (page) { return dispatch(actions_1.setWizardPage({ name: ownProps.name, page: page })); }
}); })(WizardView);
var TemplateViews = /** @class */ (function (_super) {
    __extends(TemplateViews, _super);
    function TemplateViews() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TemplateViews.prototype.render = function () {
        var _a = this.props, category = _a.category, schema = _a.schema;
        var name = category + "." + schema;
        var type = schemas_1.default[category].schemas[schema];
        if (!type) {
            return false;
        }
        var hasWizard = !!type.schema.wizard;
        return React.createElement(react_bootstrap_1.Tabs, { defaultActiveKey: hasWizard ? 3 : 2, id: "tab-view", unmountOnExit: true, key: name },
            React.createElement(react_bootstrap_1.Tab, { eventKey: 2, title: "Form" },
                React.createElement(FormView, { schema: type.schema, validate: type.validate, name: name, showPreview: this.props.showPreview, showComplete: this.props.showComplete, reset: this.props.reset, context: this.props.context, initialValues: this.props.initialValues })),
            hasWizard && React.createElement(react_bootstrap_1.Tab, { eventKey: 3, title: "Wizard" },
                React.createElement(ConnectedWizardView, { schema: type.schema, validate: type.validate, validatePages: type.validatePages, name: name, showPreview: this.props.showPreview, showComplete: this.props.showComplete, reset: this.props.reset, context: this.props.context, intitalValues: this.props.initialValues }),
                "}"));
    };
    return TemplateViews;
}(React.PureComponent));
exports.TemplateViews = TemplateViews;
var InjectedTemplateViews = react_redux_1.connect(undefined, {
    showPreview: function () { return actions_1.showPreview({}); },
    showComplete: function () { return actions_1.showComplete({}); },
    reset: function (formName, values) { return actions_1.showConfirmation({ title: 'Reset Form',
        message: 'Are you sure you wish to reset the form?',
        rejectLabel: 'Cancel', acceptLabel: 'Reset',
        acceptActions: [redux_form_1.initialize(formName, values), actions_1.setWizardPage({ name: formName, page: 0 })] }); }
})(redux_form_1.formValues('category', 'schema')(TemplateViews));
var RenderDateTimePicker = /** @class */ (function (_super) {
    __extends(RenderDateTimePicker, _super);
    function RenderDateTimePicker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RenderDateTimePicker.prototype.render = function () {
        var _a = this.props, _b = _a.input, onChange = _b.onChange, value = _b.value, onBlur = _b.onBlur, formatDate = _a.formatDate;
        var readFormats = [formatDate, "D M YYYY", "D MMM YYYY", "D/M/YYYY", "D-M-YYYY", "D MMMM YYYY"];
        return React.createElement(DateTimePicker, { onBlur: function () { return onBlur(undefined); }, onChange: function (date, string) { return formatDate ? onChange(string) : onChange(date); }, parse: function (string) {
                var mo = moment(string, readFormats);
                return mo.isValid() ? mo.toDate() : null;
            }, format: this.props.formatDate, time: false, value: !value ? null : new Date(value) });
    };
    return RenderDateTimePicker;
}(React.PureComponent));
var ToggleButtonField = /** @class */ (function (_super) {
    __extends(ToggleButtonField, _super);
    function ToggleButtonField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ToggleButtonField.prototype.render = function () {
        return React.createElement(react_bootstrap_1.ToggleButtonGroup, __assign({}, this.props.input, { type: "radio" }), this.props.children);
    };
    return ToggleButtonField;
}(React.PureComponent));
var SelectField = /** @class */ (function (_super) {
    __extends(SelectField, _super);
    function SelectField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectField.prototype.render = function () {
        return React.createElement(react_bootstrap_1.FormControl, __assign({}, this.props.input, { componentClass: "select" }), this.props.children);
    };
    return SelectField;
}(React.PureComponent));
var CheckboxField = /** @class */ (function (_super) {
    __extends(CheckboxField, _super);
    function CheckboxField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckboxField.prototype.render = function () {
        return React.createElement(react_bootstrap_1.FormControl, __assign({}, this.props.input, { componentClass: 'input', type: "checkbox", className: "checkbox" }));
    };
    return CheckboxField;
}(React.PureComponent));
var TextField = /** @class */ (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextField.prototype.render = function () {
        return React.createElement(react_bootstrap_1.FormControl, __assign({}, this.props.input, { componentClass: "input", disabled: this.props.disabled }));
    };
    return TextField;
}(React.PureComponent));
var NumberField = /** @class */ (function (_super) {
    __extends(NumberField, _super);
    function NumberField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumberField.prototype.render = function () {
        return React.createElement(react_bootstrap_1.FormControl, __assign({}, this.props.input, { componentClass: "input", type: "number" }));
    };
    return NumberField;
}(React.PureComponent));
var TextAreaField = /** @class */ (function (_super) {
    __extends(TextAreaField, _super);
    function TextAreaField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextAreaField.prototype.render = function () {
        return React.createElement(react_bootstrap_1.FormControl, __assign({}, this.props.input, { componentClass: "textarea" }));
    };
    return TextAreaField;
}(React.PureComponent));
var DateField = /** @class */ (function (_super) {
    __extends(DateField, _super);
    function DateField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateField.prototype.render = function () {
        return React.createElement(react_bootstrap_1.FormControl, __assign({}, this.props, this.props.input, { componentClass: RenderDateTimePicker }));
    };
    return DateField;
}(React.PureComponent));
exports.ToggleButtonFieldRow = FieldRow(ToggleButtonField);
exports.SelectFieldRow = FieldRow(SelectField);
exports.TextFieldRow = FieldRow(TextField);
exports.TextAreaFieldRow = FieldRow(TextAreaField);
exports.DateFieldRow = FieldRow(DateField);
exports.CheckboxFieldRow = FieldRow(CheckboxField);
exports.NumberFieldRow = FieldRow(NumberField);
var OptionList = function (props) {
    var keys = props.keys, schemas = props.schemas;
    keys.sort(function (a, b) { return schemas[a].schema.title.localeCompare(schemas[b].schema.title); });
    return React.createElement(react_1.Fragment, null, keys.map(function (key) {
        return React.createElement("option", { key: key, value: key }, schemas[key].schema.title);
    }));
};
var SchemaField = /** @class */ (function (_super) {
    __extends(SchemaField, _super);
    function SchemaField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SchemaField.prototype.render = function () {
        var _this = this;
        var keys = Object.keys(schemas_1.default[this.props.category].schemas);
        var ordering = (schemas_1.default[this.props.category].categories || { ordering: [] }).ordering;
        var categories = keys.reduce(function (result, key) {
            var category = schemas_1.default[_this.props.category].schemas[key].schema.category;
            result[category] = (result[category] || []).concat([key]);
            return result;
        }, {});
        var categoryKeys = Object.keys(categories);
        if (ordering.length) {
            categoryKeys.sort(function (a, b) {
                return ordering.indexOf(a) - ordering.indexOf(b);
            });
        }
        else {
            categoryKeys.sort();
        }
        var schema = schemas_1.default[this.props.category];
        //const title = schema[this.props.input.value] ? schema[this.props.input.value].schema.title : 'Please Select...'
        //return <DropdownSuggestionList showCustom data={categoryKeys} buttonText={title} onSelect={this.props.input.onChange} />
        return React.createElement(SelectField, { meta: this.props.meta, input: this.props.input },
            !schemas_1.default[this.props.category].schemas[this.props.input.value] && React.createElement("option", { value: this.props.input.value, disabled: true }, "Please select..."),
            categoryKeys.map(function (category) {
                var options = React.createElement(OptionList, { keys: categories[category], schemas: schemas_1.default[_this.props.category].schemas });
                if (category !== "undefined") {
                    return React.createElement("optgroup", { label: category }, options);
                }
                return options;
            }));
    };
    return SchemaField;
}(React.PureComponent));
var SchemaFieldWithCategory = redux_form_1.formValues('category')(SchemaField);
var getFromContext = function (path, context) {
    return (context || {})[path];
};
var FormLoader = /** @class */ (function (_super) {
    __extends(FormLoader, _super);
    function FormLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FormLoader.prototype.render = function () {
        return React.createElement("div", { className: "jasons-formal" },
            React.createElement(react_bootstrap_1.Grid, null,
                React.createElement(react_bootstrap_1.Col, { md: 6, mdOffset: 3 },
                    React.createElement(react_bootstrap_1.Form, { horizontal: true },
                        React.createElement(react_bootstrap_1.FormGroup, { controlId: "formControlsSelect" },
                            React.createElement(react_bootstrap_1.Col, { sm: 2 },
                                React.createElement(react_bootstrap_1.ControlLabel, null, "Category")),
                            React.createElement(react_bootstrap_1.Col, { sm: 10 },
                                React.createElement(redux_form_1.Field, { name: "category", component: SelectField }, Object.keys(schemas_1.default).map(function (key) {
                                    return React.createElement("option", { key: key, value: key }, key);
                                })))),
                        React.createElement(react_bootstrap_1.FormGroup, { controlId: "formControlsSelect" },
                            React.createElement(react_bootstrap_1.Col, { sm: 2 },
                                React.createElement(react_bootstrap_1.ControlLabel, null, "Schema")),
                            React.createElement(react_bootstrap_1.Col, { sm: 10 },
                                React.createElement(redux_form_1.Field, { name: "schema", component: SchemaFieldWithCategory })))))),
            React.createElement(react_bootstrap_1.Grid, { fluid: true },
                React.createElement(react_bootstrap_1.Col, { md: 6, mdOffset: 3 },
                    React.createElement(InjectedTemplateViews, { context: this.props.context }))));
    };
    return FormLoader;
}(React.PureComponent));
exports.FormLoader = FormLoader;
var UnconnectedSimpleFormLoader = /** @class */ (function (_super) {
    __extends(UnconnectedSimpleFormLoader, _super);
    function UnconnectedSimpleFormLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UnconnectedSimpleFormLoader.prototype.render = function () {
        return React.createElement("div", { className: "jasons-formal" },
            React.createElement(react_bootstrap_1.Grid, null,
                React.createElement(react_bootstrap_1.Col, { md: 6, mdOffset: 3 },
                    React.createElement(react_bootstrap_1.Form, { horizontal: true },
                        React.createElement(react_bootstrap_1.FormGroup, { controlId: "formControlsSelect" },
                            React.createElement(react_bootstrap_1.ControlLabel, null, "Schema"),
                            React.createElement(redux_form_1.Field, { name: "schema", component: SchemaFieldWithCategory }))))),
            React.createElement(InjectedTemplateViews, { context: this.props.context, initialValues: this.props.formValues }));
    };
    return UnconnectedSimpleFormLoader;
}(React.PureComponent));
exports.SimpleFormLoader = redux_form_1.reduxForm({
    form: 'formLoader'
})(UnconnectedSimpleFormLoader); //hack
exports.default = redux_form_1.reduxForm({
    form: 'formLoader'
})(FormLoader); //hack
//# sourceMappingURL=formLoader.js.map