import { getIO } from "../config/socket.js";

export const emitNewBooking = (salonId: string, bookingData: unknown) => {
  const io = getIO();
  io.to(salonId).emit("new-booking", bookingData);
};

export const emitBookingCancelled = (salonId: string, bookingId: string) => {
  const io = getIO();
  io.to(salonId).emit("booking-cancelled", { bookingId });
};