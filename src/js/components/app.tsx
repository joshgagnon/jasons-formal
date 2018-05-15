import * as React from "react";
import FormLoader from './formLoader';
import * as moment from 'moment';
import Header from './header';
import Modals from './modals';
import * as momentLocalizer from 'react-widgets-moment';

momentLocalizer(moment);

export class App extends React.PureComponent<{}> {
    render() {
        return <div>
            <Header />
            <FormLoader initialValues={{category: 'Evolution Templates', schema: 'letter'}} context={{'users': [{'title': 'xx', 'value': {'firstName': 'x'}}]}} />
            <Modals />
        </div>

    }
}

export default App;
