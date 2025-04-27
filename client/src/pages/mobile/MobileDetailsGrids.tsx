import SimCardInfo from "./SimCardInfo";
import irancel from "@/images/logos/irancel-logo.png";
import hamrahAval from "@/images/logos/hamrah-aval-logo.jpg";
import rightel from "@/images/logos/rightel-logo.jpg";

export default function MobileDetailsGrids() {
  const mobilePackages = [
    {
      type: "اعتباری",
      simPrice: "۵۰,۰۰۰ تومان",
      validity: "۳۰ روز",
      packagePrice: "۱۲۰,۰۰۰ تومان",
      minutes: "۵۰۰ دقیقه",
      image: irancel,
    },
    {
      type: "دائمی",
      simPrice: "۷۵,۰۰۰ تومان",
      validity: "۶۰ روز",
      packagePrice: "۲۰۰,۰۰۰ تومان",
      minutes: "۱۰۰۰ دقیقه",
      image: hamrahAval,
    },
    {
      type: "اعتباری ویژه",
      simPrice: "۱۰۰,۰۰۰ تومان",
      validity: "۹۰ روز",
      packagePrice: "۳۰۰,۰۰۰ تومان",
      minutes: "۲۰۰۰ دقیقه",
      image: rightel,
    },
  ];

  return (
    <div className="w-full mx-auto mt-8 p-6 grid grid-cols-5 gap-6">
      {/* Filter Column (20% width) */}
      <div className="col-span-1 bg-white p-4 rounded border">
        <h2 className="font-semibold text-xl mb-4">فیلترها</h2>
        {/* Add your filter options here */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm">نوع سیم‌کارت</label>
            <select className="w-full p-2 border rounded-md">
              <option value="all">همه</option>
              <option value="prepaid">اعتباری</option>
              <option value="postpaid">دائمی</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">محدوده قیمت</label>
            <input type="range" min="0" max="1000" className="w-full p-2" />
          </div>
          {/* Add more filters here */}
        </div>
      </div>

      {/* Card Column (80% width) */}
      <div className="col-span-4 flex flex-col gap-6">
        {mobilePackages.map((pkg, index) => (
          <SimCardInfo
            key={index}
            type={pkg.type}
            simPrice={pkg.simPrice}
            validity={pkg.validity}
            packagePrice={pkg.packagePrice}
            minutes={pkg.minutes}
            image={pkg.image}
          />
        ))}
      </div>
    </div>
  );
}
