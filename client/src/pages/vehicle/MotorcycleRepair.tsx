import PlaceListingPage from "@/components/listing/PlaceListingPage";

export default function MotorcycleRepairPage() {
  return (
    <PlaceListingPage
      endpoint="/api/vehicle/motorcycle-repair"
      title="Motorcycle repair"
      actionLabel="Book an appointment"
      returnTxt="Back to vehicle type selection"
      returnSlug="/vehicle/vehicle-details-select"
    />
  );
}
