import SalonListingPage from "@/components/listing/SalonListingPage";

const SERVICES = [
  { field: "haircutPrice", label: "Haircut & beard trim" },
  { field: "menLiftPrice", label: "Skin rejuvenation" },
  { field: "groomMakeupPrice", label: "Groom makeup" },
  { field: "curlyHairDoPrice", label: "Hair curling" },
];

export default function MenSalonPage() {
  return (
    <SalonListingPage
      endpoint="/api/aesthetic/men-salon"
      title="Men's salons"
      services={SERVICES}
      returnTxt="Back to salon type selection"
      returnSlug="/aesthetic/aesthetic-details-select"
    />
  );
}
