import mongoose, { Schema, Document } from "mongoose";

export interface IBarber extends Document {
  salonId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  specialization: string[];
  isAvailable: boolean;
  workingHours: {
    start: string;
    end: string;
  };
  breakTimes: {
    start: string;
    end: string;
  }[];
  rating: number;
}

const BarberSchema = new Schema<IBarber>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: "Salon", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    specialization: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    workingHours: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "21:00" },
    },
    breakTimes: [
      {
        start: { type: String },
        end: { type: String },
      },
    ],
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);

BarberSchema.index({ salonId: 1 });

export default mongoose.model<IBarber>("Barber", BarberSchema);