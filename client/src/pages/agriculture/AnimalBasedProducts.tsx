import PlaceListingPage from "@/components/listing/PlaceListingPage";

export default function AnimalBasedProductsPage() {
  return (
    <PlaceListingPage
      endpoint="/api/agriculture/animal-based-products"
      title="Animal products"
      actionLabel="Contact"
      returnTxt="Back to agriculture service selection"
      returnSlug="/agriculture/agriculture-details-select"
    />
  );
}
