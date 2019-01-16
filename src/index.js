import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import MessageEntry from './interaction/message_entry';
import MessageList from './interaction/message_list';
import PolicyDetails from './interaction/policy_details';
import LoginForm from './login/login_form';
import ClaimForm from './claim_file/claim_form';
import FraudPanel from './adjuster/fraud_panel';
import MapPanel from "./adjuster/map_panel";
import WeatherPanel from "./adjuster/weather_panel";
import VRPanel from "./adjuster/vr_panel";
import InfoPanel from "./adjuster/info_panel";
import PlatePanel from "./adjuster/plate_panel";
import DamagePanel from "./adjuster/damage_panel";
import ActionPanel from "./adjuster/action_panel";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screen: 'login',
            user: null,
            convo: {},
            claim: null,
            messages: []
        };
    }

    loadPolicy(userid) {
        axios.post('load_policy', {userid: userid}).then(res => {
            this.setState({user: res.data});
            this.setState({messages: [
                {
                    sender: 'watson',
                    text: `Hello, ${this.state.user.driver.first_name} ${this.state.user.driver.last_name}. How can I help?`
                }
            ]});
        });
    }

    render() {
        if (this.state.screen === 'login') return (
            <div id="phone-div">
                <div class="phone-header">
                    <a className="navbar-brand" href="#"><img className="logo" src="img/open-ins-logo.png"/></a>
                </div>
                <div className="centered-container">
                    <div className="login-form-container">
                        <LoginForm onLoginSubmit={() => {
                            this.loadPolicy('rbrooks@email.com');
                            this.setState({screen: 'chat'})
                        }}/>
                    </div>
                </div>
            </div>
        );
        else if (this.state.screen === 'chat') {
            return (
                <div id="phone-div">
                    <div className="phone-header">
                        <a className="navbar-brand" href="#"><img className="logo" src="img/open-ins-logo.png"/></a>
                    </div>
                    <div className="chat-div">
                        <div className="details-div">
                            <PolicyDetails user={this.state.user}/>
                            <div className="container">
                                {/*<button className="btn btn-danger" onClick={() => {*/}
                                    {/*this.setState({*/}
                                        {/*screen: 'photos'*/}
                                    {/*});*/}
                                {/*}}>File a Claim</button>*/}
                            </div>
                        </div>
                        <div className="message-div">
                            <MessageList messages={this.state.messages} />
                        </div>
                        <div className="container">
                            <MessageEntry onMessageSubmit={(msg) => {
                                this.setState(
                                    {messages: [...this.state.messages, {sender: 'user', text: msg}]}, () => {
                                        let objDiv = document.getElementsByClassName("message-div")[0];
                                        objDiv.scrollTop = objDiv.scrollHeight;
                                    }
                                );
                                let newConvo = this.state.convo;
                                newConvo.input = { text: msg };
                                this.setState({convo: newConvo});
                                axios.post('send_message', {convo: this.state.convo}).then(res => {
                                    this.setState(
                                        {
                                            messages: [...this.state.messages, {sender: 'watson', text: res.data.output.text[0]}],
                                            convo: res.data
                                        }, () => {
                                            let objDiv = document.getElementsByClassName("message-div")[0];
                                            objDiv.scrollTop = objDiv.scrollHeight;
                                        });

                                    if (this.state.convo.context.claimType && this.state.convo.context.date && this.state.convo.context.time && this.state.convo.context.incidentCause && this.state.convo.context.odometer && this.state.convo.context.policeReport) {
                                        this.setState({
                                            screen: 'photos'
                                        });
                                    }
                                });
                            }} />
                        </div>
                    </div>
                </div>
            );
        }
        else if (this.state.screen === 'photos') {
            return (
                <div id="phone-div">
                    <div className="phone-header">
                        <a className="navbar-brand" href="#"><img className="logo" src="img/open-ins-logo.png"/></a>
                    </div>
                    <ClaimForm convo={this.state.convo.context} onClaimSubmit={(claimDetails) => {
                        if (claimDetails.file === "") {
                            claimDetails.file = 'BMWX3SUV2012.jpg';
                        }
                        this.setState({claim: claimDetails, screen: 'adjuster'});
                        //axios.post('claim_submit', {claim: this.state.claim});
                    }}/>
                </div>
            );
        }
        else if (this.state.screen === 'adjuster') {
            console.log(this.state);
            return (
                <div className="fullscreen-div">
                    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
                        <a className="navbar-brand" href="#"><img className="logo" src="img/open-ins-logo.png"/></a>
                        <ul className="navbar-nav ml-auto">
                            <li className="navbar-item">
                                <img className="logo logo-bar nav-link" src="img/phone-icon.svg"/>
                            </li>
                            <li className="navbar-item">
                                <img className="logo logo-bar nav-link" src="img/chat-icon.svg"/>
                            </li>
                            <li className="navbar-item">
                                <img className="logo logo-bar nav-link" src="img/email-icon.svg"/>
                            </li>
                        </ul>
                    </nav>
                    <div className="agent-div">
                        <div id="adjust-container">
                            <div id="adjust-left-container">
                                <InfoPanel data={this.state}/>
                            </div>
                            <div id="adjust-right-container">
                                {/*<VRPanel file={this.state.claim.file}/>*/}
                                {/*<div className="adjust-top-right-container">*/}
                                    {/*<FraudPanel claim={this.state.claim} user={this.state.user}/>*/}
                                {/*</div>*/}
                                {/*<div className="adjust-top-right-container">*/}
                                    {/*<DamagePanel/>*/}
                                    {/*<PlatePanel/>*/}
                                {/*</div>*/}
                                <WeatherPanel loc={this.state.claim.loc}/>
                                <MapPanel loss_location={[41.8781, -87.6198]}
                                          home_location={[41.8681, -87.6298]}
                                          office_location={[41.8881, -87.6398]}
                                />
                                <ActionPanel onResetClick={() => {this.setState({screen: 'photos'})}} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else if (this.state.screen === 'test') {
            return (
                <div className="agent-div">
                    <h4>Adjustment Screen</h4>
                    <div id="adjust-container">
                        <div id="adjust-left-container">
                            <p>Info</p>
                        </div>
                        <div id="adjust-right-container">
                            <div id="adjust-top-right-container">
                                <div className="half-div">
                                    <p>Fraud goes here</p>
                                </div>
                                <div className="half-div">
                                    <VRPanel file='BMWX3SUV2012.jpg'/>
                                </div>
                            </div>
                            <WeatherPanel loc={[41.8781, -87.6298]}/>
                            <MapPanel loss_location={[41.8781, -87.6198]}
                                      home_location={[41.8681, -87.6298]}
                                      office_location={[41.8881, -87.6398]}
                            />
                        </div>
                    </div>
                </div>

            );
        }
    }
}

ReactDOM.render(<App />, document.querySelector('.app'));

/*function component() {
    var element = document.createElement('div');
    element.innerHTML = _.join(['Wu', 'Tang'], ' ');
    return element;
}

document.body.appendChild(component()); */