import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  Scissors,
  Tv,
  Smartphone,
  Shovel,
  HeartPulse,
  Car,
  Book,
} from "lucide-react";

const categoriesItems = [
  {
    label: "اینترنت",
    icon: <Wifi className="w-8 h-8 text-blue-600" />,
    link: "/internet/internet-details-select",
  },
  {
    label: "آرایشی و زیبایی",
    icon: <Scissors className="w-8 h-8 text-pink-500" />,
    link: "/aesthetic/aesthetic-details-select",
  },
  {
    label: "لوازم الکترونیک",
    icon: <Tv className="w-8 h-8 text-purple-600" />,
    link: "/electronics/appliance-repair",
  },
  {
    label: "موبایل و کامپیوتر",
    icon: <Smartphone className="w-8 h-8 text-green-600" />,
    link: "/pc-mobile/pc-mobile-details-select",
  },
  {
    label: "خدمات کشاورزی",
    icon: <Shovel className="w-8 h-8 text-lime-600" />,
    link: "/agriculture/agriculture-details-select",
  },
  {
    label: "خدمات سلامت",
    icon: <HeartPulse className="w-8 h-8 text-red-600" />,
    link: "/healthcare/dental",
  },
  {
    label: "وسایل نقلیه",
    icon: <Car className="w-8 h-8 text-yellow-600" />,
    link: "/vehicle/vehicle-details-select",
  },
  {
    label: "آموزشی",
    icon: <Book className="w-8 h-8 text-indigo-600" />,
    link: "/education/education-details-select",
  },
  // {
  //   label: "گردشگری",
  //   icon: <Plane className="w-8 h-8 text-cyan-600" />,
  //   link: "#",
  // },
];

export default function CategoryGrid() {
  return (
    <section className="py-12 px-4" dir="rtl">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        دسته‌بندی‌های مقایسه
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {categoriesItems.map((item, index) => (
          <Card
            key={index}
            className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
          >
            <CardContent className="flex flex-col items-center gap-4">
              {item.icon}
              <h3 className="text-lg font-semibold">{item.label}</h3>
              <Button asChild>
                <Link to={item.link}>رفتن به صفحه</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
