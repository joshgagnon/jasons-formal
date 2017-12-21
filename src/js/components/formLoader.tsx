import * as React from "react";
import { reduxForm, InjectedFormProps, Field, WrappedFieldProps, formValues } from 'redux-form';
import { connect } from 'react-redux';
import templateSchemas from '../schemas';
import { FormGroup, ControlLabel, FormControl, Form, Col, Grid } from 'react-bootstrap';


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
            { Object.keys((templateSchemas as any)[this.props.category]).map((key: string) => {
                return <option key={key} value={key}>{ key }</option>
            }) }
        </SelectField>
    }
}

const SchemaFieldWithCategory = formValues<any>('category')(SchemaField);

export class FormLoader extends React.PureComponent<InjectedFormProps> {
    render() {
        return <Grid>
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
    }
}


export default reduxForm<{}>({
    form: 'formLoader', 
})(FormLoader);

