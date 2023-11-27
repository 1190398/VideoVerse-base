// app.js

const messageInput = document.getElementById('input');
const messagesDiv = document.getElementById('messages');
const userListDiv = document.getElementById('userList');

const ws = new WebSocket('ws://localhost:8080');

const originID = Date.now();

ws.onopen = () => {
    ws.send(JSON.stringify({
        type: 'self',
        data: {
            username: 'Ângelo',
        },
        originID: originID,
        destination: null,
        accessType: null
    }));

    ws.send(JSON.stringify({
        type: 'getUserList',
        data: null,
        originID: originID,
        destination: null,
        accessType: null
    }));
};

ws.onmessage = (event) => {
    
  const parsedMessage = JSON.parse(event.data);

  switch (parsedMessage.type) {
    case 'message':
      messagesDiv.innerHTML += buildMessage(parsedMessage.data, parsedMessage.origin.username);
      break;

    case 'userList':
      updateUserList(parsedMessage.data);
      break;

    case 'error':
      console.error(parsedMessage.data);
      break;
  }
};

ws.onclose = (event) => {
  if (event.wasClean) {
    console.log(`Connection closed, code=${event.code}, reason=${event.reason}`);
  } else {
    console.error('Connection abruptly closed');
  }
};

ws.onerror = (error) => {
  console.error(`WebSocket error: ${error.message}`);
};

messageInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const message = messageInput.value
  if (message) {
    messagesDiv.innerHTML = buildMessage(message, 'Eu') + messagesDiv.innerHTML
    ws.send(JSON.stringify({
      type: 'message',
      data: message,
      destination: null,
      originID: originID,
      accessType: 'PUBLIC'
    }))
    messageInput.value = "";
  }
}


function updateUserList(users) {
  userListDiv.innerHTML = '';
  users.forEach(user => {
    const userItem = document.createElement('div');
    userItem.textContent = user.username;
    userListDiv.appendChild(userItem);
  });
}

function buildMessage(message, name) {
  const timestamp = new Date().toLocaleTimeString();
  const messageDiv = `
        <div class="message">
            <div class="icon">
                <i class="fa-regular fa-circle-user" style="transform: scale(2.5)"></i>
            </div>
            <div class="innerMessage">
                <span class="personName">${name} (${timestamp})</span>
                <span>${message}</span>
            </div>
        </div>
    `;
  return messageDiv;
}
