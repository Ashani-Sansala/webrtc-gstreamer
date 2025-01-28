const WebSocket = require('ws');

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('./client'));

app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
});

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
    socket.on('message', (message) => {
        // Broadcast the message to other clients
        server.clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

console.log('Signaling server is running on ws://localhost:8080');
