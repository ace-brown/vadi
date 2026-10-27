import PlaceListingPage from "@/components/listing/PlaceListingPage";

export default function EduCentersPage() {
  return (
    <PlaceListingPage
      endpoint="/api/education/centers"
      title="Education centers"
      actionLabel="Contact"
      returnTxt="Back to education service selection"
      returnSlug="/education/education-details-select"
    />
  );
}
