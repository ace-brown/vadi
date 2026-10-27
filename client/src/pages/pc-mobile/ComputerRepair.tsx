import PlaceListingPage from "@/components/listing/PlaceListingPage";

export default function ComputerRepairPage() {
  return (
    <PlaceListingPage
      endpoint="/api/pc-mobile/computer-repair"
      title="Computer & laptop repair"
      actionLabel="Request a repair"
      returnTxt="Back to repair type selection"
      returnSlug="/pc-mobile/pc-mobile-details-select"
    />
  );
}
