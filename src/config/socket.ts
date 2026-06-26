import { Server } from "socket.io";
import { createServer } from "http";
import express, { Application } from "express";

let io: Server;

export const initSocket = (app: Application) => {
  const httpServer = createServer(app);

  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Salon room join
    socket.on("join-salon", (salonId: string) => {
      socket.join(salonId);
      console.log(`Socket ${socket.id} joined salon: ${salonId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return httpServer;
};

export const getIO = (): Server => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};