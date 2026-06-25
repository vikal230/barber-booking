import mongoose, { Schema, Document } from "mongoose";

export interface ISalon extends Document {
  businessName: string;
  subdomain: string;
  ownerId: mongoose.Types.ObjectId;
  status: "active" | "suspended" | "trial";
  subscription: {
    planId: string;
    expiresAt: Date;
  };
}

const SalonSchema = new Schema<ISalon>(
  {
    businessName: { type: String, required: true, trim: true },
    subdomain: { type: String, required: true, unique: true, lowercase: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["active", "suspended", "trial"], default: "trial" },
    subscription: {
      planId: { type: String, default: "free" },
      expiresAt: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISalon>("Salon", SalonSchema);