// import mongoose, { Schema, Document } from "mongoose";

// export interface ISalon extends Document {
//   businessName: string;
//   subdomain: string;
//   ownerId: mongoose.Types.ObjectId;
//   status: "active" | "suspended" | "trial";
//   subscription: {
//     planId: string;
//     expiresAt: Date;
//   };
// }

// const SalonSchema = new Schema<ISalon>(
//   {
//     businessName: { type: String, required: true, trim: true },
//     subdomain: { type: String, required: true, unique: true, lowercase: true },
//     ownerId: { type: Schema.Types.ObjectId, ref: "User" },
//     status: { type: String, enum: ["active", "suspended", "trial"], default: "trial" },
//     subscription: {
//       planId: { type: String, default: "free" },
//       expiresAt: { type: Date },
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model<ISalon>("Salon", SalonSchema);


import mongoose, { Schema, Document } from "mongoose";

export interface ISalon extends Document {
  businessName: string;
  subdomain: string;
  ownerId: mongoose.Types.ObjectId;
  status: "active" | "suspended" | "trial";
  chairs: number;
  subscription: {
    planId: string;
    cycle: "monthly" | "halfYearly" | "yearly";
    expiresAt: Date;
    razorpaySubscriptionId?: string;
    autoRenew: boolean;
  };
}

const SalonSchema = new Schema<ISalon>(
  {
    businessName: { type: String, required: true, trim: true },
    subdomain: { type: String, required: true, unique: true, lowercase: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["active", "suspended", "trial"], default: "trial" },
    chairs: { type: Number, required: true, default: 1, min: 1 },
    subscription: {
      planId: { type: String, default: "trial" },
      cycle: { type: String, enum: ["monthly", "halfYearly", "yearly"], default: "monthly" },
      expiresAt: { type: Date, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
      razorpaySubscriptionId: { type: String },
      autoRenew: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISalon>("Salon", SalonSchema);