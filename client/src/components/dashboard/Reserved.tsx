import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReservedDetailsDialog } from "./ReservedDetailsDialog";
import { ReservedOne } from "@/types";

const T_DATA: ReservedOne[] = [
  {
    id: 1,
    reservedFor: "آرایشگاه مردانه نوین",
    time: "۱۴۰۴/۰۴/۲۰ - ساعت ۱۵:۰۰",
    address: "تهران، خیابان ولیعصر، کوچه زنبق",
  },
  {
    id: 2,
    reservedFor: "مرکز تعمیرات موبایل تکنو",
    time: "۱۴۰۴/۰۴/۲۲ - ساعت ۱۱:۳۰",
    address: "تبریز، خیابان امام خمینی، پلاک ۱۲۰",
  },
  {
    id: 3,
    reservedFor: "تعمیرگاه خودرو پارس‌کار",
    time: "۱۴۰۴/۰۴/۲۵ - ساعت ۰۹:۰۰",
    address: "اصفهان، جاده تهران، جنب پمپ بنزین",
  },
];

export default function Reserved() {
  const [RsvDetailsDialogOpen, setRsvDetailsDialogOpen] = useState(false);
  const [selectedRsv, setSelectedRsv] = useState<ReservedOne | null>(null);
  const handleDetails = (reserved: ReservedOne) => {
    setRsvDetailsDialogOpen(true);
    setSelectedRsv(reserved);
  };

  const handleCancel = (id: number) => {
    console.log("Cancel reservation:", id);
    // Cancel logic here
  };

  return (
    <>
      <Table dir="rtl">
        <TableHeader>
          <TableRow>
            <TableHead>نوبت برای</TableHead>
            <TableHead>زمان</TableHead>
            <TableHead>آدرس</TableHead>
            <TableHead className="text-center">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {T_DATA.map((data) => (
            <TableRow key={data.id}>
              <TableCell>{data.reservedFor}</TableCell>
              <TableCell>{data.time}</TableCell>
              <TableCell>{data.address}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancel(data.id)}
                >
                  لغو
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDetails(data)}
                >
                  جزئیات
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {RsvDetailsDialogOpen && <ReservedDetailsDialog reserved={selectedRsv} />}
    </>
  );
}
