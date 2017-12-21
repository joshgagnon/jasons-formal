import * as React from "react";
import { reduxForm, InjectedFormProps, Field, WrappedFieldProps, formValues } from 'redux-form';
import { connect } from 'react-redux';
import templateSchemas from '../schemas';
import { FormGroup, ControlLabel, FormControl, Form, Col, Grid, Tabs, Tab } from 'react-bootstrap';


class SchemaView extends React.PureComponent<{schema: Jason.Schema}> {
    render() {
        return <pre>
            { JSON.stringify(this.props.schema.properties, null, 4) }
        </pre>
    }
}

class FormView extends React.PureComponent<{schema: Jason.Schema}> {
    render() {
        return <pre>
            { JSON.stringify(this.props.schema.properties, null, 4) }
        </pre>
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
                <FormView schema={templateSchemas[category][schema]} />
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

