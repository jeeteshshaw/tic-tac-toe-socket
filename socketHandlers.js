


function handleConnection(io, socket, roomManager) {
    console.log('Client connected:', socket.id);

    setTimeout(() => {
        socket.emit('connection', { date: new Date().getTime(), data: "Hello Unity" });
    }, 1000);




    socket.on('join_room_public', (gridType) => { // Receive gridType (3x3 or 4x4)
        let room;
        let playerPos = 1;

        const existingRoom = roomManager.findPublicRoomByPlayer(socket.id);
        if (existingRoom) {
            room = existingRoom;
        } else {
            const availableRoom = roomManager.findAvailablePublicRoom(gridType); // Find based on gridType
            if (availableRoom) {
                room = availableRoom;
                room.addPlayer(socket.id);
                playerPos = 2;
            } else {
                room = roomManager.createPublicRoom(socket.id, gridType); // Create with gridType
            }
        }

        socket.join(room.room_name);

        if (room.isMatchReady()) {
            io.to(room.room_name).emit('game_ready', { message: `Game is ready in room ${room.room_name}.`, room_name: room.room_name });
        } else {
            io.to(socket.id).emit('waiting', { message: `Waiting for another player to join room ${room.room_name}.`, room_name: room.room_name });
        }

        io.to(socket.id).emit('room_details', {
            message: `Player ${socket.id} joined the room.`,
            room: room.room_name,
            position: playerPos,
            room_type: 'public',
            grid_type: gridType // Send the gridType in the response
        });
    });

    // Handle joining a private room
    socket.on('join_room_private', (roomName, gridType) => { // Receive gridType for private rooms
        let room = roomManager.findPrivateRoom(roomName);
        let playerPos = 1;

        if (room) {
            if (!room.isFull()) {
                room.addPlayer(socket.id);
                playerPos = 2;
            } else if (room.player_1 === socket.id) {
                playerPos = 1;
            }
        } else {
            room = roomManager.createPrivateRoom(roomName, socket.id, gridType); // Create with gridType
        }

        socket.join(room.room_name);

        if (room.isMatchReady()) {
            io.to(room.room_name).emit('game_ready', { message: `Game is ready in private room ${room.room_name}.` });
        } else {
            io.to(socket.id).emit('waiting', { message: `Waiting for another player to join private room ${room.room_name}.` });
        }

        io.to(socket.id).emit('room_details', {
            message: `Player ${socket.id} joined the room.`,
            room: room.room_name,
            position: playerPos,
            room_type: 'private',
            grid_type: gridType // Send the gridType in the response
        });
    });


    // Handle joining a public room
    // socket.on('join_room_public', () => {
    //     let room;
    //     let playerPos = 1;
        
    //     const existingRoom = roomManager.findPublicRoomByPlayer(socket.id);
    //     if (existingRoom) {
    //         room = existingRoom;
    //     } else {
    //         const availableRoom = roomManager.findAvailablePublicRoom();
    //         if (availableRoom) {
    //             room = availableRoom;
    //             room.addPlayer(socket.id);
    //             playerPos = 2;
    //         } else {
    //             room = roomManager.createPublicRoom(socket.id);
    //         }
    //     }

    //     socket.join(room.room_name);

    //     if (room.isMatchReady()) {
    //         io.to(room.room_name).emit('game_ready', { message: `Game is ready in room ${room.room_name}.`, room_name:room.room_name });
    //     } else {
    //         io.to(socket.id).emit('waiting', { message: `Waiting for another player to join room ${room.room_name}.`, room_name:room.room_name });
    //     }

    //     io.to(socket.id).emit('room_details', {
    //         message: `Player ${socket.id} joined the room.`,
    //         room: room.room_name,
    //         position: playerPos,
    //         room_type: 'public'
    //     });
    // });

    // Handle joining a private room
    // socket.on('join_room_private', (roomName) => {
    //     let room = roomManager.findPrivateRoom(roomName);
    //     let playerPos = 1;

    //     if (room) {
    //         if (!room.isFull()) {
    //             room.addPlayer(socket.id);
    //             playerPos = 2;
    //         } else if (room.player_1 === socket.id) {
    //             playerPos = 1;
    //         }
    //     } else {
    //         room = roomManager.createPrivateRoom(roomName, socket.id);
    //     }

    //     socket.join(room.room_name);

        
    //     io.to(socket.id).emit('room_details', {
    //         message: `Player ${socket.id} joined the room.`,
    //         room: room.room_name,
    //         position: playerPos,
    //         room_type: 'private'
    //     });
    //     if (room.isMatchReady()) {
    //         io.to(room.room_name).emit('game_ready', { message: `Game is ready in private room ${room.room_name}.`, });
    //     } else {
    //         io.to(socket.id).emit('waiting', { message: `Waiting for another player to join private room ${room.room_name}.` });
    //     }
    // });

    // Handle moves made by a player
    socket.on('move_played', (data) => {
        const room = roomManager.findPublicRoomByPlayer(socket.id) || roomManager.findPrivateRoom(data.room);
        if (room && room.isMatchReady()) {
            console.log('Move played in room', data.room, 'by player', socket.id);
            io.to(room.room_name).emit('move_played_by', data);
        } else {
            io.to(socket.id).emit('error', { message: 'Match not ready. Please wait for another player.' });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);

        // const publicRoom = roomManager.findPublicRoomByPlayer(socket.id);
        // if (publicRoom) {
        //     roomManager.removePublicRoomBySocket(socket.id);
        //     io.to(publicRoom.room_name).emit('game_over', { id: socket.id, message: "User left the game" });
        // }

        // const privateRoom = roomManager.findPrivateRoomByPlayer(socket.id);
        // if (privateRoom) {
        //     const winner = privateRoom.player_1 === socket.id ? 2 : 1;
        //     roomManager.removePrivateRoomBySocket(socket.id);
        //     io.to(privateRoom.room_name).emit('game_over', { id: socket.id, message: "User left the game", winner });
        // }
        console.log('Client disconnected room:', socket.id);

        const publicRoom = roomManager.findPublicRoomByPlayer(socket.id);

        if (publicRoom) {
            const publicWinner = publicRoom.player_1 === socket.id ? 2 : 1;
            roomManager.removePublicRoomBySocket(socket.id);
            socket.broadcast.to(publicRoom.room_name).emit('game_over', { id: socket.id, message: "User left the game", winner:publicWinner });
        }

        const privateRoom = roomManager.findPrivateRoomByPlayer(socket.id);
        console.log("private romm", privateRoom);
        if (privateRoom) {
            const privateWinner = privateRoom.player_1 === socket.id ? 2 : 1;
            roomManager.removePrivateRoomBySocket(socket.id);
            io.to(privateRoom.room_name).emit('game_over', { id: socket.id, message: "User left the game", winner:privateWinner });
        }
    });
    socket.on('leave_room', () =>{
        console.log('Client leaved room:', socket.id);
        
        const publicRoom = roomManager.findPublicRoomByPlayer(socket.id);
        if (publicRoom) {
            const publicWinner = publicRoom.player_1 === socket.id ? 2 : 1;
            roomManager.removePublicRoomBySocket(socket.id);
            socket.broadcast.to(publicRoom.room_name).emit('game_over', { id: socket.id, message: "User left the game", winner:publicWinner });
        }

        const privateRoom = roomManager.findPrivateRoomByPlayer(socket.id);
        if (privateRoom) {
            const privateWinner = privateRoom.player_1 === socket.id ? 2 : 1;
            roomManager.removePrivateRoomBySocket(socket.id);
            io.to(privateRoom.room_name).emit('game_over', { id: socket.id, message: "User left the game", winner:privateWinner });
        }
    })
}

module.exports = { handleConnection };
