import redis from "../config/redis.js";

const LOCK_EXPIRY = 600; // 10 minutes

export const lockSlot = async (
  barberId: string,
  date: string,
  slot: string
): Promise<boolean> => {
  const key = `lock:${barberId}:${date}:${slot}`;
  const result = await redis.set(key, "locked", "EX", LOCK_EXPIRY, "NX");
  return result === "OK";
};

export const releaseSlot = async (
  barberId: string,
  date: string,
  slot: string
): Promise<void> => {
  const key = `lock:${barberId}:${date}:${slot}`;
  await redis.del(key);
};

export const isSlotLocked = async (
  barberId: string,
  date: string,
  slot: string
): Promise<boolean> => {
  const key = `lock:${barberId}:${date}:${slot}`;
  const result = await redis.get(key);
  return result !== null;
};