import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: "super_admin" | "salon_owner" | "barber" | "customer";
  salonId?: mongoose.Types.ObjectId;
  isActive: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["super_admin", "salon_owner", "barber", "customer"],
      default: "customer",
    },
    salonId: { type: Schema.Types.ObjectId, ref: "Salon", default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);