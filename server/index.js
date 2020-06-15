const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');
const {addUser, removeUser, getUser,getUsersInRoom} = require('./users.js');


const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);


io.on('connection',(socket)=> {
	socket.on('join', ({name,room},callback) => {
		const {error,user} = addUser({id: socket.id, name, room});

		if(error) return callback(error);

		socket.join(user.room);   //if there is no error then this part is executed and the user is added to corresponding room;

		socket.emit('message', {user:'admin',text:`${user.name}, Welcome to the room ${user.room}`});
		socket.broadcast.to(user.room).emit('message', {user: 'admin', text:`${user.name} has joined the room!`}); //the broadcast method broadcasts a message to all he user of the room except one

		io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

		callback();
	});

	socket.on('sendMessage',(message, callback) => {
		const user = getUser(socket.id);

		io.to(user.room).emit('message',{ user: user.name, text: message});

		callback();

	});

socket.on('disconnect',() => {

	const user = removeUser(socket.id);

	if(user) {
		io.to(user.room).emit('message',{user:'admin',text:`${user.name} has left the room!`});
	    io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room)});
	}	 
})

});



app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));