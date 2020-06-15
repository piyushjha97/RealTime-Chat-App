const users = [];


const addUser = ({id,name,room}) => {

    //here we are removing the white space betwn first name and last name and converting into lowercase
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find((user) => user.room === room && user.name === name);   //Here we are checking if there is already a user with same name in the same room;

    if(existingUser) {
        return {err:'Username is taken'};
    }
    const user = {id,name,room};
    users.push(user);  //if username is unique, Add the user to the room;

    return {user};

}

const removeUser = (id) => {

    const index = users.findIndex((user) => user.id === id);

    if(index!==-1) {
        return users.splice(index,1)[0];
    }


}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {addUser, removeUser, getUser, getUsersInRoom};