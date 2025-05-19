import { Search, ListOrdered, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-10 h-10 text-blue-600" />,
      title: "جستجو کنید",
      description: "خدمات مورد نظر خود را پیدا کنید",
    },
    {
      icon: <ListOrdered className="w-10 h-10 text-yellow-500" />,
      title: "مقایسه کنید",
      description: "قیمت‌ها، کیفیت و گزینه‌ها را بررسی کنید",
    },
    {
      icon: <CheckCircle className="w-10 h-10 text-green-600" />,
      title: "انتخاب کنید",
      description: "بهترین گزینه را با اطمینان انتخاب کنید",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50" dir="rtl">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
        چطور کار می‌کند؟
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center gap-4">
            {step.icon}
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
