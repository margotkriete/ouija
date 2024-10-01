const express = require('express');
const http = require('http');
const {join} = require('node:path')
const {Server} = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {  
    console.log('a user connected');

    socket.on('mousemove', (coords) => {
      console.log(coords);
      io.emit('peer-mousemove', { clientId: socket.id, coords });
    });

    socket.on('disconnect', () => {
      io.emit('peer-disconnect', { clientId: socket.id });
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});