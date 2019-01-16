import React, {Component} from 'react';
import axios from 'axios';

class FraudPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {fraud_warning: 'U'};
        this.scoreModel = this.scoreModel.bind(this);
    }

    scoreModel() {
        let claimData = {
            household_id: this.props.user.household.household_id,
            driver_id: this.props.user.driver.driver_id,
            policy_id: this.props.user.policy.policy_id,
            claimType: this.props.claim.claimType,
            incidentCause: this.props.claim.incidentCause,
            odometer: this.props.claim.odometer,
            date: this.props.claim.date,
            age: this.props.user.driver.age,
            policeReport: this.props.claim.policeReport,
            claim_amount: this.props.claim.claim_amount
        };

        axios.post('score', claimData).then(res => {
            this.setState({fraud_warning: res.data.values[0][18]});
        });
    }

    render() {
        if (this.state.fraud_warning === 'U') {
            this.scoreModel();
            return(
                <div>
                    <nav className="navbar navbar-light bg-light">
                        <span className="nav-item">Watson Fraud Detection</span>
                    </nav>
                    <div className="container">
                        <img id="weather-icon" src="img/watson-thinking.gif"/>
                        <p>Evaluating claim...</p>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <nav className="navbar navbar-light bg-light">
                        <span className="nav-item">Watson Fraud Detection</span>
                    </nav>
                    <div className="container">
                        <img className="status-image" src={(this.state.fraud_warning === 'N') ? "img/green-checkmark.svg" : "img/red-ex.svg"} />
                        <p>{(this.state.fraud_warning === 'N') ? "The submitted claim does not appear to be fraudulent." : "WARNING: The submitted claim has fraudulent characteristics. Recommend contacting customer and reviewing claim details."}</p>
                    </div>
                </div>
            );
        }
    }
}

export default FraudPanel;