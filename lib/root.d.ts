/// <reference types="react" />
import * as React from "react";
import '../style/style.scss';
export interface RootProps {
    history: any;
    store: any;
}
declare class Root extends React.PureComponent<RootProps> {
    render(): JSX.Element;
}
export default Root;
