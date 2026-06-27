export const CHAIR_PRICING = {
  monthly: 50,
  halfYearly: 289,
  yearly: 549,
} as const;

export type BillingCycle = keyof typeof CHAIR_PRICING;

// export const calculatePrice = (chairs: number, cycle: BillingCycle): number => {
//   if (chairs >= 8) return -1; // Custom pricing
//   return chairs * CHAIR_PRICING[cycle];
// };

export const calculatePrice = (chairs: number, cycle: BillingCycle): number => {
  return chairs * CHAIR_PRICING[cycle];
};

export const PLANS = {
  trial: {
    name: "Trial",
    price: 0,
    durationDays: 14,
  },
  monthly: {
    name: "Monthly",
    pricePerChair: 50,
    durationDays: 30,
  },
  halfYearly: {
    name: "6 Months",
    pricePerChair: 289,
    durationDays: 180,
  },
  yearly: {
    name: "Yearly",
    pricePerChair: 549,
    durationDays: 365,
  },
} as const;

export const TRIAL_DAYS = 14;
export const MAX_CHAIRS_STANDARD = 8;