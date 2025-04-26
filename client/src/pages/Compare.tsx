import { useLocation } from "react-router-dom";

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
          return <div>{item.name}</div>;
        })
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
}
