"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var react_bootstrap_1 = require('react-bootstrap');
var actions_1 = require('../actions');
var loading_1 = require('./loading');
var redux_form_1 = require('redux-form');
var react_redux_1 = require('react-redux');
var formLoader_1 = require('./formLoader');
var preview_1 = require('./preview');
var schemas_1 = require('../schemas');
var SaveModal = (function (_super) {
    __extends(SaveModal, _super);
    function SaveModal() {
        _super.apply(this, arguments);
    }
    SaveModal.prototype.componentWillMount = function () {
        this.props.request();
    };
    SaveModal.prototype.save = function (values) {
        //localStorage.setItem(values.name, JSON.stringify(this.props.courtCostsValues));
        // if name collides, add id
        var match = this.props.entries.find(function (item) {
            return item.name === values.name;
        });
        this.props.handleClose();
        ;
        if (match) {
            this.props.overwrite({ name: values.name, data: this.props.courtCostsValues, saved_id: match.saved_id });
        }
        else {
            this.props.save({ name: values.name, data: this.props.courtCostsValues });
        }
    };
    SaveModal.prototype.deleteItem = function (e, saved_id) {
        e.stopPropagation();
        this.props.deleteEntry({ saved_id: saved_id });
    };
    SaveModal.prototype.handleClick = function (item) {
        if (this.props.saveMode) {
            this.props.change('name', item.name);
        }
        else {
            this.props.load({ saved_id: item.saved_id });
        }
    };
    SaveModal.prototype.render = function () {
        var _this = this;
        var handleSubmit = this.props.handleSubmit;
        return React.createElement(react_bootstrap_1.Modal, {show: true, onHide: this.props.handleClose}, 
            React.createElement(react_bootstrap_1.Modal.Header, {closeButton: true}, 
                React.createElement(react_bootstrap_1.Modal.Title, null, this.props.saveMode ? 'Save' : 'Load')
            ), 
            React.createElement(react_bootstrap_1.Modal.Body, null, 
                React.createElement(react_bootstrap_1.Form, {horizontal: true}, 
                    this.props.loading && React.createElement(loading_1.default, null), 
                    React.createElement(react_bootstrap_1.ListGroup, {style: { maxHeight: 200, overflowY: 'scroll' }}, this.props.entries.map(function (item) {
                        return React.createElement("a", {className: "btn btn-default list-group-item text-left", key: item.saved_id, onClick: function () { return _this.handleClick(item); }}, 
                            item.name, 
                            React.createElement(react_bootstrap_1.Button, {bsSize: "xs", className: "pull-right", onClick: function (e) { return _this.deleteItem(e, item.saved_id); }}, 
                                React.createElement(react_bootstrap_1.Glyphicon, {glyph: "remove"})
                            ));
                    })), 
                    this.props.saveMode && React.createElement(redux_form_1.Field, {name: "name", title: "Name", component: formLoader_1.TextFieldRow, validate: formLoader_1.required}))
            ), 
            React.createElement(react_bootstrap_1.Modal.Footer, null, 
                React.createElement(react_bootstrap_1.Button, {onClick: this.props.handleClose}, "Close"), 
                this.props.saveMode && React.createElement(react_bootstrap_1.Button, {bsStyle: "primary", onClick: handleSubmit(function (values) { return _this.save(values); })}, "Save")));
    };
    return SaveModal;
}(React.PureComponent));
exports.SaveModal = SaveModal;
var ConnectedSaveModal = react_redux_1.connect(function (state) {
    return {
        entries: state.saved.list || [],
        loading: state.saved.status !== Jason.DownloadStatus.Complete,
        courtCostsValues: redux_form_1.getFormValues('cc')(state),
        saveMode: true,
    };
}, {
    request: function () { return actions_1.requestSavedList({}); },
    save: function (args) { return actions_1.saveState(args); },
    overwrite: function (args) { return actions_1.showConfirmation({ title: 'Overwrite',
        message: 'Are you sure you wish to save over this entry?',
        rejectLabel: 'Cancel', acceptLabel: 'Overwrite',
        acceptActions: [actions_1.saveState(args)],
        rejectActions: [actions_1.showSave()]
    }); },
    deleteEntry: function (args) { return actions_1.showConfirmation({ title: 'Deleted Saved Entry',
        message: 'Are you sure you wish to delete this entry?',
        rejectLabel: 'Cancel', acceptLabel: 'Delete',
        acceptActions: [actions_1.deleteState(args), actions_1.showSave()],
        rejectActions: [actions_1.showSave()]
    }); },
    handleClose: function () { return actions_1.hideSave(); }
})(redux_form_1.reduxForm({ form: 'save' })(SaveModal));
var ConnectedLoadModal = react_redux_1.connect(function (state) {
    return {
        entries: state.saved.list || [],
        loading: state.saved.status !== Jason.DownloadStatus.Complete,
        courtCostsValues: redux_form_1.getFormValues('cc')(state),
        saveMode: false,
    };
}, {
    request: function () { return actions_1.requestSavedList({}); },
    deleteEntry: function (args) { return actions_1.showConfirmation({ title: 'Deleted Saved Entry',
        message: 'Are you sure you wish to delete this entry?',
        rejectLabel: 'Cancel', acceptLabel: 'Delete',
        acceptActions: [actions_1.deleteState(args), actions_1.showLoad()],
        rejectActions: [actions_1.showLoad()]
    }); },
    load: function (args) { return actions_1.showConfirmation({ title: 'Load Saved Entry',
        message: 'Are you sure load this entry? All unsaved changes will be lost.',
        rejectLabel: 'Cancel', acceptLabel: 'Load',
        acceptActions: [actions_1.loadState(args)],
        rejectActions: [actions_1.showLoad()]
    }); },
    handleClose: function () { return actions_1.hideLoad(); }
})(redux_form_1.reduxForm({ form: 'save' })(SaveModal));
var ConfirmationDialog = (function (_super) {
    __extends(ConfirmationDialog, _super);
    function ConfirmationDialog() {
        _super.apply(this, arguments);
    }
    ConfirmationDialog.prototype.render = function () {
        return React.createElement(react_bootstrap_1.Modal, {show: true, onHide: this.props.reject}, 
            React.createElement(react_bootstrap_1.Modal.Header, {closeButton: true}, 
                React.createElement(react_bootstrap_1.Modal.Title, null, this.props.title)
            ), 
            React.createElement(react_bootstrap_1.Modal.Body, null, 
                React.createElement("p", null, this.props.message)
            ), 
            React.createElement(react_bootstrap_1.Modal.Footer, null, 
                React.createElement(react_bootstrap_1.Button, {onClick: this.props.reject}, this.props.rejectLabel), 
                React.createElement(react_bootstrap_1.Button, {bsStyle: "primary", onClick: this.props.accept}, this.props.acceptLabel)));
    };
    return ConfirmationDialog;
}(React.PureComponent));
exports.ConfirmationDialog = ConfirmationDialog;
var ConnectedConfirmationDialog = react_redux_1.connect.apply(void 0, [function (state) { return ({}); }].concat(state.dialogs.confirmation));
function (dispatch) { return ({ dispatch: dispatch }); }, function (ownProps, dispatchProps) {
    return {
        ownProps: ownProps,
        hide: function () { return dispatchProps.dispatch(actions_1.hideConfirmation({})); },
        reject: function () {
            dispatchProps.dispatch(actions_1.hideConfirmation({}));
            (ownProps.rejectActions || []).map(function (action) {
                return dispatchProps.dispatch(action);
            });
        },
        accept: function () {
            dispatchProps.dispatch(actions_1.hideConfirmation({}));
            (ownProps.acceptActions || []).map(function (action) {
                return dispatchProps.dispatch(action);
            });
        }
    };
};
ConfirmationDialog;
var Restore = (function (_super) {
    __extends(Restore, _super);
    function Restore(props) {
        _super.call(this, props);
        this.handleNo = this.handleNo.bind(this);
        this.handleRestore = this.handleRestore.bind(this);
    }
    Restore.prototype.handleNo = function () {
        localStorage.removeItem('saved');
        this.props.handleClose();
    };
    Restore.prototype.handleRestore = function () {
        try {
            var _a = JSON.parse(localStorage.getItem('saved')), name_1 = _a.name, values = _a.values;
            this.props.setForm(name_1, values);
        }
        catch (e) { }
        ;
        localStorage.removeItem('saved');
        this.props.handleClose();
    };
    Restore.prototype.render = function () {
        return React.createElement(react_bootstrap_1.Modal, {show: true, onHide: this.props.handleClose}, 
            React.createElement(react_bootstrap_1.Modal.Header, {closeButton: true}, 
                React.createElement(react_bootstrap_1.Modal.Title, null, "Restore Previous Session")
            ), 
            React.createElement(react_bootstrap_1.Modal.Body, null, 
                React.createElement("p", null, "Would you like to restore your previous session?")
            ), 
            React.createElement(react_bootstrap_1.Modal.Footer, null, 
                React.createElement(react_bootstrap_1.Button, {onClick: this.handleNo}, "No"), 
                React.createElement(react_bootstrap_1.Button, {onClick: this.handleRestore, bsStyle: "primary"}, "Restore")));
    };
    return Restore;
}(React.PureComponent));
exports.Restore = Restore;
var ConnectedRestore = react_redux_1.connect(undefined, {
    handleClose: actions_1.hideRestore,
    setForm: function (name, args) { return redux_form_1.initialize(name, args); }
})(Restore);
var PreviewModal = (function (_super) {
    __extends(PreviewModal, _super);
    function PreviewModal() {
        _super.apply(this, arguments);
    }
    PreviewModal.prototype.render = function () {
        return React.createElement(react_bootstrap_1.Modal, {show: true, onHide: this.props.handleClose, bsSize: "large"}, 
            React.createElement(react_bootstrap_1.Modal.Header, {closeButton: true}, 
                React.createElement(react_bootstrap_1.Modal.Title, null, "Preview")
            ), 
            React.createElement(react_bootstrap_1.Modal.Body, null, 
                React.createElement(preview_1.Preview, null)
            ));
    };
    return PreviewModal;
}(React.PureComponent));
exports.PreviewModal = PreviewModal;
var ConnectedPreviewModal = react_redux_1.connect(undefined, {
    handleClose: actions_1.hidePreview,
})(PreviewModal);
var FileFormat = (function (_super) {
    __extends(FileFormat, _super);
    function FileFormat() {
        _super.apply(this, arguments);
    }
    FileFormat.prototype.render = function () {
        return React.createElement(react_bootstrap_1.Form, {horizontal: true}, 
            React.createElement(redux_form_1.Field, {title: 'File Name', name: 'filename', component: formLoader_1.TextFieldRow}), 
            React.createElement(redux_form_1.Field, {title: 'File Type', name: 'fileType', component: formLoader_1.ToggleButtonFieldRow, columnWidth: 9}, 
                React.createElement(react_bootstrap_1.ToggleButton, {value: "docx"}, 
                    React.createElement("i", {className: "fa fa-file-word-o"}), 
                    " Word (.docx)"), 
                React.createElement(react_bootstrap_1.ToggleButton, {value: "pdf"}, 
                    React.createElement("i", {className: "fa fa-file-pdf-o"}), 
                    " PDF (.pdf)"), 
                React.createElement(react_bootstrap_1.ToggleButton, {value: "odt"}, 
                    React.createElement("i", {className: "fa fa-file-text-o"}), 
                    "  OpenDocument (.odt)")));
    };
    return FileFormat;
}(React.PureComponent));
exports.FileFormat = FileFormat;
var FileFormatForm = redux_form_1.reduxForm({
    form: 'fileFormat'
})(FileFormat);
var Complete = (function (_super) {
    __extends(Complete, _super);
    function Complete(props) {
        _super.call(this, props);
        this.download = this.download.bind(this);
    }
    Complete.prototype.download = function () {
        var type = schemas_1.default[this.props.category].schemas[this.props.schemaName];
        var fileValues = this.props.getFileValues();
        (_a = this.props).download.apply(_a, [{}].concat(preview_1.buildRenderObject(fileValues.filename, this.props.category, this.props.schemaName, this.props.getValues(), {}), fileValues));
        var _a;
    };
    ;
    return Complete;
}(React.PureComponent));
exports.Complete = Complete;
actions_1.render();
{
    var filename = this.props.schemaName;
    return (React.createElement(react_bootstrap_1.Modal, {show: true, onHide: this.props.handleClose, backdrop: "static"}, 
        React.createElement(react_bootstrap_1.Modal.Header, {closeButton: true}, 
            React.createElement(react_bootstrap_1.Modal.Title, null, "Complete Document")
        ), 
        React.createElement(react_bootstrap_1.Modal.Body, null, 
            React.createElement(FileFormatForm, {ref: "form", initialValues: { fileType: 'docx', filename: filename }}), 
            React.createElement("div", {className: "icon-action-page"}, 
                React.createElement("div", {className: "actionable select-button", onClick: this.download}, 
                    React.createElement(react_bootstrap_1.Glyphicon, {glyph: 'download'}), 
                    React.createElement("span", {className: "transaction-button-text"}, "Download Document")), 
                React.createElement("div", {className: "disabled select-button"}, 
                    React.createElement(react_bootstrap_1.Glyphicon, {glyph: 'envelope'}), 
                    React.createElement("span", {className: "transaction-button-text"}, "Email Document")), 
                React.createElement("div", {className: "disabled select-button"}, 
                    React.createElement(react_bootstrap_1.Glyphicon, {glyph: 'floppy-save'}), 
                    React.createElement("span", {className: "transaction-button-text"}, "Save to File Cabinet")), 
                React.createElement("div", {className: "disabled select-button"}, 
                    React.createElement(react_bootstrap_1.Glyphicon, {glyph: 'pencil'}), 
                    React.createElement("span", {className: "transaction-button-text"}, "Add Signatures with CataLex Sign"))))));
}
var ConnectedComplete = react_redux_1.connect(function (state) {
    var formLoader = redux_form_1.getFormValues('formLoader')(state);
    return {
        schemaName: formLoader.schema,
        category: formLoader.category,
        getValues: function () { return redux_form_1.getFormValues(formLoader.category + "." + formLoader.schema)(state); },
        getFileValues: function () { return redux_form_1.getFormValues('fileFormat')(state); }
    };
}, {
    handleClose: actions_1.hideComplete,
    download: actions_1.download
})(Complete);
var Modals = (function (_super) {
    __extends(Modals, _super);
    function Modals() {
        _super.apply(this, arguments);
    }
    Modals.prototype.render = function () {
        if (this.props.showing === 'preview') {
            return React.createElement(ConnectedPreviewModal, null);
        }
        if (this.props.downloading) {
            return React.createElement(loading_1.LoadingOverlay, null);
        }
        if (this.props.showing === 'confirmation') {
            return React.createElement(ConnectedConfirmationDialog, null);
        }
        if (this.props.showing === 'save') {
            return React.createElement(ConnectedSaveModal, null);
        }
        if (this.props.showing === 'load') {
            return React.createElement(ConnectedLoadModal, null);
        }
        if (this.props.showing === 'restore') {
            return React.createElement(ConnectedRestore, null);
        }
        if (this.props.showing === 'complete') {
            return React.createElement(ConnectedComplete, null);
        }
        return false;
    };
    return Modals;
}(React.PureComponent));
exports.Modals = Modals;
var ConnectedModals = react_redux_1.connect(function (state) { return ({
    downloading: state.document.downloadStatus === Jason.DownloadStatus.InProgress,
    showing: state.dialogs.showing
}); })(Modals);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ConnectedModals;
