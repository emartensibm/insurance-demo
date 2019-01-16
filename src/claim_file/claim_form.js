import React, {Component} from 'react';

class ClaimForm extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.claimAmountInput = React.createRef();
        this.dateInput = React.createRef();
        this.timeInput = React.createRef();
        this.odometerInput = React.createRef();
        this.locationInput = React.createRef();
        this.claimTypeSelect = React.createRef();
        this.incidentCauseSelect = React.createRef();
        this.policeReportSelect = React.createRef();
        this.state = {
            file: ''
        }
    }

    handleChange(event) {
        const val = event.target.value;
        this.setState({
            file : val
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const claimDetails = {
            date: this.dateInput.current.value,
            time: this.timeInput.current.value,
            odometer: this.odometerInput.current.value,
            location: this.locationInput.current.value,
            claimType: this.claimTypeSelect.current.value,
            incidentCause: this.incidentCauseSelect.current.value,
            policeReport: this.policeReportSelect.current.value,
            // claim_amount: this.claimAmountInput.current.value,
            file: this.state.file,
            loc: [41.8781, -87.6298]
        };
        this.props.onClaimSubmit(claimDetails);
    }

    render() {
        return (
            <div className="form-div container">
                <div id="form-container">
                    <p><strong>Please take a moment to review the claim details, then tap the Submit button.</strong></p>
                    <form onSubmit={this.handleSubmit} ref={this.form}>
                        <div className="form-group">
                            <label>Claim Type</label>
                            <select className="form-control" defaultValue={this.props.convo.claimType || 'Material only'} ref={this.claimTypeSelect}>
                                <option>Material only</option>
                                <option>Injury only</option>
                                <option>Material and injury</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Incident Cause</label>
                            <select className="form-control" defaultValue={this.props.convo.incidentCause} ref={this.incidentCauseSelect}>
                                <option>Crime</option>
                                <option>Driver error</option>
                                <option>Natural causes</option>
                                <option>Other driver error</option>
                                <option>Other causes</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Date of Accident</label>
                            <input className="form-control" defaultValue={this.props.convo.date} ref={this.dateInput} />
                        </div>
                        <div className="form-group">
                            <label>Time of Accident</label>
                            <input className="form-control" defaultValue={this.props.convo.time} ref={this.timeInput} />
                        </div>
                        <div className="form-group">
                            <label>Odometer Reading</label>
                            <input className="form-control" defaultValue={this.props.convo.odometer} ref={this.odometerInput} />
                        </div>
                        <div className="form-group">
                            <label>Accident Location</label>
                            <input className="form-control" defaultValue="Current location - East Jackson Dr" ref={this.locationInput} />
                        </div>
                        <div className="form-group">
                            <label>Police Report Filed?</label>
                            <select className="form-control" defaultValue={this.props.convo.policeReport} ref={this.policeReportSelect}>
                                <option value="Y">Yes</option>
                                <option value="N">No</option>
                            </select>
                        </div>
                        {/*<div className="form-group">*/}
                            {/*<label>Claim Amount</label>*/}
                            {/*<input className="form-control" defaultValue={this.props.convo.claimAmount} ref={this.claimAmountInput} />*/}
                        {/*</div>*/}
                        {/*<div className="row">*/}
                            {/*<div className="col">*/}
                                {/*<label id="image-upload-text">Image Upload</label>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className="row">*/}
                            {/*<div className="col">*/}
                                {/*<label>*/}
                                    {/*<input type="radio" name="file" onChange={this.handleChange} value="BMWX3SUV2012.jpg"/>*/}
                                    {/*<img className="car" src="files/BMWX3SUV2012.jpg"/>*/}
                                        {/*<p>Matches Policy</p>*/}
                                {/*</label>*/}
                                {/*<label>*/}
                                    {/*<input type="radio" name="file" onChange={this.handleChange} value="BMWM3Coupe2012.jpg"/>*/}
                                    {/*<img className="car" src="files/BMWM3Coupe2012.jpg"/>*/}
                                        {/*<p>DOES NOT Match Policy</p>*/}
                                {/*</label>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        <input type="submit" className="btn btn-success" value="Submit" />
                    </form>
                </div>
            </div>
        );
    }
}

export default ClaimForm;