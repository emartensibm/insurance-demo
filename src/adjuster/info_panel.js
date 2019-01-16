import React, {Component} from 'react';

class InfoPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <img className="profile-pic" src="img/blank-profile.png" />
                <div className="contact-info-container">
                    <h5>{this.props.data.user.driver.first_name} {this.props.data.user.driver.last_name}</h5>
                    <p>
                        <img className="claim-icon" src="img/phone-icon.svg"/>
                        {this.props.data.user.driver.contact_number}
                    </p>
                    <p>
                        <img className="claim-icon" src="img/email-icon.svg"/>
                        <a href={"mailto:" + this.props.data.user.driver.email}>{this.props.data.user.driver.email}</a>
                    </p>
                </div>
                <div className="flexed-row">
                    <div className="half-div">
                        <nav className="navbar navbar-light bg-light adjust-navbar">
                            <span className="nav-item">Home Address</span>
                        </nav>
                        <div className="container">
                            <p>{this.props.data.user.household.addr_number} {this.props.data.user.household.street_name} {this.props.data.user.household.unit_designation} {this.props.data.user.household.unit_number}, {this.props.data.user.household.city}, {this.props.data.user.household.state} {this.props.data.user.household.zipcode}</p>
                        </div>
                    </div>
                    <div className="half-div">
                        <nav className="navbar navbar-light bg-light adjust-navbar">
                            <span className="nav-item">Work Address</span>
                        </nav>
                        <div className="container">
                            <p>{this.props.data.user.driver.addr_number} {this.props.data.user.driver.street_name} {this.props.data.user.driver.unit_designation} {this.props.data.user.driver.unit_number}, {this.props.data.user.driver.city}, {this.props.data.user.driver.state} {this.props.data.user.driver.zipcode}</p>
                        </div>
                    </div>
                </div>
                <nav className="navbar navbar-light bg-light adjust-navbar">
                    <span className="nav-item">Policy #{this.props.data.user.policy.policy_id}</span>
                </nav>
                <div className="container">
                    <p>
                        <b>Member since</b> {this.props.data.user.policy.calendar_year}<br/>
                        <b>Vehicle:</b> {this.props.data.user.policy.model_year} {this.props.data.user.policy.make} {this.props.data.user.policy.model}<br/>
                        <b>Odometer at Renewal:</b> {this.props.data.user.policy.initial_odometer}<br/>
                    </p>
                    {this.props.data.user.driver.commute_discount === 'Y' && <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox1" checked/>
                        <label className="form-check-label" htmlFor="inlineCheckbox1">Non-Commuter Discount</label>
                    </div>
                    }
                    {this.props.data.user.policy.low_mileage_use === 'Y' &&
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox2" checked/>
                        <label className="form-check-label" htmlFor="inlineCheckbox2">Low Mileage Discount</label>
                    </div>
                    }
                </div>
                <nav className="navbar navbar-light bg-light adjust-navbar">
                    <span className="nav-item">Claim Details</span>
                </nav>
                <div className="container">
                    <p>
                        <b>Claim Type:</b> {this.props.data.claim.claimType}<br/>
                        <b>Incident Cause:</b> {this.props.data.claim.incidentCause}<br/>
                        {/*<p><b>Claim Amount:</b> ${this.props.data.claim.claim_amount}</p>*/}
                        <b>Date and Time:</b> {this.props.data.claim.date} {this.props.data.claim.time}<br/>
                        <b>Odometer Reading:</b> {this.props.data.claim.odometer}<br/>
                    </p>
                    {this.props.data.claim.policeReport === 'Y' ? <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox1" checked/>
                        <label className="form-check-label" htmlFor="inlineCheckbox1">Police Report Filed</label>
                    </div> : <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox1" />
                        <label className="form-check-label" htmlFor="inlineCheckbox1">Police Report Filed</label>
                    </div>
                    }
                </div>
            </div>
        );
    }
}

export default InfoPanel;