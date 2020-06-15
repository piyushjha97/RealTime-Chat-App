import React from 'react';
import ScrollToBottom  from 'react-scroll-to-bottom';
import Message from '../Message/Message';
 

import './Messages.css';


const Messages = ({messages,name}) => (    //here messages and name are the two props passed to the functional component.
    <ScrollToBottom className = "messages">
        {messages.map((message,i) => <div key={i}><Message message={message} name ={name}/></div>)}
    </ScrollToBottom>
);
export default Messages;