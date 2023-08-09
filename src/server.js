import express from 'express';
import http from 'http';
// import { WebSocketServer } from 'ws';
import { Server } from 'socket.io';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

function publickRooms() {
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on('connection', (socket) => {
    socket['nickname'] = 'Anon';
    socket.onAny((event) => console.log(`Socket Event: ${event}`));
    socket.on('enter_room', (roomName, done) => {
        socket.join(roomName);
        done();
        socket
            .to(roomName)
            .emit('welcome', socket.nickname, countRoom(roomName));
        wsServer.sockets.emit('room_change', publickRooms());
    });
    socket.on('disconnecting', () => {
        console.log('disconnecting:', socket.rooms);
        socket.rooms.forEach((room) =>
            socket
                .to(room)
                .emit('bye', socket.nickname, countRoom(roomName) - 1)
        );
    });
    socket.on('disconnect', () => {
        wsServer.sockets.emit('room_change', publickRooms());
    });
    socket.on('new_message', (msg, room, done) => {
        console.log('new_message:', room);
        socket.to(room).emit('new_message', `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on('nickname', (nickname) => (socket['nickname'] = nickname));
});

httpServer.listen(3000, handleListen);

// const sockets = [];

// wss.on('connection', (socket) => {
//     sockets.push(socket);
//     sockets.nickname = 'Anon';
//     console.log('Connected to Browser ✅');
//     socket.on('close', onSocketClose);
//     socket.on('message', (msg) => {
//         const message = JSON.parse(msg);
//         switch (message.type) {
//             case 'new_message':
//                 sockets.forEach((aSocket) =>
//                     aSocket.send(`${socket.nickname}: ${message.payload}`)
//                 );
//             case 'nickname':
//                 socket.nickname = message.payload;
//         }
//     });
// });
