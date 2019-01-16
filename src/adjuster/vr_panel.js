import React, {Component} from 'react';
import axios from 'axios';

class VRPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getEval = this.getEval.bind(this);
    }

    getEval() {
        axios.post('watsonvr', {file: this.props.file}).then(res => {
            this.setState({match: res.data});
            console.log(res.data);
        });
    }

    render() {
        if (!this.state.match) {
            this.getEval();
            return(
                <div>
                    <nav className="navbar navbar-light bg-light">
                        <span className="nav-item">Watson Visual Recognition</span>
                    </nav>
                    <div className="container">
                        <img className="car-thumb" src={"files/" + this.props.file}/>
                        <img id="weather-icon" src="img/watson-thinking.gif"/>
                        <p>Evaluating photo...</p>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <nav className="navbar navbar-light bg-light">
                        <span className="nav-item">Watson Visual Recognition</span>
                    </nav>
                    <div className="container">
                        <img className="car-thumb" src={"files/" + this.props.file}/>
                        <img className="status-image" src={(this.state.match.class === 'BMWX3SUV2012') ? "img/green-checkmark.svg" : "img/red-ex.svg"} />
                        <p>{(this.state.match.class === 'BMWX3SUV2012') ? "The submitted photo matches the policy-holder's vehicle." : "WARNING: The submitted photo DOES NOT match the policy-holder's vehicle."}</p>
                    </div>
                </div>
            );
        }
    }
}

export default VRPanel;