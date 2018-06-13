import * as React  from "react";
import  { Fragment } from "react";
import { reduxForm, InjectedFormProps, Field, Fields, WrappedFieldProps, formValues, FormSection, FieldArray, formValueSelector, getFormValues, initialize, touch, getFormSyncErrors, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import templateSchemas from '../schemas';
import { FormGroup, ControlLabel, FormControl, Form, Col, Grid, Tabs, Tab, Button, Glyphicon, ProgressBar, ToggleButtonGroup, DropdownButton, MenuItem, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { componentType, getKey, addItem, setDefaults, getValidate, controlStyle, formatString, getSubSchema, getFieldsFromErrors, suggestions, inputSource } from 'json-schemer';
import FlipMove from 'react-flip-move';
import { render, showPreview, showComplete, showConfirmation, showRestore, setWizardPage } from '../actions';
import PDF from 'react-pdf-component/lib/react-pdf';
import Loading from './loading';
import * as DateTimePicker from 'react-widgets/lib/DateTimePicker';
import * as DropdownList from 'react-widgets/lib/DropdownList';
import * as ReactWidgetList from 'react-widgets/lib/List';
import * as moment from 'moment';

export const required = (value : any) => (value ? undefined : 'Required')

function isCheckbox(enums : (string | boolean)[]) {
    return enums.length === 2 && ((enums[0] === false && enums[1] === true) || (enums[1] === false && enums[0] === true));
}

const INITIAL_VALUES = {

    "civNumber": "CIV X",
    "copyTo": [],
    "dateString": "1 May 2018",
    "defendants": [
        {
            "_keyIndex": 8,
            "name": "Mike Defendant"
        }
    ],
    "depositAmount": "2",
    "documents": [
        {
            "_keyIndex": 9,
            "name": "1234123412"
        }
    ],
    "filename": "Vendors Settlement Statement",
    "filingFee": {
        "amount": "323243",
        "include": true
    },
    "matter": {
        "assets": [
            {
                "_keyIndex": 11,
                "address": "x",
                "registry": "z",
                "uniqueIdentifier": "y"
            }
        ],
        "matterId": "234"
    },
    "plantiffs": [
        {
            "_keyIndex": 10,
            "name": "Barry Plantiff"
        }
    ],
    "purchaseAmount": "1",
    "purchaserNames": [
        {
            "_keyIndex": 13,
            "name": "purch"
        }
    ],
    "recipient": {
        "contactMethod": {
            "address": {
                "country": "New Zealand"
            },
            "email": "pewpwe@email.com",
            "method": "email"
        },
        "individuals": [
            {
                "_keyIndex": 6,
                "firstName": "Test",
                "surname": "Name"
            }
        ],
        "recipientType": "individuals"
    },
    "senders": [
        {
            "_keyIndex": 7,
            "email": "asdf",
            "firstName": "x"
        }
    ],
    "settlementStatement": {
        "levies": {
            "include": false,
            "instalmentsPaid": {}
        },
        "rates": {
            "amount": "1",
            "annumRate": "1",
            "days": "1",
            "instalmentsPaid": {
                "paid": false
            },
            "localAuthourity": "1"
        },
        "totalAmount": "2",
        "totalCredits": "1",
        "totalDebits": "2"
    },
    "vendorNames": [
        {
            "_keyIndex": 12,
            "name": "vend"
        }
    ]

} as any;

interface SuggestionProps {
    schema: Jason.Schema,
    name?: string,
    selector: Jason.SelectorType;
    context?: any;
    fieldNames: string[],
}

const DROPDOWN_LIST_SIZE = 0;


interface DropdownSuggestionListProps {
    data: any[];
    onSelect: (value: any) => void;
    buttonText?: string;
    showCustom?: boolean;
}


class SelectList extends React.PureComponent<any>{
    render(){
        return <div >
            <ReactWidgetList {...this.props} />
            <ul className="rw-list">
             <li className="rw-list-option highlight" onClick={() => this.props.onSelect({})}>Custom</li>
             </ul>
        </div>
    }
}

class DropdownSuggestionList extends React.PureComponent<DropdownSuggestionListProps, {open: boolean}> {
    constructor(props: DropdownSuggestionListProps) {
        super(props);
        this.state = {open: false};
    }

    render() {
        let { open } = this.state;
        let toggleWidget = () => this.setState({ open: !open });
        const showCustom = this.props.showCustom;
        return <div className="hide-button">
            <Button onClick={() => { !this.state.open && this.setState({open : true})}}>{ this.props.buttonText || ''} <span className="caret"></span></Button>
            <DropdownList
              open={open}
              filter
              data={this.props.data}
              listComponent={showCustom ? SelectList : ReactWidgetList}
              textField={'title'}
              value={''}
              onToggle={toggleWidget}
              onSelect={(e) => {
                  this.props.onSelect(e.value);
                  this.setState({open: false})
              }}
            />
            </div>
    }
}

const OverlayMenuItem = (props: {key: number, item: any,  onSelect?: () => void; handleSelect: (value: any) => void}) => {
    const { key, item,  handleSelect, onSelect } = props;
    return <OverlayTrigger key={key} overlay={<Tooltip id={item.title}>{item.title}</Tooltip>}>
            <MenuItem eventKey={key}  onSelect={() => { handleSelect(item.value); onSelect(); }}>
              { item.title }
        </MenuItem>
    </OverlayTrigger>
}


class UnconnectedSuggestions extends React.PureComponent<SuggestionProps> {
    constructor(props: SuggestionProps) {
        super(props);
        this.change = this.change.bind(this);
    }
    change(values: any) {
        this.props.fieldNames.map((name: string) => {
            const field = (this.props as any)[name] as any;
            field.input.onChange(values[name]);
        });
    }
    render() {
        const { schema, selector, name } = this.props;
        let suggestionList = suggestions(schema);

        if(suggestionList){
            const sourcePath = inputSource(schema);
            if(sourcePath){
                suggestionList = getFromContext(sourcePath, this.props.context) || [];
            }
            if(!suggestionList.length){
                return false;
            }
            return  <FormGroup>
                <Col sm={3} className="text-right">
                    <ControlLabel>Lookup</ControlLabel>
                </Col>
                <Col sm={7}>
                { suggestionList.length >= DROPDOWN_LIST_SIZE &&
                    <DropdownSuggestionList data={suggestionList} onSelect={this.change} />
                }
                { suggestionList.length < DROPDOWN_LIST_SIZE && <DropdownButton title={''} id={name}>
                    { (suggestionList).map((sug: any, index: number) => {
                        return <OverlayMenuItem key={index} item={sug} handleSelect={() => this.change(sug.value)} />
                    }) }
                  </DropdownButton> }
            </Col>
            </FormGroup>
        }
        return false;
    }
}

const Suggestions = connect<{}, {}, FormSetProps>((state: Jason.State, ownProps: SuggestionProps) => {

    //const value = //(ownProps.selector(state, ownProps.name) || {})
    return {  }

})(UnconnectedSuggestions as any);


interface FormSetProps {
    schema: Jason.Schema,
    subSchema?: Jason.Schema,
    showTitle?: boolean,
    title?: string,
    name?: string,
    index?: number,
    selector: Jason.SelectorType;
    context?: any;
}


class UnconnectedFormSet extends React.PureComponent<FormSetProps> {
    render() {
        const { schema, subSchema, selector, index, name, showTitle, title: parentTitle } = this.props;
        const { properties, title } = schema;
        const schemaProps = properties;
        if(!properties){
            return false;
        }
        let keys = Object.keys(schemaProps);
        if(subSchema){
            keys = keys.concat(Object.keys(subSchema));
        }
        return (
            <fieldset>
             { (parentTitle || title) && <legend>{parentTitle || title}</legend>}
             {<Fields key={index} names={keys} component={Suggestions} schema={schema} name={this.props.name} fieldNames={keys} selector={selector} context={this.props.context} /> }
                { Object.keys(schemaProps).map((key, i) => {
                    return <RenderField key={i} field={schemaProps[key]} name={key} selector={selector} index={index} parentName={name} context={this.props.context} />
                }) }
                { subSchema && <FormSet schema={subSchema} name={this.props.name} selector={selector} context={this.props.context} /> }
            </fieldset>
        );

    }
}

const FormSet = connect<{}, {}, FormSetProps>((state: Jason.State, ownProps: FormSetProps) => {
    if(ownProps.schema.oneOf) {
        const getMatchingOneOf = (oneOfs: any, value: any, key: string) => {
            return oneOfs.filter((x : Jason.Schema) => x.properties[key].enum[0] === value)[0] || {};
        };
        let selectKey;
        const { properties } = ownProps.schema;
        Object.keys(properties).map((key, i) => {
            if(properties[key].enum || properties[key].type === 'boolean'){
                selectKey = key;
            }
        });
        if(selectKey){
            const value = (ownProps.selector(state, ownProps.name) || {})[selectKey];
            if(value){
                return {
                    subSchema: getMatchingOneOf(ownProps.schema.oneOf, value, selectKey)
                }
            }
        }

    }
    return {

    }
})(UnconnectedFormSet as any);


class RenderField extends React.PureComponent<{field: any, name: string, index?: number, parentName?: string, context?: any, selector: (name: any) => any}> {
    render() : false | JSX.Element {
        const { name, field, selector, index } = this.props;
        const title = field.enumeratedTitle ? formatString(field.enumeratedTitle, index+1) : field.title;
        switch(field.type){
            case 'object': {
                const deepName = this.props.parentName ? `${this.props.parentName}.${name}` : name;
                return <FormSection name={name}>
                        <FormSet schema={(this.props.field as Jason.Schema)} name={deepName} selector={selector} index={index} context={this.props.context} title={title}/>
                    </FormSection>
            }
            case 'array': {
                return <FieldArray name={name} component={FieldsArray} props={{field: field.items, title: field.title, selector, index}} context={this.props.context} />
            }
            case 'string': {
                const subType = componentType(field);
                switch(subType){
                    case 'textarea':
                        return <Field title={title} name={name} component={TextAreaFieldRow} context={this.props.context} />
                    case 'date':
                        return <Field title={title} name={name} component={DateFieldRow} formatDate={field.formatDate} context={this.props.context}/>
                    default:
                        return <Field title={title} name={name} component={TextFieldRow} context={this.props.context}/>
                }
            }
            case 'number': {

                return <Field title={title} name={name} component={NumberFieldRow} context={this.props.context}/>
            }
            case 'boolean':
                return <Field title={title} name={name} component={CheckboxFieldRow} context={this.props.context}/>
            case undefined: {
                // the > 1 check is a easy way to not render the oneOf match structures (causes a duplication of the field)
                if(field.enum && field.enum.length > 1){
                    if(isCheckbox(field.enum)){
                        return <Field title={title} name={name} component={CheckboxFieldRow} context={this.props.context}/>
                    }
                    return <Field title={title} name={name} component={SelectFieldRow} context={this.props.context}>
                         <option value="" disabled>Please Select...</option>
                        { field.enum.map((f: string, i: number) => {
                            return <option key={i} value={f}>{field.enumNames ? field.enumNames[i] : f}</option>
                        })}
                    </Field>
                }
            }
        }

        return false;
    }
}

class MoveUpButton extends React.PureComponent<any> {
    render() {
        const { swapFields, index, numItems, forceDisplay } = this.props;
        const disabled = index === 0;

        if (disabled && !forceDisplay) {
            return false;
        }

        return(
            <button type="button" className="btn btn-default" onClick={() => swapFields(index, index - 1)} disabled={disabled}>
                <Glyphicon glyph="arrow-up"/>
            </button>
        );
    }
}

class MoveDownButton extends React.PureComponent<any>{
    render(){
        const { swapFields, index, numItems, forceDisplay } = this.props;
        const disabled = index + 1 === numItems;

        if (disabled && !forceDisplay) {
            return false;
        }

        return (
            <button type="button" className="btn btn-default" onClick={() => swapFields(index, index + 1)} disabled={disabled}>
                <Glyphicon glyph="arrow-down"/>
            </button>
        );
    }
}
class RemoveButton extends React.PureComponent<any>{
    render(){
        const { index, numItems, minItems, forceDisplay, removeField } = this.props;
        const disabled = minItems >= numItems;

        if (disabled && !forceDisplay) {
            return false;
        }

        return (
            <button type="button" className="btn btn-default" onClick={() => removeField(index)} disabled={disabled}>
                <Glyphicon glyph="remove"/>
            </button>
        );
    }
}



class ListItemControls extends React.PureComponent<any> {
    render() {
        const { index, numItems,inline, fields: { swap, remove }} = this.props;
        return <div className={`${inline ? 'btn-group' : 'btn-group-vertical'} btn-group-xs`} style={{position: 'absolute', right: 0, top: 0}}>
            <MoveUpButton key={0} index={index} swapFields={swap} numItems={numItems} forceDisplay={true} />
            <MoveDownButton key={1} index={index} swapFields={swap} numItems={numItems} forceDisplay={true} />
            <RemoveButton key={2} index={index} removeField={remove} numItems={numItems} forceDisplay={true} />
            </div>

    }
}



class FieldsArray extends React.PureComponent<any> {
    add() {
         const { fields, field } = this.props;
        let suggestionList = suggestions(field);
        if(suggestionList){
            const sourcePath = inputSource(field);
            if(sourcePath){
                suggestionList = getFromContext(sourcePath, this.props.context) || [];
            }
            if(suggestionList.length < DROPDOWN_LIST_SIZE) {
                 return <DropdownButton title={ addItem(field) } id={fields.name}>
                    { (suggestionList).map((sug: any, index: number) => {
                     return <OverlayMenuItem key={index} item={sug} handleSelect={() => fields.push({_keyIndex: getKey(), ...sug.value})} />
                    }) }
                     <MenuItem divider />
                     <MenuItem eventKey={suggestionList.length} onSelect={() => fields.push({_keyIndex: getKey()})}>Custom</MenuItem>
                </DropdownButton>
            }
            else{
                return <DropdownSuggestionList showCustom={true} data={suggestionList} onSelect={(sug) => fields.push({_keyIndex: getKey(), ...sug})} buttonText={addItem(field)}/>
            }
        }
        return <Button onClick={() => fields.push({_keyIndex: getKey()})}>
                 { addItem(field) }
              </Button>
    }
    render() {
        const { fields, field, title, selector } = this.props;
        const inline = controlStyle(field) === 'inline';
        return <fieldset className="list">
            { title && <legend>{ title }</legend>}
            <FlipMove duration={250} easing="ease-out">
            { fields.map((name: any, index: number) => {
                return <div key={fields.get(index)._keyIndex} className="list-item">
                    <div style={{position: 'relative', minHeight: inline ? 0 : 70}}>
                    <RenderField  name={name} field={field} selector={selector} index={index} context={this.props.context} />
                    <ListItemControls fields={fields} index={index} numItems={fields.length} name={name} inline={inline}/>
                    </div>
                    { index < fields.length - 1 && <hr/>}
                </div>
            }) }
            </FlipMove>
            { this.props.meta.error && <div className="alert alert-danger">
                { (this.props.meta.error as any).map((error: string, index: number) => <div key={index}>{ error } </div>) }
            </div> }

            <div className="text-center form-group">
                { this.add() }
          </div>
            </fieldset>
        }
}




function FieldRow(Component: any) : any {

    return class Wrapped extends React.PureComponent<any> {
        getValidationState() {
            if(this.props.meta.touched){
                return this.props.meta.valid ? 'success' : 'error';
            }
            return null;
        }

        render(){
            const props = this.props;
            return <FormGroup validationState={this.getValidationState()}>
                <Col sm={3} className="text-right">
                    <ControlLabel>{ props.title }</ControlLabel>
                </Col>
                <Col sm={this.props.columnWidth || 7}>
                     <Component {...props} />
                    <FormControl.Feedback />
                </Col>
            </FormGroup>
        }

    }
}


class RenderForm extends React.PureComponent<InjectedFormProps & {schema: Jason.Schema, context: any}> {

    render() {
        const { schema } = this.props;
        return <Form horizontal>
            <p/>
                <FormSet schema={schema} selector={formValueSelector(this.props.form)} showTitle={false} context={this.props.context}/>
                { this.props.error && <div className="alert alert-danger">
                { (this.props.error as any).map((error: string, index: number) => <div key={index}>{ error } </div>) }
                </div> }
        </Form>
    }
}

const InjectedRenderForm = reduxForm<any>({})(RenderForm) as any;


class SchemaView extends React.PureComponent<{schema: Jason.Schema}> {
    render() {
        return <pre>
            { JSON.stringify(this.props.schema.properties, null, 4) }
        </pre>
    }
}

interface FormViewProps {
    schema: Jason.Schema;
    name: string;
    validate: Jason.Validate;
    context: any;
    showPreview: () => void;
    showComplete: () => void;
    reset: (name: string, values: any) => void;
    initialValues?: any;
}

class FormView extends React.PureComponent<FormViewProps> {
    constructor(props: FormViewProps) {
        super(props);
        this.reset = this.reset.bind(this);
    }

    reset() {
        this.props.reset(this.props.name, setDefaults(this.props.schema, {}, this.props.initialValues || INITIAL_VALUES));
    }

    render() {
        return <div>
            <InjectedRenderForm
                schema={this.props.schema}
                form={this.props.name}
                key={this.props.name}
                validate={this.props.validate}
                initialValues={setDefaults(this.props.schema, {}, this.props.initialValues || INITIAL_VALUES)}
                context={this.props.context}
                />
            <div className="button-row">
                { <Button onClick={this.reset}>Reset</Button> }
                { <Button bsStyle={'success'} onClick={this.props.showComplete}>Finish</Button> }
                { <Button bsStyle={'info'} onClick={this.props.showPreview}>Preview</Button> }
            </div>

        </div>
    }
}


class Errors extends React.PureComponent<{errors: any, name: string, values: any, dirty: boolean,
    touch: (form: string, ...fields: string[]) => void,
    showRestore: () => void}>{
    constructor(props: any) {
        super(props);
        this.navWillLeave = this.navWillLeave.bind(this);
    }

    navWillLeave() {
        if(localStorage){
            localStorage.setItem('saved', JSON.stringify({
                values: this.props.values,
                name: this.props.name
            }));

        }
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.navWillLeave);
        if(localStorage.getItem('saved')){
            try{
                const state = JSON.parse(localStorage.getItem('saved'));
                // if parses, a good start
                this.props.showRestore();
            }
            catch(e){
                localStorage.removeItem('saved');
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.navWillLeave);
    }


    touchAll() {
        const fields = getFieldsFromErrors(this.props.errors);
        this.props.touch(this.props.name, ...fields);
    }
    render() {
        return false;
    }
}


const ConnectedErrors = connect((state: Jason.State, ownProps: any) => {
    const values = getFormValues(ownProps.name)(state)
    return {errors: getFormSyncErrors(ownProps.name)(state), values, dirty: isDirty(ownProps.name)(state)}
}, { touch, showRestore }, undefined, {withRef: true})(Errors as any);

interface WizardViewProps {
    schema: Jason.Schema,
    context: any;
    name: string,
    validate: Jason.Validate,
    validatePages: Jason.Validate[],
    showPreview: () => void;
    showComplete: () => void;
    reset: (name: string, values: any) => void;
    setWizardPage: (page: number) => void;
    page: number;
    initialValues?: any;
}


class WizardView extends React.PureComponent<WizardViewProps> {

    constructor(props: WizardViewProps) {
        super(props);
        this.nextStep = this.nextStep.bind(this);
        this.prevStep = this.prevStep.bind(this);
        this.finish = this.finish.bind(this);
        this.reset = this.reset.bind(this);
    }

    lastStep() {
        return this.props.page === this.props.schema.wizard.steps.length - 1;
    }

    firstStep() {
        return this.props.page === 0;
    }

    validate() {
        if(!(this.refs.form as any).valid){
            ((this.refs.errors as any).getWrappedInstance() as Errors).touchAll();
            return false;
        }
        return true;
    }

    nextStep() {
        if(this.validate() && !this.lastStep()){
            this.props.setWizardPage(this.props.page+1);
        }
    }

    finish() {
        if(this.validate()){
            this.props.showComplete();
        }
    }

    prevStep() {
        if(!this.firstStep()){
            this.props.setWizardPage(this.props.page-1)
        }
    }

    reset() {
        this.props.reset(this.props.name, setDefaults(this.props.schema, {}, this.props.initialValues || INITIAL_VALUES));
    }

    render() {
        return <div>
            <br/>
            <ProgressBar striped bsStyle="success"
                now={(this.props.page+1)/(this.props.schema.wizard.steps.length) * 100}
                label={`Step ${this.props.page+1} of ${this.props.schema.wizard.steps.length}`}

                />

            <InjectedRenderForm
                ref="form"
                schema={getSubSchema(this.props.schema, this.props.page)}
                form={this.props.name}
                key={`${this.props.name}-${this.props.page}`}
                validate={this.props.validatePages[this.props.page]}
                destroyOnUnmount={false}
                forceUnregisterOnUnmount={true}
                initialValues={setDefaults(this.props.schema, {}, this.props.initialValues || INITIAL_VALUES)}
                context={this.props.context}
                />
            <ConnectedErrors ref="errors" name={this.props.name} key={this.props.page} />
            <div className="button-row">
                { <Button onClick={this.reset}>Reset</Button> }
                { !this.firstStep() && <Button onClick={this.prevStep}>Back</Button> }
                { !this.lastStep() && <Button bsStyle={'success'} onClick={this.nextStep}>Next</Button> }
                { (this.lastStep() || true) && <Button bsStyle={'success'} onClick={this.finish}>Finish</Button> }
                { <Button bsStyle={'info'} onClick={this.props.showPreview}>Preview</Button> }
            </div>
        </div>
    }
}

const ConnectedWizardView = connect((state: Jason.State, ownProps: any) => ({
    page: (state.wizard[ownProps.name] || {page: 0}).page
}), (dispatch, ownProps) => ({
    setWizardPage: (page: number) => dispatch(setWizardPage({name: ownProps.name, page}))
}))(WizardView as any);



export class TemplateViews extends React.PureComponent<{
    category: string, schema: string,
    context: any;
    showPreview : () => void,
    showComplete: () => void,
    reset: (name: string, values: any) => void,
    initialValues: any;
}> {
    render() {
        const { category, schema } = this.props;
        const name = `${category}.${schema}`;
        const type = templateSchemas[category].schemas[schema];
        if(!type) {
            return false;
        }
        const hasWizard = !!type.schema.wizard;
        return   <Tabs defaultActiveKey={hasWizard ? 3 : 2} id="tab-view" unmountOnExit={true} key={name}>
            {/* <Tab eventKey={1} title="Schema">
                <SchemaView schema={type.schema} />
            </Tab> */ }
             <Tab eventKey={2} title="Form">
                <FormView schema={type.schema} validate={type.validate} name={name}
                showPreview={this.props.showPreview}
                showComplete={this.props.showComplete}
                reset={this.props.reset}
                context={this.props.context}
                initialValues={this.props.initialValues}
                />
            </Tab>
            {hasWizard && <Tab eventKey={3} title="Wizard">
                <ConnectedWizardView
                schema={type.schema}
                validate={type.validate}
                validatePages={type.validatePages}
                name={name}
                showPreview={this.props.showPreview}
                showComplete={this.props.showComplete}
                reset={this.props.reset}
                context={this.props.context}
                intitalValues={this.props.initialValues}
                 />
                }
            </Tab> }
        </Tabs>
    }
}

const InjectedTemplateViews = connect<{context: any}>(undefined, {
    showPreview: () => showPreview({}),
    showComplete: () => showComplete({}),
    reset: (formName: string, values: any) => showConfirmation({title: 'Reset Form',
                                  message: 'Are you sure you wish to reset the form?',
                                  rejectLabel: 'Cancel', acceptLabel: 'Reset',
                                  acceptActions: [initialize(formName, values), setWizardPage({name: formName, page: 0})]})
  })(formValues<any>('category', 'schema')(TemplateViews) as any) as any;


class RenderDateTimePicker extends React.PureComponent<WrappedFieldProps & {formatDate: string}> {
    render() {

        const  { input: { onChange, value, onBlur }, formatDate} = this.props;
        const readFormats = [formatDate, "D M YYYY", "D MMM YYYY", "D/M/YYYY", "D-M-YYYY", "D MMMM YYYY"];
        return   <DateTimePicker
            onBlur={() => onBlur(undefined)}
            onChange={(date, string) => formatDate ? onChange(string) :  onChange(date)}
            parse={(string) => {
                const mo = moment(string, readFormats)
                return mo.isValid() ? mo.toDate() : null;
                }
            }
            format={this.props.formatDate}
            time={false}
            value={!value ? null : new Date(value)}
          />
    }
}



class ToggleButtonField extends React.PureComponent<WrappedFieldProps> {
    render() {
        return <ToggleButtonGroup {...this.props.input}  type="radio">
            { this.props.children }
        </ToggleButtonGroup>
    }
}

class SelectField extends React.PureComponent<WrappedFieldProps> {
    render() {
        return <FormControl {...this.props.input} componentClass="select">
            { this.props.children }
        </FormControl>
    }
}

class CheckboxField extends React.PureComponent<WrappedFieldProps> {
    render() {
        return <FormControl {...this.props.input} componentClass={'input'} type="checkbox" className="checkbox" />
    }
}

class TextField extends React.PureComponent<WrappedFieldProps> {
    render() {
        return <FormControl {...this.props.input} componentClass="input" />
    }
}

class NumberField extends React.PureComponent<WrappedFieldProps> {
    render() {
        return <FormControl {...this.props.input} componentClass="input" type="number"/>
    }
}


class TextAreaField extends React.PureComponent<WrappedFieldProps> {
    render() {
        return <FormControl {...this.props.input} componentClass="textarea" />
    }
}

class DateField extends React.PureComponent<WrappedFieldProps> {
    render() {
        return <FormControl {...this.props} {...this.props.input}  componentClass={RenderDateTimePicker}  />
    }
}

export const ToggleButtonFieldRow = FieldRow(ToggleButtonField);
export const SelectFieldRow = FieldRow(SelectField);
export const TextFieldRow = FieldRow(TextField);
export const TextAreaFieldRow = FieldRow(TextAreaField);
export const DateFieldRow = FieldRow(DateField);
export const CheckboxFieldRow = FieldRow(CheckboxField);
export const NumberFieldRow = FieldRow(NumberField);

interface OptionListProps {
    keys: string[],
    schemas: any
}

const OptionList = (props: OptionListProps) => {
    const { keys, schemas } = props;
    keys.sort((a:string, b:string) => schemas[a].schema.title.localeCompare(schemas[b].schema.title));
    return <Fragment>
    { keys.map((key: string) => {
            return <option key={key} value={key}>{ schemas[key].schema.title }</option>
        }) }
    </Fragment>
}

class SchemaField extends React.PureComponent<WrappedFieldProps & {category: string}> {
    render() {
        const keys = Object.keys(templateSchemas[this.props.category].schemas);
        const categories = keys.reduce((result: any, key: string) => {
            const category = templateSchemas[this.props.category].schemas[key].schema.category;
            result[category] = [...(result[category] || []), key];
            return result;
        }, {});
        const categoryKeys = Object.keys(categories).sort();

        return <SelectField meta={this.props.meta} input={this.props.input}>
        { !templateSchemas[this.props.category].schemas[this.props.input.value] && <option value={this.props.input.value} disabled>Please select...</option> }
            { categoryKeys.map((category: string) => {
                const options = <OptionList keys={categories[category]} schemas={templateSchemas[this.props.category].schemas} />
                if(category !== "undefined"){
                    return <optgroup label={category}>
                        { options }
                        </optgroup>
                }
                return options;
            }) }

        </SelectField>
    }
}

const SchemaFieldWithCategory = formValues<any>('category')(SchemaField);


const getFromContext = (path: string, context: any) => {
    return (context || {})[path];
}


export class FormLoader extends React.PureComponent<InjectedFormProps& {context?: any}> {
    render() {
        return <div className="jasons-formal">

        <Grid>
                <Col md={6} mdOffset={3}>
        <Form  horizontal>
            <FormGroup controlId="formControlsSelect">
                    <Col sm={2}>
                    <ControlLabel>Category</ControlLabel>
                </Col>
                <Col sm={10}>
                    <Field name="category" component={SelectField as any}>
                        { Object.keys(templateSchemas).map((key: string) => {
                            return <option key={key} value={key}>{ key }</option>
                        }) }
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup controlId="formControlsSelect">
                <Col sm={2}>
                    <ControlLabel>Schema</ControlLabel>
                </Col>
                <Col sm={10}>
                    <Field name="schema" component={SchemaFieldWithCategory as any} />
                </Col>
            </FormGroup>
        </Form>
        </Col>
    </Grid>
    <Grid fluid>
        <Col md={6} mdOffset={3}>
            <InjectedTemplateViews context={this.props.context}/>
        </Col>
     </Grid>
    </div>
    }
}

class UnconnectedSimpleFormLoader extends React.PureComponent<InjectedFormProps & {context?: any, formValues?: any}> {
    render() {
        return <div className="jasons-formal">
        <Grid>
                <Col md={6} mdOffset={3}>
            <Form  horizontal>
                <FormGroup controlId="formControlsSelect">
                        <ControlLabel>Schema</ControlLabel>
                        <Field name="schema" component={SchemaFieldWithCategory as any} />
                </FormGroup>
                </Form>
                </Col>
                </Grid>
         <InjectedTemplateViews context={this.props.context} initialValues={this.props.formValues}/>
    </div>
    }
}

export const SimpleFormLoader = reduxForm<{}>({
    form: 'formLoader'
})(UnconnectedSimpleFormLoader) as any; //hack


export default reduxForm<{}>({
    form: 'formLoader'
})(FormLoader) as any; //hack
