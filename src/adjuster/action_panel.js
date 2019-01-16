import React, {Component} from 'react';

class ActionPanel extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <nav className="navbar navbar-light bg-light adjust-navbar">
                    <span className="nav-item" id="data-title">Adjuster Actions</span>
                </nav>
                <div className="btn-toolbar" role="toolbar">
                    <div className="btn-group mr-2" role="group">
                        <button className="btn btn-success">Approve Claim</button>
                    </div>
                    <div className="btn-group mr-2" role="group">
                        <button className="btn btn-danger">Flag for Aduster Analysis</button>
                    </div>
                    <div className="btn-group mr-2" role="group">
                        <button className="btn btn-dark" onClick={() => {this.props.onResetClick();}}>Go back to claim details
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ActionPanel;