// // const express = require('express');
// // const http = require('http');
// // const socketIo = require('socket.io');

// // const app = express();
// // const server = http.createServer(app);
// // const io = socketIo(server);

// // const PORT = process.env.PORT || 5000;

// // let players = {};
// // let gameState = {
// //     board: Array(9).fill(null),
// //     currentPlayer: 'X',
// // };

// // io.on('connection', (socket) => {
// //     console.log('New client connected:', socket.id);

// //     // When a new player joins
// //     // if (Object.keys(players).length < 2) {
// //     //     players[socket.id] = {
// //     //         id: socket.id,
// //     //         symbol: Object.keys(players).length === 0 ? 'X' : 'O',
// //     //     };
// //     //     socket.emit('playerAssigned', players[socket.id].symbol);
// //     // } else {
// //     //     socket.emit('gameFull');
// //     //     socket.disconnect();
// //     // }

// //     // socket.on('makeMove', (index) => {
// //     //     if (gameState.board[index] === null) {
// //     //         gameState.board[index] = players[socket.id].symbol;
// //     //         gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
// //     //         io.emit('updateGameState', gameState);
// //     //     }
// //     // });

// //     // socket.on('disconnect', () => {
// //     //     console.log('Client disconnected:', socket.id);
// //     //     delete players[socket.id];
// //     // });
// //     socket.on('pong', (data) => {
// //         console.log('Received pong:', data);
// //     });
// // });

// // server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));





// // // const WebSocket = require('ws');

// // // const wss = new  WebSocket.Server({ port: 8080 }, ()=>{
// // //     console.log("server is running");
// // // });

// // // wss.on('connection', function connection(ws) {
// // //     console.log("someone connected")
// // //     ws.on('message',(data) =>{
// // //         console.log("data received %o"+ data);
// // //         ws.send("hello world");
// // //     });
// // // });


// // // wss.on('listening', ()=>{
// // //     console.log("server is listening on port 8080");
// // // })


















// // // const WebSocket = require('ws');

// // // // Store connected clients
// // // const clients = [];
// // // let games = {};  // To store active games and match players

// // // const wss = new WebSocket.Server({ port: 8080 }, () => {
// // //     console.log("Server is running on port 8080");
// // // });

// // // const addUser = (client)=>{
// // //     console.log("success")
// // //     clients.push(client)
// // // }

// // // // Handle incoming connections
// // // wss.on('connection', (ws) => {
// // //     console.log("New player connected", ws.userId);

// // //     // Add the new player to the clients array
// // //     // clients.push(ws);
    
// // //     // // Check if there are enough players to start a game
// // //     // if (clients.length % 2 === 0) {
// // //     //     startGame(clients[clients.length - 2], ws);
// // //     // }

// // //     // Handle incoming messages from the client
// // //     ws.on('message', (data) => {
// // //         // const message = JSON.parse(data);
// // //         // console.log("Received message:", message);

// // //         // // If it's a game move, forward the move to the opponent
// // //         // if (message.type === 'move') {
// // //         //     const game = games[ws.playerId];
// // //         //     const opponent = game.player1 === ws ? game.player2 : game.player1;

// // //         //     if (opponent && opponent.readyState === WebSocket.OPEN) {
// // //         //         opponent.send(JSON.stringify({
// // //         //             type: 'move',
// // //         //             move: message.move
// // //         //         }));
// // //         //     }
// // //         // }
// // //         // if (data.userId) {
// // //         //     ws.userId = data.userId;
// // //         //     clients[ws.userId] = ws;  // Store the client by their userId
// // //         //     console.log(`User connected with ID: ${ws.userId}`);
// // //         // }
// // //         if(data.type == 'join'){
// // //             addUser(ws.userId)
// // //             // ws.send({
// // //             //     title:"User Joined Server",
// // //             //     message:"user added successfully"
// // //             // })
// // //             ws.send("success")
// // //         }
// // //     });

// // //     // Handle disconnection
// // //     ws.on('close', () => {
// // //         console.log("Player disconnected");

// // //         // Remove player from clients array
// // //         const index = clients.indexOf(ws);
// // //         if (index !== -1) {
// // //             clients.splice(index, 1);
// // //         }

// // //         // If the player was in a game, notify the opponent
// // //         if (ws.playerId && games[ws.playerId]) {
// // //             const game = games[ws.playerId];
// // //             const opponent = game.player1 === ws ? game.player2 : game.player1;

// // //             if (opponent && opponent.readyState === WebSocket.OPEN) {
// // //                 opponent.send(JSON.stringify({
// // //                     type: 'opponent_disconnected'
// // //                 }));
// // //             }

// // //             // Remove the game
// // //             delete games[ws.playerId];
// // //         }
// // //     });
// // // });

// // // // Function to start a game between two players
// // // function startGame(player1, player2) {
// // //     const gameId = `game_${Math.random()}`;
// // //     console.log("Starting a new game:", gameId);

// // //     // Set the players' IDs and store the game
// // //     player1.playerId = gameId;
// // //     player2.playerId = gameId;
// // //     games[gameId] = { player1, player2 };

// // //     // Notify both players that the game has started
// // //     player1.send(JSON.stringify({ type: 'start', symbol: 'X' }));
// // //     player2.send(JSON.stringify({ type: 'start', symbol: 'O' }));
    
