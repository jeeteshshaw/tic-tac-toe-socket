class Room {
    constructor(room_name, firstPlayer) {
        this.room_name = room_name;
        this.player_1 = firstPlayer;
        this.player_2 = null;
        this.isReady = false; // Flag to check if both players are present
    }

    addPlayer(player) {
        if (this.player_2 === null) {
            this.player_2 = player;
            this.isReady = true;  // Mark the room as ready when second player joins
        }
    }

    isFull() {
        return this.player_2 !== null;
    }

    isMatchReady() {
        return this.isReady;
    }
}

class RoomManager {
    constructor() {
        this.public_rooms = [];
        this.private_rooms = [];
    }

    // Public Room Methods
    createPublicRoom(firstPlayer) {
        const room = new Room(`room_${Math.random()}`, firstPlayer);
        this.public_rooms.push(room);
        return room;
    }

    findAvailablePublicRoom() {
        return this.public_rooms.find(room => room.player_2 === null);
    }

    findPublicRoomByPlayer(socketId) {
        return this.public_rooms.find(room => room.player_1 === socketId || room.player_2 === socketId);
    }

    removePublicRoomBySocket(socketId) {
        const index = this.public_rooms.findIndex(room => room.player_1 === socketId || room.player_2 === socketId);
        if (index >= 0) {
            this.public_rooms.splice(index, 1);
        }
    }

    // Private Room Methods
    createPrivateRoom(roomName, firstPlayer) {
        const room = new Room(roomName, firstPlayer);
        this.private_rooms.push(room);
        return room;
    }

    findPrivateRoom(roomName) {
        return this.private_rooms.find(room => room.room_name === roomName);
    }

    findPrivateRoomByPlayer(socketId) {
        return this.private_rooms.find(room => room.player_1 === socketId || room.player_2 === socketId);
    }

    removePrivateRoomBySocket(socketId) {
        const index = this.private_rooms.findIndex(room => room.player_1 === socketId || room.player_2 === socketId);
        if (index >= 0) {
            this.private_rooms.splice(index, 1);
        }
    }
}

module.exports = RoomManager;
