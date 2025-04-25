import React from "react";
import { useRouter } from "next/navigation";

export default function ComparePage() {
  const router = useRouter();
  const { results } = router.query;
  let parsedData: { id: number; name: string }[] = [];

  if (typeof results == "string") {
    try {
      parsedData = JSON.parse(results);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div>
      {parsedData.length > 0 ? (
        parsedData.map((item) => {
          return <div>{item.name}</div>;
        })
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
}
