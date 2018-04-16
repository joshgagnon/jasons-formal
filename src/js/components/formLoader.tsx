import * as React from "react";
import { reduxForm, InjectedFormProps, Field, WrappedFieldProps, formValues, FormSection, FieldArray, formValueSelector, getFormValues, initialize, touch, getFormSyncErrors, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import templateSchemas from '../schemas';
import { FormGroup, ControlLabel, FormControl, Form, Col, Grid, Tabs, Tab, Button, Glyphicon, ProgressBar, ToggleButtonGroup, DropdownButton, MenuItem, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { componentType, getKey, addItem, setDefaults, getValidate, controlStyle, formatString, getSubSchema, getFieldsFromErrors, suggestions } from 'json-schemer';
import FlipMove from 'react-flip-move';
import { render, showPreview, showComplete, showConfirmation, showRestore, setWizardPage } from '../actions';
import PDF from 'react-pdf-component/lib/react-pdf';
import Loading from './loading';
import * as DateTimePicker from 'react-widgets/lib/DateTimePicker'
import * as moment from 'moment';

export const required = (value : any) => (value ? undefined : 'Required')

function isCheckbox(enums : (string | boolean)[]) {
    return enums.length === 2 && ((enums[0] === false && enums[1] === true) || (enums[1] === false && enums[0] === true));
}

const INITIAL_VALUES = {};


interface FormSetProps {
    schema: Jason.Schema,
    subSchema?: Jason.Schema,
    showTitle?: boolean,
    name?: string,
    index?: number,
    selector: Jason.SelectorType
}


class UnconnectedFormSet extends React.PureComponent<FormSetProps> {
    render() {
        const { schema, subSchema, selector, index, name, showTitle } = this.props;
        const { properties, title } = schema;
        const schemaProps = properties;
        if(!properties){
            return false;
        }

        return (
            <fieldset>
             { title && showTitle !== false && <legend>{title}</legend>}
                { Object.keys(schemaProps).map((key, i) => {
                    return <RenderField key={i} field={schemaProps[key]} name={key} selector={selector} index={index} parentName={name}/>
                }) }
                { subSchema && <FormSet schema={subSchema} name={this.props.name} selector={selector} /> }
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
            if(properties[key].enum){
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


class RenderField extends React.PureComponent<{field: any, name: string, index?: number, parentName?: string, selector: (name: any) => any}> {
    render() : false | JSX.Element {
        const { name, field, selector, index } = this.props;
        const title = field.enumeratedTitle ? formatString(field.enumeratedTitle, index+1) : field.title;
        switch(field.type){
            case 'object': {
                const deepName = this.props.parentName ? `${this.props.parentName}.${name}` : name;
                return <FormSection name={name}>
                        <FormSet schema={(this.props.field as Jason.Schema)} name={deepName} selector={selector} index={index}/>
                    </FormSection>
            }
            case 'array': {
                return <FieldArray name={name} component={FieldsArray} props={{field: field.items, title: field.title, selector, index}} />
            }
            case 'string': {
                const subType = componentType(field);
                switch(subType){
                    case 'textarea':
                        return <Field title={title} name={name} component={TextAreaFieldRow} />
                    case 'date':
                        return <Field title={title} name={name} component={DateFieldRow} formatDate={field.formatDate}/>
                    default:
                        return <Field title={title} name={name} component={TextFieldRow} />
                }
            }
            case undefined: {
                // the > 1 check is a easy way to not render the oneOf match structures (causes a duplication of the field)

                if(field.enum && field.enum.length > 1){
                    if(isCheckbox(field.enum)){
                        return <Field title={title} name={name} component={CheckboxFieldRow} />
                    }
                    return <Field title={title} name={name} component={SelectFieldRow}>
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
        const suggestionList = suggestions(field);
        if(suggestionList){
            return <DropdownButton title={ addItem(field) } id={fields.name}>
                { suggestionList.map((sug: any, index: number) => {
                    return <OverlayTrigger key={index} overlay={<Tooltip id={sug.title}>{sug.title}</Tooltip>}>
                        <MenuItem eventKey={index}  onSelect={() => fields.push({_keyIndex: getKey(), ...sug.value})}>
                          { sug.title }
                    </MenuItem>
                        </OverlayTrigger>
                }) }
                 <MenuItem divider />
                 <MenuItem eventKey={suggestionList.length} onSelect={() => fields.push({_keyIndex: getKey()})}>Custom</MenuItem>
            </DropdownButton>
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
                return <div key={fields.get(index)._keyIndex}>
                    <div style={{position: 'relative', minHeight: inline ? 0 : 70}}>
                    <RenderField  name={name} field={field} selector={selector} index={index} />
                    <ListItemControls fields={fields} index={index} numItems={fields.length} name={name} inline={inline}/>
                    </div>
                </div>
            }) }
            </FlipMove>
            <div className="text-center">
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


class RenderForm extends React.PureComponent<InjectedFormProps & {schema: Jason.Schema}> {

    render() {
        const { schema } = this.props;
        return <Form horizontal>
            <p/>
                <FormSet schema={schema} selector={formValueSelector(this.props.form)} showTitle={false}/>
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
    showPreview: () => void;
    showComplete: () => void;
    reset: (name: string, values: any) => void;
}

class FormView extends React.PureComponent<FormViewProps> {

    constructor(props: FormViewProps) {
        super(props);
        this.reset = this.reset.bind(this);
    }

    reset() {
        this.props.reset(this.props.name, setDefaults(this.props.schema, {}, INITIAL_VALUES));
    }

    render() {
        return <div>
            <InjectedRenderForm
                schema={this.props.schema}
                form={this.props.name}
                key={this.props.name}
                validate={this.props.validate}
                initialValues={setDefaults(this.props.schema, {}, INITIAL_VALUES)}
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
    name: string,
    validate: Jason.Validate,
    validatePages: Jason.Validate[],
    showPreview: () => void;
    showComplete: () => void;
    reset: (name: string, values: any) => void;
    setWizardPage: (page: number) => void;
    page: number
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
        this.props.reset(this.props.name, setDefaults(this.props.schema, {}, INITIAL_VALUES));
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
                initialValues={setDefaults(this.props.schema, {}, INITIAL_VALUES)}
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



export class TemplateViews extends React.PureComponent<{category: string, schema: string,
    showPreview : () => void,
    showComplete: () => void,
    reset: (name: string, values: any) => void
}> {
    render() {
        const { category, schema } = this.props;
        const name = `${category}.${schema}`;
        const type = templateSchemas[category].schemas[schema];
        if(!type) {
            return false;
        }
        const hasWizard = !!type.schema.wizard;
        return  <Grid fluid>
        <Col md={6} mdOffset={3}>
        <Tabs defaultActiveKey={hasWizard ? 3 : 2} id="tab-view" unmountOnExit={true} key={name}>
            {/* <Tab eventKey={1} title="Schema">
                <SchemaView schema={type.schema} />
            </Tab> */ }
             <Tab eventKey={2} title="Form">
                <FormView schema={type.schema} validate={type.validate} name={name}
                showPreview={this.props.showPreview}
                showComplete={this.props.showComplete}
                reset={this.props.reset}
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
                reset={this.props.reset} />
            </Tab> }
        </Tabs>
        </Col>

        </Grid>
    }
}

const InjectedTemplateViews = connect(undefined, {
    showPreview: () => showPreview({}),
    showComplete: () => showComplete({}),
    reset: (formName: string, values: any) => showConfirmation({title: 'Reset Form',
                                  message: 'Are you sure you wish to reset the form?',
                                  rejectLabel: 'Cancel', acceptLabel: 'Reset',
                                  acceptActions: [initialize(formName, values), setWizardPage({name: formName, page: 0})]})
  })(formValues<any>('category', 'schema')(TemplateViews) as any);


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


class SchemaField extends React.PureComponent<WrappedFieldProps & {category: string}> {
    render() {
        return <SelectField meta={this.props.meta} input={this.props.input}>
        { !templateSchemas[this.props.category].schemas[this.props.input.value] && <option value={this.props.input.value} disabled>Please select...</option> }
            { Object.keys(templateSchemas[this.props.category].schemas).map((key: string) => {
                return <option key={key} value={key}>{ templateSchemas[this.props.category].schemas[key].schema.title }</option>
            }) }
        </SelectField>
    }
}

const SchemaFieldWithCategory = formValues<any>('category')(SchemaField);


export class FormLoader extends React.PureComponent<InjectedFormProps> {
    render() {
        return <div>

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
        <InjectedTemplateViews />
    </div>
    }
}


export default reduxForm<{}>({
    form: 'formLoader'
})(FormLoader);

