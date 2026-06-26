// import { Queue } from "bullmq";
// import redis from "../config/redis.js";

// export const notificationQueue = new Queue("notifications", {
//   connection: redis,
// });

// export const addNotificationJob = async (
//   type: "booking-confirmed" | "booking-cancelled" | "reminder",
//   data: {
//     phone: string;
//     name: string;
//     date?: string;
//     slot?: string;
//     salonName?: string;
//   }
// ) => {
//   await notificationQueue.add(type, data, {
//     attempts: 3,
//     backoff: { type: "exponential", delay: 5000 },
//   });
// };


import { Queue } from "bullmq";

const connection = {
  host: "actual-weasel-144065.upstash.io",
  port: 6379,
  password: process.env.REDIS_PASSWORD!,
  tls: {},
};

export const notificationQueue = new Queue("notifications", { connection });

export const addNotificationJob = async (
  type: "booking-confirmed" | "booking-cancelled" | "reminder",
  data: {
    phone: string;
    name: string;
    date?: string;
    slot?: string;
    salonName?: string;
  }
) => {
  await notificationQueue.add(type, data, {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  });
};