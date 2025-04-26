import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import img1 from "@/images/travel/img-1.jpg";
import img2 from "@/images/travel/img-2.jpg";
import img3 from "@/images/travel/img-3.jpg";
import img4 from "@/images/travel/img-4.jpg";
import img5 from "@/images/travel/img-5.jpg";
import img6 from "@/images/travel/img-6.jpg";

const dummyData = [
  { id: 1, title: "بندر عباس", image: img1 },
  { id: 2, title: "یزد", image: img2 },
  { id: 3, title: "دشت لوت", image: img3 },
  { id: 4, title: "لرستان", image: img4 },
  { id: 5, title: "جزیره قشم", image: img5 },
  { id: 6, title: "جزیره ابوموسی", image: img6 },
  { id: 7, title: "شاهرود", image: img3 },
  { id: 8, title: "جزیره کیش", image: img1 },
];

export default function Travel() {
  return (
    <div dir="rtl" className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {dummyData.map((item) => (
          <Card
            key={item.id}
            className="flex flex-col items-center p-4 space-y-4"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-32 object-cover rounded-xl"
            />
            <CardContent className="text-center p-0">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <Button>مشاهده</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
