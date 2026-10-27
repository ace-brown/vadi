import PlaceListingPage from "@/components/listing/PlaceListingPage";

export default function GardenSuppliesPage() {
  return (
    <PlaceListingPage
      endpoint="/api/agriculture/garden-supplies"
      title="Fertilizer & garden supplies"
      actionLabel="Contact"
      returnTxt="Back to agriculture service selection"
      returnSlug="/agriculture/agriculture-details-select"
    />
  );
}
