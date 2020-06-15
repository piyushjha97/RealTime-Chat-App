import React,{useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import './Chat.css';


let socket;

const Chat = ({location}) => {                   //location is the prop passed to the functional component.

	const [name,setName] = useState('');
	const [room,setRoom] = useState('');
	const [message,setMessage] = useState('');   //the input message
	const [messages,setMessages] = useState([]); //stores all messages
	const [users,setUsers] = useState([]); //stores all messages


	const ENDPOINT = 'localhost:5000';

	useEffect(() => {

		const {name,room} = queryString.parse(location.search); 
		socket = io(ENDPOINT);
		setName(name);
		setRoom(room);	
		socket.emit('join', {name,room}, () => {
		});

		return () => {
			socket.emit('disconnect');
			socket.off();
		}

	}, [ENDPOINT, location.search]);     //Here We have passed ENDPOINT and location.search to the array so that the useEffect will render only if these 2 values change.



useEffect(() => {
	socket.on('message',(message) => {
		setMessages([...messages,message]);
	});

	socket.on("roomData", ({ users }) => {
		setUsers(users);
	  });
  }, [messages]);

//SendMeassage function:

const sendMessage = (event) => {
	event.preventDefault();

	if(message) {
		socket.emit('sendMessage', message, () => setMessage(''));
	}
}

console.log(message,messages);

	return (
	<div className = "outerContainer">
		<div className="container">
			<InfoBar room = {room}/>
			<Messages messages={messages} name={name}/>
			<Input message={message} setMessage = {setMessage} sendMessage={sendMessage} />
		</div>
		<TextContainer users={users} />
	</div>

)}

export default Chat;