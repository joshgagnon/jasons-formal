import * as React from "react";
import { reduxForm, InjectedFormProps, Field, WrappedFieldProps, formValues, FormSection, FieldArray, formValueSelector, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import templateSchemas from '../schemas';
import { FormGroup, ControlLabel, FormControl, Form, Col, Grid, Tabs, Tab, Button, Glyphicon } from 'react-bootstrap';
import { componentType, getKey, addItem, setDefaults } from 'json-schemer';
import FlipMove from 'react-flip-move';
import { render } from '../actions';
import PDF from 'react-pdf-component/lib/react-pdf';


type SelectorType = (state: any, ...field: string[]) => any;

interface FormSetProps {
    schema: Jason.Schema,
    subSchema?: Jason.Schema
    name?: string,
    selector: SelectorType
}


class UnconnectedFormSet extends React.PureComponent<FormSetProps> {
    render() {
        const { schema, subSchema, selector } = this.props;
        const { properties, title } = schema;
        const schemaProps = properties;

        return (
            <fieldset>
             { title && <legend>{title}</legend>}
                { Object.keys(schemaProps).map((key, i) => {
                    return <RenderField key={i} field={schemaProps[key]} name={key} selector={selector}/>
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


class RenderField extends React.PureComponent<{field: any, name: string, selector: (name: any) => any}> {
    render() : false | JSX.Element {
        const { name, field, selector } = this.props;
        const title = field.title;
        switch(field.type){
            case 'object': {
                return <FormSection name={name}>
                        <FormSet schema={(this.props.field as Jason.Schema)} name={name} selector={selector}/>
                    </FormSection>
            }
            case 'array': {
                return <FieldArray name={name} component={FieldsArray} props={{field: field.items, title: field.title, selector}} />
            }
            case 'string': {
                const subType = componentType(field);
                switch(subType){
                    case 'textarea':
                        return <FieldRow title={title} name={name} component={TextAreaField} />
                    default:
                        return <FieldRow title={title} name={name} component={TextField} />
                }
            }
            case undefined: {
                // the > 1 check is a easy way to not render the oneOf match structures (causes a duplication of the field)
                if(field.enum && field.enum.length > 1){
                    return <FieldRow title={title} name={name} component={SelectField}>
                         <option value="" disabled>Please Select...</option>
                        { field.enum.map((f: string, i: number) => {
                            return <option key={i} value={f}>{field.enumNames ? field.enumNames[i] : f}</option>
                        })}
                    </FieldRow>
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
        const { index, numItems, fields: { swap, remove }} = this.props;
        return <div className="btn-group-vertical btn-group-xs" style={{position: 'absolute', right: 0, top: 0}}>
            <MoveUpButton key={0} index={index} swapFields={swap} numItems={numItems} forceDisplay={true} />
            <MoveDownButton key={1} index={index} swapFields={swap} numItems={numItems} forceDisplay={true} />
            <RemoveButton key={2} index={index} removeField={remove} numItems={numItems} forceDisplay={true} />
            </div>

    }
}


class FieldsArray extends React.PureComponent<any> {
    render() {
        const { fields, field, title, selector } = this.props;
        return <fieldset className="list">
            { title && <legend>{ title }</legend>}
            <FlipMove duration={250} easing="ease-out">
            { fields.map((name: any, index: number) => {
                return <div key={fields.get(index)._keyIndex}>
                    <div style={{position: 'relative', minHeight: 70}}>
                    <RenderField  name={name} field={field} selector={selector} />
                    <ListItemControls fields={fields} index={index} numItems={fields.length} name={name}/>
                    </div>
                    </div>
            }) }
            </FlipMove>
            <div className="text-center">
            <Button onClick={() => fields.push({_keyIndex: getKey()})}>
            { addItem(field) }
          </Button>
          </div>
            </fieldset>
        }
}




function FieldRow(props: {title: string, name: string, component: any, children? : any}) : JSX.Element{
    const {title, name, component, children } = props;
    return <FormGroup>
        <Col sm={3} className="text-right">
            <ControlLabel>{title}</ControlLabel>
        </Col>
        <Col sm={7}>
            <Field name={name} component={component as any}>
                { children }
            </Field>
        </Col>
    </FormGroup>
}





class RenderForm extends React.PureComponent<InjectedFormProps & {schema: Jason.Schema}> {

    render() {
        const { schema } = this.props;
        return <Form horizontal>
                <FormSet schema={schema} selector={formValueSelector(this.props.form)} />
                { this.props.error && <div className="alert alert-danger">
                { this.props.error }
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

const initialState = {"resolutionOptions":{"resolutionType":"Resolution at Board Meeting","dateOfMinute":"1","dateOfBoardMeeting":"1","chairperson":{"name":"1"}},"resolutions":[{"_keyIndex":1,"individualResolutionType":"Agent for Company Changes","resolutionOptions":{"nameOfAuthorisedAgent":"1"}}],"company":{"companyNumber":"1","companyName":"1"},"filename":"Board Resolution"};

class FormView extends React.PureComponent<{schema: Jason.Schema, name: string}> {
    render() {
        return <div>
            <InjectedRenderForm schema={this.props.schema} form={this.props.name} key={this.props.name} initialValues={initialState}/>
        </div>
    }
}


interface UnconnectedPDFPreviewProps {

}

interface PDFPreviewProps extends UnconnectedPDFPreviewProps {
    data?: any;
    downloadStatus: Jason.DownloadStatus
}

export class UnconnectedPDFPreview extends React.PureComponent<PDFPreviewProps> {
    render() {
        if(this.props.downloadStatus === Jason.DownloadStatus.Complete)
            return <PDF data={this.props.data} scale={2.5} />
        return false;
    }
}

const PDFPreview = connect((state : Jason.State, ownProps) => ({
    data: state.document.data,
    downloadStatus: state.document.downloadStatus
}))(UnconnectedPDFPreview as any);

interface UnconnectedPreviewProps {
   category: string,
   schemaName: string,
   form: string,
   selector: SelectorType
}

interface PreviewProps extends UnconnectedPreviewProps {
     render: (data: Jason.Actions.RenderPayload) => void,
     getValues: () => any,
}

export class UnconnectedPreview extends React.PureComponent<PreviewProps> {
    constructor(props: PreviewProps) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    buildRenderObject(values : any, metadata = {}) {
        const schema = templateSchemas[this.props.category].schemas[this.props.schemaName];
        const filename = schema.title;
        return {
            formName: schema.formName,
            templateTitle: schema.title,
            values: {...values, filename},
            metadata,
            env: templateSchemas[this.props.category].name
        };
    }

    submit() {
        this.props.render({data: this.buildRenderObject(this.props.getValues())});
    }

    render() {
        return <div className="preview">
            <div className="button-row text-center">
            <Button bsStyle="info" onClick={this.submit}>Render</Button>
            </div>
            <PDFPreview />
        </div>
    }
}

const Preview = connect<{}, {}, UnconnectedPreviewProps>((state: Jason.State, ownProps: UnconnectedPreviewProps) => ({
    getValues: () => ownProps.selector(state)
}), {
    render,
})(UnconnectedPreview as any);


export class TemplateViews extends React.PureComponent<{category: string, schema: string}> {
    render() {
        const { category, schema } = this.props;
        const name = `${category}.${schema}`;
        return  <Grid fluid>
        <Col md={6}>
        <Tabs defaultActiveKey={2} id="tab-view">
            <Tab eventKey={1} title="Schema">
                <SchemaView schema={templateSchemas[category].schemas[schema]} />
            </Tab>
            <Tab eventKey={2} title="Form">
                <FormView schema={templateSchemas[category].schemas[schema]} name={name} />
            </Tab>
        </Tabs>
        </Col>
        <Col md={6}>
            <Preview category={category} schemaName={schema} form={name} selector={getFormValues(name)}/>
        </Col>
        </Grid>
    }
}

const InjectedTemplateViews = formValues<any>('category', 'schema')(TemplateViews);

class SelectField extends React.PureComponent<WrappedFieldProps> {
    render() {
        return <FormControl {...this.props.input} componentClass="select">
            { this.props.children }
        </FormControl>
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

class SchemaField extends React.PureComponent<WrappedFieldProps & {category: string}> {
    render() {
        return <SelectField meta={this.props.meta} input={this.props.input}>
            { Object.keys(templateSchemas[this.props.category].schemas).map((key: string) => {
                return <option key={key} value={key}>{ templateSchemas[this.props.category].schemas[key].title }</option>
            }) }
        </SelectField>
    }
}

const SchemaFieldWithCategory = formValues<any>('category')(SchemaField);


export class FormLoader extends React.PureComponent<InjectedFormProps> {
    render() {
        return <div>
        <h1 className="text-center">Template Playground</h1>
        <Grid>
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
    </Grid>
        <InjectedTemplateViews />
    </div>
    }
}


export default reduxForm<{}>({
    form: 'formLoader',
})(FormLoader);

