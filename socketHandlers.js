


function handleConnection(io, socket, roomManager) {
    console.log('Client connected:', socket.id);

    setTimeout(() => {
        socket.emit('connection', { date: new Date().getTime(), data: "Hello Unity" });
    }, 1000);

    // Handle joining a public room
    socket.on('join_room_public', () => {
        let room;
        let playerPos = 1;
        
        const existingRoom = roomManager.findPublicRoomByPlayer(socket.id);
        if (existingRoom) {
            room = existingRoom;
        } else {
            const availableRoom = roomManager.findAvailablePublicRoom();
            if (availableRoom) {
                room = availableRoom;
                room.addPlayer(socket.id);
                playerPos = 2;
            } else {
                room = roomManager.createPublicRoom(socket.id);
            }
        }

        socket.join(room.room_name);

        if (room.isMatchReady()) {
            io.to(room.room_name).emit('game_ready', { message: `Game is ready in room ${room.room_name}.`, room_name:room.room_name });
        } else {
            io.to(socket.id).emit('waiting', { message: `Waiting for another player to join room ${room.room_name}.`, room_name:room.room_name });
        }

        io.to(socket.id).emit('room_details', {
            message: `Player ${socket.id} joined the room.`,
            room: room.room_name,
            position: playerPos,
            room_type: 'public'
        });
    });

    // Handle joining a private room
    socket.on('join_room_private', (roomName) => {
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
            room = roomManager.createPrivateRoom(roomName, socket.id);
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
            room_type: 'private'
        });
    });

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

        const publicRoom = roomManager.findPublicRoomByPlayer(socket.id);
        if (publicRoom) {
            roomManager.removePublicRoomBySocket(socket.id);
            io.to(publicRoom.room_name).emit('game_over', { id: socket.id, message: "User left the game" });
        }

        const privateRoom = roomManager.findPrivateRoomByPlayer(socket.id);
        if (privateRoom) {
            const winner = privateRoom.player_1 === socket.id ? 2 : 1;
            roomManager.removePrivateRoomBySocket(socket.id);
            io.to(privateRoom.room_name).emit('game_over', { id: socket.id, message: "User left the game", winner });
        }
    });
    socket.on('leave_room', () =>{
        const publicRoom = roomManager.findPublicRoomByPlayer(socket.id);
        if (publicRoom) {
            roomManager.removePublicRoomBySocket(socket.id);
            io.to(publicRoom.room_name).emit('game_over', { id: socket.id, message: "User left the game" });
        }

        const privateRoom = roomManager.findPrivateRoomByPlayer(socket.id);
        if (privateRoom) {
            const winner = privateRoom.player_1 === socket.id ? 2 : 1;
            roomManager.removePrivateRoomBySocket(socket.id);
            io.to(privateRoom.room_name).emit('game_over', { id: socket.id, message: "User left the game", winner });
        }
    })
}

module.exports = { handleConnection };
