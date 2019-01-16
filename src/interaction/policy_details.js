import React from 'react';

const PolicyDetails = ({user}) => {
    if (!user) {
        return <div>Loading policy...</div>;
    }
    return(
        <div>
            <div className="details-container">
                <nav className="navbar navbar-light bg-light">
                    <span className="nav-item"><strong>{user.driver.first_name} {user.driver.last_name}</strong></span>
                    <span id="policy-span"><strong>Policy #{user.policy.policy_id}</strong></span>
                </nav>
                <div className="container">
                    <div className="flexed-row">
                        <div className="half-div">
                            <p>Member since {user.policy.calendar_year}</p>
                            {user.driver.commute_discount === 'Y' && <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="inlineCheckbox1" checked/>
                                <label className="form-check-label" htmlFor="inlineCheckbox1">Non-Commuter Discount</label>
                            </div>
                            }
                        </div>
                        <div className="half-div">
                            <p>Your vehicle: {user.policy.model_year} {user.policy.make} {user.policy.model}</p>
                            {user.policy.low_mileage_use === 'Y' &&
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="inlineCheckbox2" checked/>
                                <label className="form-check-label" htmlFor="inlineCheckbox2">Low Mileage Discount</label>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolicyDetails;