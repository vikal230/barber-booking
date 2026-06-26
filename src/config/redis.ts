// import Redis from "ioredis";

// const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
//   retryStrategy: (times) => Math.min(times * 50, 2000),
//   lazyConnect: true,
// });

// redis.on("connect", () => console.log("Redis connected"));
// redis.on("error", (err) => console.error("Redis error:", err.message));

// export default redis;


// import Redis from "ioredis";

// let redis: Redis;

// try {
//   redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
//     retryStrategy: () => null,
//     lazyConnect: true,
//   });

//   redis.on("connect", () => console.log("Redis connected"));
//   redis.on("error", () => {});
// } catch {
//   redis = new Redis({ lazyConnect: true });
// }

// export default redis;


// import Redis from "ioredis";
// import dotenv from "dotenv";
// dotenv.config();
// const redis = new Redis(process.env.REDIS_URL!, {
//   tls: {},
//   retryStrategy: (times) => Math.min(times * 50, 2000),
// });


// redis.on("connect", () => console.log("Redis connected"));
// redis.on("error", (err) => console.error("Redis error:", err));

// export default redis;


import dotenv from "dotenv";
dotenv.config();

import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!, {
  tls: {},
  retryStrategy: (times) => Math.min(times * 50, 2000),
  enableOfflineQueue: false,
  connectTimeout: 10000,
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err.message));

export default redis;