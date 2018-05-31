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
            <FormLoader initialValues={{category: 'Evolution Templates', schema: 'vendors_settlement_statement'}} context={{'users': [{'title': 'xx', 'value': {'firstName': 'x', email: 'asdf'}},{'title': 'yy', 'value': {'firstName': 'y', email: 'asdfasdfa'}} ],



            'recipients.individuals': [
            {"id":1,"organisation_id":1, "recipientType": "individuals", "firstName":"asdfasdf","email":"asdfasdf@asdfads.com","phone":"asdf","created_at":"2018-05-02 04:29:32","updated_at":"2018-05-02 04:29:32","deleted_at":null,"addresses":[{"id":5,"address_name":"zzzz","address_one":"z","address_two":null,"city":null,"address_type":"z","post_code":"z","country":"z","county":null,"state":null},{"id":6,"address_name":"aaa","address_one":"a","address_two":null,"city":null,"address_type":"a","post_code":"a","country":"a","county":null,"state":null}]
            },
            {"id":2,"organisation_id":1, "recipientType": "individuals", "firstName":"asdfasdf2xxx","email":"asdfasdf@asdfads.com","phone":"asdf","created_at":"2018-05-02 04:29:32","updated_at":"2018-05-02 04:29:32","deleted_at":null,"addresses":[{"id":5,"address_name":"zzzz","address_one":"z","address_two":null,"city":null,"address_type":"z","post_code":"z","country":"z","county":null,"state":null},{"id":6,"address_name":"aaa","address_one":"a","address_two":null,"city":null,"address_type":"a","post_code":"a","country":"a","county":null,"state":null}]
            },
            {"id":2,"organisation_id":1, "recipientType": "individuals", "firstName":"test3","email":"asdfasdf@asdfads.com","phone":"asdf","created_at":"2018-05-02 04:29:32","updated_at":"2018-05-02 04:29:32","deleted_at":null,"addresses":[{"id":5,"address_name":"zzzz","address_one":"z","address_two":null,"city":null,"address_type":"z","post_code":"z","country":"z","county":null,"state":null},{"id":6,"address_name":"aaa","address_one":"a","address_two":null,"city":null,"address_type":"a","post_code":"a","country":"a","county":null,"state":null}]
            },

            ]
                .map(recipient => {
                    return {value: recipient, title: recipient.firstName}
                })


            }} />
            <Modals />
        </div>

    }
}

export default App;
