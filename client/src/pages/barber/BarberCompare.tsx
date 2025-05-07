import { useLocation } from "react-router-dom";

export default function BarberComparePage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const state = params.get("state");
  const city = params.get("city");
  const type = params.get("type");

  return (
    <div>
      {state} - {city} - {type}
    </div>
  );
}
