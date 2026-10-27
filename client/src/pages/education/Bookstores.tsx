import PlaceListingPage from "@/components/listing/PlaceListingPage";

export default function BookstoresPage() {
  return (
    <PlaceListingPage
      endpoint="/api/education/bookstores"
      title="Bookstores"
      actionLabel="Contact"
      returnTxt="Back to education service selection"
      returnSlug="/education/education-details-select"
    />
  );
}
