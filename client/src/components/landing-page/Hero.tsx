import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="text-center py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
        Compare local services and prices across Germany
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        From internet plans to dentists and garages, see the options side by side and choose with confidence
      </p>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Link to="/aesthetic/aesthetic-details-select">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow hover:bg-blue-700 transition">
            Compare salons
          </button>
        </Link>
        <Link to="/internet/internet-details-select">
          <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-2xl shadow hover:bg-gray-300 transition">
            View internet plans
          </button>
        </Link>
        <Link to="/vehicle/vehicle-details-select">
          <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-2xl shadow hover:bg-gray-300 transition">
            Explore vehicle services
          </button>
        </Link>
      </div>
    </section>
  );
}
