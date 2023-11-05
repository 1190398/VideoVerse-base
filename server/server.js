const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Read the HTML file
    fs.readFile(path.join(__dirname, '..','public', 'index.html'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        // Replace the placeholder with the server's IP address
        const serverIPAddress = '192.168.1.8'; // Replace with your server's actual IP address
        const modifiedHTML = data.replace('SERVER_IP_PLACEHOLDER', serverIPAddress);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(modifiedHTML);
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New WebSocket connection established.');

    // Event handler for incoming WebSocket messages
    ws.on('message', (message) => {
      console.log(`Received: ${message}`);
      
      // Broadcast the received message to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          console.log(client)
          client.send(message);
        }
      });
    });
  
    // Event handler for WebSocket disconnections
    ws.on('close', () => {
      console.log('WebSocket connection closed.');
    });
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080.');
});
