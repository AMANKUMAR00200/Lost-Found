let io;

const setIO = (socketInstance) => {
  io = socketInstance;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = {
  setIO,
  getIO,
};