import SalonListingPage from "@/components/listing/SalonListingPage";

const SERVICES = [
  { field: "faceCarePrice", label: "Facial" },
  { field: "hairBotoxPrice", label: "Hair botox" },
  { field: "hairColorPrice", label: "Hair coloring" },
  { field: "makeupPrice", label: "Makeup" },
  { field: "eyelashExtensionPrice", label: "Eyelash extension" },
  { field: "eyebrowShapePrice", label: "Eyebrow shaping" },
  { field: "eyebrowLiftPrice", label: "Eyebrow lift" },
  { field: "nailExtensionPrice", label: "Nail extension" },
  { field: "manicurePrice", label: "Manicure" },
  { field: "waxingPrice", label: "Waxing" },
];

export default function WomenSalonPage() {
  return (
    <SalonListingPage
      endpoint="/api/aesthetic/women-salon"
      title="Women's salons"
      services={SERVICES}
      returnTxt="Back to salon type selection"
      returnSlug="/aesthetic/aesthetic-details-select"
    />
  );
}
