import * as React from "react";
import { getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import templateSchemas from '../schemas';
import { render, showPreview } from '../actions';
import PDF from 'react-pdf-component/lib/react-pdf';
import Loading from './loading';


export function buildRenderObject(filename: string, category: string, schemaName: string, values : any, metadata = {}){
    const type = templateSchemas[category].schemas[schemaName];
    const schema = type.schema;
    return {
        formName: schema.formName,
        templateTitle: schema.title,
        values: {...values, filename},
        metadata,
        env: templateSchemas[category].name
    };
}


export interface UnconnectedPDFPreviewProps {

}

export interface PDFPreviewProps extends UnconnectedPDFPreviewProps {
    data?: any;
    downloadStatus: Jason.DownloadStatus
}

export class UnconnectedPDFPreview extends React.PureComponent<PDFPreviewProps> {
    render() {
        if(this.props.downloadStatus === Jason.DownloadStatus.InProgress)
            return <Loading />
        if(this.props.downloadStatus === Jason.DownloadStatus.Failed)
            return <div className="alert alert-danger">Could not generate document</div>
        if(this.props.downloadStatus === Jason.DownloadStatus.Complete)
            return <PDF data={this.props.data} scale={2.5} noPDFMsg=' '/>
        return false;
    }
}

const PDFPreview = connect((state : Jason.State, ownProps) => ({
    data: state.document.data,
    downloadStatus: state.document.downloadStatus
}))(UnconnectedPDFPreview as any);

export interface UnconnectedPreviewProps {
   category: string,
   schemaName: string,
   form: string,
   selector: Jason.SelectorType
}

export interface PreviewProps extends UnconnectedPreviewProps {
     render: (data: Jason.Actions.RenderPayload) => void,
     getValues: () => any,
}

export class UnconnectedPreview extends React.PureComponent<PreviewProps> {

    buildRenderObject(values : any, metadata = {}) {
        const type = templateSchemas[this.props.category].schemas[this.props.schemaName];
        return buildRenderObject(type.schema.title, this.props.category, this.props.schemaName, values, metadata);
    }

    componentWillMount() {
        const values = this.props.getValues();
        this.props.render({data: this.buildRenderObject(values)});

    }


    render() {
        return <div className="preview">
            <PDFPreview />
        </div>
    }
}


//formValues<any>('category', 'schema')(TemplateViews) as any)

export const Preview = connect<{}, {}, {}>((state: Jason.State, ownProps: UnconnectedPreviewProps) => {
    const formLoader = getFormValues('formLoader')(state) as any;

    return {
        schemaName: formLoader.schema,
        category: formLoader.category,
        getValues: () => getFormValues(`${formLoader.category}.${formLoader.schema}`)(state)
    }
}, {
    render,
})(UnconnectedPreview as any);