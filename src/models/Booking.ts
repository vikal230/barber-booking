import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  salonId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  barberId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  date: string;
  slot: {
    start: string;
    end: string;
  };
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "partial" | "paid";
}

const BookingSchema = new Schema<IBooking>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: "Salon", required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    barberId: { type: Schema.Types.ObjectId, ref: "Barber", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: String, required: true },
    slot: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

BookingSchema.index({ salonId: 1, barberId: 1, date: 1 });

export default mongoose.model<IBooking>("Booking", BookingSchema);