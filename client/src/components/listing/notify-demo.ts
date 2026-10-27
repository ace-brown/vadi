import { toast } from "sonner";

// Listings are sample data, so actions explain that instead of pretending to book
export function notifyDemo(action: string, name: string) {
  toast.info(`${action}: ${name}`, {
    description: "This is a demo listing, so nothing was booked or ordered.",
  });
}
