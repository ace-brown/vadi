import PlaceListingPage from "@/components/listing/PlaceListingPage";

export default function MobileRepairPage() {
  return (
    <PlaceListingPage
      endpoint="/api/pc-mobile/mobile-repair"
      title="Mobile repair"
      actionLabel="Request a repair"
      returnTxt="Back to repair type selection"
      returnSlug="/pc-mobile/pc-mobile-details-select"
    />
  );
}
