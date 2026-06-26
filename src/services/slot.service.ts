import Booking from "../models/Booking.js";
import Barber from "../models/Barber.js";

interface TimeSlot {
  start: string;
  end: string;
}

const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

const generateBaseSlots = (start: string, end: string, duration: number): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  let current = timeToMinutes(start);
  const endTime = timeToMinutes(end);

  while (current + duration <= endTime) {
    slots.push({
      start: minutesToTime(current),
      end: minutesToTime(current + duration),
    });
    current += duration;
  }

  return slots;
};

const filterBreaks = (slots: TimeSlot[], breakTimes: TimeSlot[]): TimeSlot[] => {
  return slots.filter((slot) => {
    return !breakTimes.some(
      (b) =>
        timeToMinutes(slot.start) < timeToMinutes(b.end) &&
        timeToMinutes(slot.end) > timeToMinutes(b.start)
    );
  });
};

export const getAvailableSlots = async (
  barberId: string,
  date: string,
  duration: number
): Promise<TimeSlot[]> => {
  const barber = await Barber.findById(barberId);
  if (!barber) return [];

  const base = generateBaseSlots(
    barber.workingHours.start,
    barber.workingHours.end,
    duration
  );

  const filtered = filterBreaks(base, barber.breakTimes);

  const booked = await Booking.find({
    barberId,
    date,
    status: { $nin: ["cancelled"] },
  }).select("slot");

  return filtered.filter((slot) => {
    return !booked.some((b) => b.slot.start === slot.start);
  });
};