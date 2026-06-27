// import dotenv from "dotenv";
// dotenv.config();

// let notificationQueue: any = null;

// const getQueue = async () => {
//   if (!notificationQueue) {
//     const { Queue } = await import("bullmq");
//     notificationQueue = new Queue("notifications", {
//       connection: {
//         host: "actual-weasel-144065.upstash.io",
//         port: 6379,
//         password: process.env.REDIS_PASSWORD!,
//         tls: {},
//       },
//     });
//   }
//   return notificationQueue;
// };

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
//   try {
//     const queue = await getQueue();
//     await queue.add(type, data, {
//       attempts: 3,
//       backoff: { type: "exponential", delay: 5000 },
//     });
//   } catch (err) {
//     console.error("Queue error:", err);
//   }
// };

export const addNotificationJob = async (
  type: string,
  data: object
): Promise<void> => {
  console.log(`[Queue] Job: ${type}`, data);
};