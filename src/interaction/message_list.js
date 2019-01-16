import React from 'react';

const MessageList = (props) => {
    const messageItems = props.messages.map((message) => {
        return <p className={message.sender}>{message.text}</p>
    });
    return (
        <div className="message-list">
            {messageItems}
        </div>
    );
}

export default MessageList;