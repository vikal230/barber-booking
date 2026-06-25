import { Request } from "express";

export interface IUser extends Request {
  userId?: string;
  salonId?: string;
  role?: "super_admin" | "salon_owner" | "barber" | "customer";
}

export interface ITokenPayload {
  userId: string;
  salonId?: string;
  role: "super_admin" | "salon_owner" | "barber" | "customer";
}

export interface IApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
}