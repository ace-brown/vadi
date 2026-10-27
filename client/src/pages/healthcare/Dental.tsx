import PlaceListingPage from "@/components/listing/PlaceListingPage";

export default function DentalPage() {
  return (
    <PlaceListingPage
      endpoint="/api/healthcare/dental"
      title="Dentists"
      actionLabel="Book an appointment"
    />
  );
}
