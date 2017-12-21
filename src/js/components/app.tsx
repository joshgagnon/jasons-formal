import * as React from "react";
import FormLoader from './formLoader';


export class App extends React.PureComponent<{}> {
    render() {
        return <div>
            <FormLoader initialValues={{category: 'Good Companies', schema: 'boardResolution'}} />
        </div>

    }
}

export default App;
