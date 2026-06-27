import cron from "node-cron";
import Salon from "../models/Salon.js";
import { addNotificationJob } from "./queue.service.js";

// Har raat 12 baje chalta hai
export const startCronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("🕐 Cron: Subscription check chal raha hai...");

    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // 3 din mein expire hone wale salons
    const expiringSalons = await Salon.find({
      status: "active",
      "subscription.expiresAt": {
        $gte: now,
        $lte: threeDaysLater,
      },
    }).populate("ownerId", "name phone");

    for (const salon of expiringSalons) {
      const owner = salon.ownerId as any;
      console.log(`⚠️ Warning: ${salon.businessName} ka subscription 3 din mein khatam hoga`);

      await addNotificationJob("reminder", {
        phone: owner.phone,
        name: owner.name,
        salonName: salon.businessName,
        date: salon.subscription.expiresAt.toLocaleDateString("en-IN"),
      });
    }

    // Expire ho gaye salons — suspend karo
    const expiredSalons = await Salon.find({
      status: "active",
      "subscription.expiresAt": { $lt: now },
      "subscription.autoRenew": false,
    });

    for (const salon of expiredSalons) {
      await Salon.findByIdAndUpdate(salon._id, { status: "suspended" });
      console.log(`❌ Suspended: ${salon.businessName}`);
    }

    console.log("✅ Cron: Subscription check complete");
  });

  console.log("✅ Cron jobs started");
};