import PlaceListingPage from "@/components/listing/PlaceListingPage";

export default function ApplianceRepairPage() {
  return (
    <PlaceListingPage
      endpoint="/api/electronics/appliance-repair"
      title="Home appliance repair"
      actionLabel="Request a repair"
    />
  );
}
