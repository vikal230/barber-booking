// import { Worker, Job } from "bullmq";
// import redis from "../config/redis.js";


// interface NotificationJob {
//   phone: string;
//   name: string;
//   date?: string;
//   slot?: string;
//   salonName?: string;
// }

// const processJob = async (job: Job<NotificationJob>) => {
//   const { name, phone, date, slot, salonName } = job.data;

//   switch (job.name) {
//     case "booking-confirmed":
//       console.log(`✅ WhatsApp to ${phone}: Hi ${name}, your booking at ${salonName} on ${date} at ${slot} is confirmed!`);
//       break;

//     case "booking-cancelled":
//       console.log(`❌ WhatsApp to ${phone}: Hi ${name}, your booking at ${salonName} has been cancelled.`);
//       break;

//     case "reminder":
//       console.log(`⏰ Reminder to ${phone}: Hi ${name}, your appointment at ${salonName} is in 30 minutes!`);
//       break;

//     default:
//       console.log("Unknown job type");
//   }
// };

// const notificationWorker = new Worker("notifications", processJob, {
//   connection: redis,
// });

// notificationWorker.on("completed", (job) => {
//   console.log(`Job ${job.id} completed`);
// });

// notificationWorker.on("failed", (job, err) => {
//   console.error(`Job ${job?.id} failed:`, err.message);
// });

// export default notificationWorker;



import dotenv from "dotenv";
dotenv.config();

import { Worker, Job } from "bullmq";

interface NotificationJob {
  phone: string;
  name: string;
  date?: string;
  slot?: string;
  salonName?: string;
}

// const connection = {
//   host: "actual-weasel-144065.upstash.io",
//   port: 6379,
//   password: process.env.REDIS_PASSWORD!,
//   tls: {},
// };

const connection = {
  host: "actual-weasel-144065.upstash.io",
  port: 6379,
  password: process.env.REDIS_PASSWORD!,
  tls: {},
  enableOfflineQueue: false,
};

const processJob = async (job: Job<NotificationJob>) => {
  const { name, phone, date, slot, salonName } = job.data;

  switch (job.name) {
    case "booking-confirmed":
      console.log(`✅ WhatsApp to ${phone}: Hi ${name}, your booking at ${salonName} on ${date} at ${slot} is confirmed!`);
      break;
    case "booking-cancelled":
      console.log(`❌ WhatsApp to ${phone}: Hi ${name}, your booking at ${salonName} has been cancelled.`);
      break;
    case "reminder":
      console.log(`⏰ Reminder to ${phone}: Hi ${name}, your appointment at ${salonName} is in 30 minutes!`);
      break;
    default:
      console.log("Unknown job type");
  }
};

const notificationWorker = new Worker("notifications", processJob, { connection });

notificationWorker.on("completed", (job) => console.log(`Job ${job.id} completed`));
notificationWorker.on("failed", (job, err) => console.error(`Job ${job?.id} failed:`, err.message));

export default notificationWorker;