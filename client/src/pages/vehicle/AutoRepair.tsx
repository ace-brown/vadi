import PlaceListingPage from "@/components/listing/PlaceListingPage";

export default function AutoRepairPage() {
  return (
    <PlaceListingPage
      endpoint="/api/vehicle/auto-repair"
      title="Car repair"
      actionLabel="Book an appointment"
      returnTxt="Back to vehicle type selection"
      returnSlug="/vehicle/vehicle-details-select"
    />
  );
}
