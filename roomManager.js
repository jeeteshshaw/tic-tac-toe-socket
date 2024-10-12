class Room {
    constructor(roomName, player_1, gridType) {
        this.room_name = roomName;
        this.player_1 = player_1;
        this.player_2 = null;
        this.gridType = gridType; // 3x3 or 4x4
    }

    isFull() {
        return this.player_1 && this.player_2;
    }

    addPlayer(playerId) {
        if (!this.player_2) {
            this.player_2 = playerId;
        }
    }

    isMatchReady() {
        return this.player_1 && this.player_2;
    }
}

class RoomManager {
    constructor() {
        this.publicRooms = [];
        this.privateRooms = [];
    }

    // Find available public room based on gridType (3x3 or 4x4)
    findAvailablePublicRoom(gridType) {
        return this.publicRooms.find(room => !room.isFull() && room.gridType === gridType);
    }

    // Create a public room with the provided gridType
    createPublicRoom(playerId, gridType) {
        const roomName = `public_room_${this.publicRooms.length + 1}`;
        const room = new Room(roomName, playerId, gridType);
        this.publicRooms.push(room);
        return room;
    }

    // Find public room by player
    findPublicRoomByPlayer(playerId) {
        return this.publicRooms.find(room => room.player_1 === playerId || room.player_2 === playerId);
    }

    // Remove public room by socket
    removePublicRoomBySocket(socketId) {
        this.publicRooms = this.publicRooms.filter(room => room.player_1 !== socketId && room.player_2 !== socketId);
    }

    // Find a private room
    findPrivateRoom(roomName) {
        return this.privateRooms.find(room => room.room_name === roomName);
    }

    // Create a private room with gridType
    createPrivateRoom(roomName, playerId, gridType) {
        const room = new Room(roomName, playerId, gridType);
        this.privateRooms.push(room);
        return room;
    }

    // Find private room by player
    findPrivateRoomByPlayer(playerId) {
        return this.privateRooms.find(room => room.player_1 === playerId || room.player_2 === playerId);
    }

    // Remove private room by socket
    removePrivateRoomBySocket(socketId) {
        this.privateRooms = this.privateRooms.filter(room => room.player_1 !== socketId && room.player_2 !== socketId);
    }
}

module.exports = RoomManager;
