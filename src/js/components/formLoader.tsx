import * as React from "react";
import { reduxForm, InjectedFormProps, Field, WrappedFieldProps, formValues, FormSection, FieldArray, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import templateSchemas from '../schemas';
import { FormGroup, ControlLabel, FormControl, Form, Col, Grid, Tabs, Tab, Button, Glyphicon } from 'react-bootstrap';
import { componentType, getKey, addItem } from 'json-schemer';
import FlipMove from 'react-flip-move';


class RenderField extends React.PureComponent<{field: any, name: string}> {
    render() {
        const { name, field } = this.props;
        const title = field.title;
        switch(field.type){
            case 'object': {
                return <FormSection name={name}>
                    { renderFormSet(this.props.field as Jason.Schema) }
                    </FormSection>
            }
            case 'array': {
                return <FieldArray name={name} component={FieldsArray} props={{field: field.items, title: field.title}} />
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
                if(field.enum){
                    return <FieldRow title={title} name={name} component={SelectField}>
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

class MoveUpButton extends React.PureComponent<any>{
    render(){
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


/*@connect((state, ownProps) => ({
    name
}))*/
class FieldsArray extends React.PureComponent<any> {
    render() {
        const { fields, field, title } = this.props;
        console.log(this.props)
        return <fieldset className="list">
            { title && <legend>{ title }</legend>}
            <FlipMove duration={250} easing="ease-out">
            { fields.map((name: any, index: number) => {
                return <div key={fields.get(index)._keyIndex}>
                    <div style={{position: 'relative', minHeight: 70}}>
                    <RenderField  name={name} field={field} />
                    <ListItemControls fields={fields} index={index} numItems={fields.length} name={name}/>
                    </div>
                    </div>
            }) }
            </FlipMove>
            <Button onClick={() => fields.push({_keyIndex: getKey()})}>
            { addItem(field) }
          </Button>
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


function renderFormSet(schema: Jason.Schema) : JSX.Element {
    const { properties, title } = schema;
    const schemaProps = properties;
    /*const getMatchingOneOf = (value: any, key: string) => {
        return (oneOfs.filter(x => x.properties[key].enum[0] === value)[0] || {}).properties || {};
    };*/
    let selectKey;
    Object.keys(schemaProps).map((key, i) => {
        if(schemaProps[key].enum){
            selectKey = key;
        }
    });
    return (
        <fieldset>
         { title && <legend>{title}</legend>}
            { Object.keys(schemaProps).map((key, i) => {
                return <RenderField key={i} field={schemaProps[key]} name={key}/>
            }) }
            { /*oneOfs && selectKey && fields[selectKey] && renderFormSet(getMatchingOneOf(fields[selectKey].value, selectKey), fields, null, null, ) */ }
        </fieldset>
    );
}



class RenderForm extends React.PureComponent<InjectedFormProps & {schema: Jason.Schema}> {

    render() {
        const { schema } = this.props;
        return <Form horizontal>
                { renderFormSet(schema) }
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

class FormView extends React.PureComponent<{schema: Jason.Schema, name: string}> {
    render() {
        return <div>
            <InjectedRenderForm schema={this.props.schema} form={this.props.name} />
        </div>
    }
}



export class TemplateViews extends React.PureComponent<{category: string, schema: string}> {
    render() {
        const { category, schema } = this.props;
        return  <Grid fluid>
        <Col md={6}>
        <Tabs defaultActiveKey={2} id="tab-view">
            <Tab eventKey={1} title="Schema">
                <SchemaView schema={templateSchemas[category][schema]} />
            </Tab>
            <Tab eventKey={2} title="Form">
                <FormView schema={templateSchemas[category][schema]} name={`${category}-${schema}`} />
            </Tab>
        </Tabs>
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
            { Object.keys(templateSchemas[this.props.category]).map((key: string) => {
                return <option key={key} value={key}>{ key }</option>
            }) }
        </SelectField>
    }
}

const SchemaFieldWithCategory = formValues<any>('category')(SchemaField);


export class FormLoader extends React.PureComponent<InjectedFormProps> {
    render() {
        return<div>
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

