// socket.js
import { Server } from 'socket.io';
let io;

export const initIo = (server) => {
  io = new Server(server, {
    // options
  });
  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
