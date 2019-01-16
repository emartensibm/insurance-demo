import React, {Component} from 'react';

class MessageEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {message: ''};
    }
    render() {
        return (
            <div className="message-input-form">
                <form className="form-inline" onSubmit={(event) => {
                    this.props.onMessageSubmit(this.state.message);
                    this.setState({message: ''});
                    event.preventDefault();
                }}>
                    <input className="form-control" value={this.state.message} onChange={(event) => this.setState({message: event.target.value})}/>
                </form>
            </div>
        );
    }
}

export default MessageEntry;