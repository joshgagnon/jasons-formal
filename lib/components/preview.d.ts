/// <reference types="react" />
/// <reference types="react-redux" />
import * as React from "react";
export declare function buildRenderObject(filename: string, category: string, schemaName: string, values: any, metadata?: {}): {
    formName: string;
    templateTitle: string;
    values: any;
    metadata: {};
    env: string;
};
export interface UnconnectedPDFPreviewProps {
}
export interface PDFPreviewProps extends UnconnectedPDFPreviewProps {
    data?: any;
    downloadStatus: Jason.DownloadStatus;
}
export declare class UnconnectedPDFPreview extends React.PureComponent<PDFPreviewProps> {
    render(): false | JSX.Element;
}
export interface UnconnectedPreviewProps {
    category: string;
    schemaName: string;
    form: string;
    selector: Jason.SelectorType;
}
export interface PreviewProps extends UnconnectedPreviewProps {
    render: (data: Jason.Actions.RenderPayload) => void;
    getValues: () => any;
}
export declare class UnconnectedPreview extends React.PureComponent<PreviewProps> {
    buildRenderObject(values: any, metadata?: {}): {
        formName: string;
        templateTitle: string;
        values: any;
        metadata: {};
        env: string;
    };
    componentWillMount(): void;
    render(): JSX.Element;
}
export declare const Preview: React.ComponentClass<Pick<{}, never>> & {
    WrappedComponent: React.ComponentType<{}>;
};
