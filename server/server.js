
const express = require('express');
const path = require('path');
const WebSocket = require('ws');

const routes = require('./routes/router')


//include utils
const { addUser, getUser, getUsersInRoom } = require('./utils/users');


const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });


app.use(express.json());


app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/videoverse', routes)


wss.on('connection', (ws) => {

  const sendUserList = () => {
    const usersInRoom = getUsersInRoom('room1');
    const userList = usersInRoom.map(user => ({
      id: user.id,
      username: user.username
    }));
    
    ws.send(JSON.stringify({
      type: 'userList',
      data: userList,
      origin: null,
      destination: null,
      accessType: null
    }));
  };

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    console.log('Sending message:', parsedMessage);

    switch (parsedMessage.type) {
      case 'self':
        addUser({
          username: parsedMessage.data.username,
          room: 'room1',
          id: parsedMessage.originID,
          ws: ws
        });

        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            sendUserList();
          }
        });
        break;

      case 'message':
        const usersInRoom = getUsersInRoom('room1');
        usersInRoom.forEach((client) => {
            if (client.ws !== ws && client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(JSON.stringify({
                    type: 'message',
                    data: parsedMessage.data,
                    origin: getUser(parsedMessage.originID),
                    destination: null,
                    accessType: null
                }));
            }
        });
      break;

      case 'getUserList':
        sendUserList();
        break;
    }
  });

  ws.on('close', () => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        sendUserList();
      }
    });
  });
});

server.listen(process.env.PORT, () => {
  console.log('Server is listening on port ' + process.env.PORT);
});
