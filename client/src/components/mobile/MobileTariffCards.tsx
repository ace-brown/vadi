// components/MobileTariffCards.tsx
import MobileTariffCard from "./MobileTariffCard";

export default function MobileTariffCards() {
  const dummyTariffInfo = [
    { volume: 5, price: 4.5, tariffs: 342 },
    { volume: 10, price: 20, tariffs: 145 },
    { volume: 15, price: 27, tariffs: 1432 },
    { volume: 20, price: 13.5, tariffs: 965 },
  ];

  return (
    <div className="p-6" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-right text-gray-800">
        تعرفه‌های موبایل
      </h2>
      {dummyTariffInfo.map((tariff, index) => (
        <MobileTariffCard key={index} tariff={tariff} />
      ))}
    </div>
  );
}
