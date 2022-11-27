const express = require('express')

const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server)

io.on('connection', socket => {
    console.log('[IO] Connection => Server has a new connection')

    socket.on('chat.message', data => {
        console.log('[SOCKET] Chat.message => ', data)
        io.emit('chat.message', data)
    })
    socket.on('disconnect', () => {
        console.log('[SOCKET] Disconnect => A connection was disconnected')
    })
})

server.prependListener("request", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
});

server.listen(3000, () => {
    console.log("This is the socket server running");
});