// // //     console.log("Players paired for game:", gameId);
// // // }

// // // wss.on('listening', () => {
// // //     console.log("Server is listening on port 8080");
// // // });


// 'use strict';

// const http = require('http');
// const socket = require('socket.io');
// const server = http.createServer();
// const port = 5000;

// var io = socket(server, {
//     pingInterval: 10000,
//     pingTimeout: 5000
// });
// class Room {
//   constructor(room_name, firstPlayer){
//     this.room_name = room_name;
//     this.player_1 = firstPlayer;
//     this.player_2 = null;
//   }
//   addPlayer(player){
//     this.player_2 = player;
//   }
// }
// const public_rooms = []
// const private_rooms = []
// // io.use((socket, next) => {
// //     if (socket.handshake.query.token === "UNITY") {
// //         next();
// //     } else {
// //         next(new Error("Authentication error"));
// //     }
// // });

// io.on('connection', socket => {
//   console.log('connection', socket.id);

//   setTimeout(() => {
//     socket.emit('connection', {date: new Date().getTime(), data: "Hello Unity"})
//   }, 1000);

//   socket.on('hello', (data) => {
//     console.log('hello', data);
//     socket.emit('hello', {date: new Date().getTime(), data: data});
//   });
  
//   socket.on('join_room_public', () => {
//     console.log('join_room');
//     let data;
//     let Player = 1;
//     const alreadyJoined = public_rooms.filter((item)=> item?.player_1?.includes(socket.id) || item?.player_2?.includes(socket.id) );
//     if(alreadyJoined.length>0){
//       data = alreadyJoined[0]

//     }
//     const singlePlayerRoom = public_rooms.filter((item)=> item?.players_2 == null);
//     if(singlePlayerRoom.length>0 && !data?.room){
//       data = singlePlayerRoom[0]
//       data.addPlayer(socket.id);
//       Player = 2;
//     }
//     else{
//       data = new Room(`room_${Math.random()}`, socket.id);
//       public_rooms.push(data);
//     }
//     socket.join(data.room_name)

//     // socket.emit('hello', {date: new Date().getTime(), data: data});
//     io.to(data.room_name).to().emit('joined', {message: 'player joined the room'+  socket.id});
//     io.to(socket.id).emit("room_details", {
//       room: data.room_name,
//       position: Player
//     })
//   });
//   // private room
//   socket.on('join_room_private', (room) => {
//     console.log("room join_room_private", room)
//     let data;
//     let PlayerPos = 1;
//     const alreadyJoined = private_rooms.findIndex((item)=> item?.room_name == room);
    
//     if(alreadyJoined>=0){
//       data = private_rooms[alreadyJoined]
//       if(data.player_2 == socket.id){
//         PlayerPos = 2
//       }
//       // data.pa  
//       else if(data.player_1 == socket.id){
//         PlayerPos = 1
//       }
//       else{
//         PlayerPos = 2
//         // data.push(data);
//         private_rooms[alreadyJoined].addPlayer(socket.id);
//       }
//     }
//     else{
//       data = new Room(room, socket.id);
//       private_rooms.push(data);
//     }

//     socket.join(room)
    
//     io.to(socket.id).emit('room_details', {message: 'player joined the room'+  socket.id, 
//       room: data.room_name,
//       position: PlayerPos,
//       room_type:"private"
//     });


//   });


//   socket.on('move_played', data =>{
//     console.log('move_played', data.room, socket.id);
//     io.to(data.room).emit('move_played_by', data);
//   }) 

//   socket.on('disconnect', () => {
//     console.log('disconnect', socket.id);
    
//     const alreadyJoined = private_rooms.findIndex((item)=> item?.player_1?.includes(socket.id) || item?.player_2?.includes(socket.id) );
//     if(alreadyJoined>=0){
//       io.to(private_rooms[alreadyJoined].room_name).emit('game_over', {
//         id: socket.id,
//         message:"user left the game",
//         winner: private_rooms[alreadyJoined].player_1 == socket.id ? 2 : 1
//       });
//       private_rooms.splice(alreadyJoined, 1);
//     }
//   })
// });

// setInterval(()=>{
//   console.log("private_room", private_rooms )
// },15000)

// server.listen(process.env.PORT || port, () => {
//   console.log('listening on *:' + port);
// });

'use strict';

const http = require('http');
const socket = require('socket.io');
const { handleConnection } = require('./socketHandlers');
const RoomManager = require('./roomManager'); // Import the RoomManager
const express = require('express');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

var io = socket(server, {
    pingInterval: 10000,
    pingTimeout: 5000,
    allowEIO3:true,
    // wsEngine: "uws" 
});

app.get('/', (req, res) => {
    res.send("Server is running.");
});

// Create an instance of RoomManager and pass it to socket event handlers
const roomManager = new RoomManager();

io.on('connection', (socket) => {
    handleConnection(io, socket, roomManager); // Pass the roomManager to handlers
});

// Start the server
server.listen(process.env.PORT || PORT,'0.0.0.0', () => {
    console.log('Server is listening on port ' + PORT);
});


// setInterval(() => {
    
//     console.log(roomManager.public_rooms, roomManager.private_rooms);
// }, 15000);
