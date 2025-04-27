import { useLocation } from "react-router-dom";
import MobileDetailsSelect from "./mobile/MobileDetailsSelect";

export default function ComparePage() {
  let results: { id: number; name: string }[] = [];
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const resultsParams = searchParams.get("results");
  results = resultsParams ? JSON.parse(resultsParams) : [];
  return (
    <div>
      {results.length > 0 ? (
        results.map((item) => {
          return <MobileDetailsSelect />;
        })
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
}
