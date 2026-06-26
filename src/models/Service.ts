import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  salonId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  duration: number;
  isActive: boolean;
}

const ServiceSchema = new Schema<IService>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: "Salon", required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ServiceSchema.index({ salonId: 1 });

export default mongoose.model<IService>("Service", ServiceSchema);