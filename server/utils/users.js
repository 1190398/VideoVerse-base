
const users = []

// Update the addUser function
const addUser = function({ id, username, room, ws }) {
    username = username.trim();
    room = room.trim().toLowerCase();

    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        };
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    if (existingUser) {
        return {
            error: 'Username is in use!'
        };
    }

    const user = { id, username, room, ws };

    users.push(user);

    return { user };
};

const removeUser = function(id){
    const index = users.findIndex((user) => {
        return user.id === id;
    })

    if(index != -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = function(id){
    return users.find((user) => user.id === id)
}

const getUsersInRoom = function(roomId){
    return users.filter((user) => user.room === roomId)
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}