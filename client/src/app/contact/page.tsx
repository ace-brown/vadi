"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full"> */}
        {/* Contact Form */}
        {/* <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-right text-2xl font-bold">
              تماس با ما
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="block text-right">
                نام شما
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="نام و نام خانوادگی"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-right">
                ایمیل شما
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="block text-right">
                پیام شما
              </Label>
              <Textarea
                id="message"
                placeholder="چگونه می‌توانیم به شما کمک کنیم؟"
                rows={5}
                dir="rtl"
              />
            </div>
            <Button className="w-full" variant="default">
              ارسال پیام
            </Button>
          </CardContent>
        </Card> */}

        {/* Contact Person Info */}
        <Card className="shadow-lg flex flex-col justify-center p-12">
          <CardContent>
            <h2 className="text-right text-xl font-semibold mb-4">
              اطلاعات تماس
            </h2>
            <p className="text-right text-gray-700 mb-4">
              برای هرگونه سوال یا پشتیبانی با ما در ارتباط باشید.
            </p>
            <div className="space-y-2">
              <div className="text-right">
                <span className="font-bold">ایمیل:</span> kazem_abdi@yahoo.com
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
