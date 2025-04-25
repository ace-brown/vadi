import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto mt-6">
      <Card className="p-6">
        <CardHeader>
          <CardTitle>سیاست حفظ حریم خصوصی</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-light text-[#b3b3b3] text-right lg:text-[clamp(1rem,2vw,1.5rem)]">
            حریم خصوصی شما برای ما اهمیت زیادی دارد. لطفاً این سیاست را به دقت
            مطالعه کنید تا با نحوه جمع‌آوری، استفاده و حفاظت از اطلاعات شما آشنا
            شوید.
          </p>

          <h2 className="mt-6 text-xl font-semibold">۱. جمع‌آوری اطلاعات</h2>
          <ul className="list-disc pr-6 text-right">
            <li>
              ما اطلاعات شخصی شما را تنها زمانی جمع‌آوری می‌کنیم که شما به صورت
              داوطلبانه آن را در اختیار ما قرار دهید.
            </li>
            <li>
              اطلاعات جمع‌آوری‌شده ممکن است شامل نام، ایمیل، شماره تماس و سایر
              جزئیات مرتبط باشد.
            </li>
            <li>
              ما از ابزارهای تحلیلی مانند کوکی‌ها برای بهبود تجربه کاربری و
              تحلیل رفتار کاربران استفاده می‌کنیم.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">۲. استفاده از اطلاعات</h2>
          <ul className="list-disc pr-6 text-right">
            <li>
              اطلاعات جمع‌آوری‌شده ممکن است برای ارسال اطلاعیه‌ها،
              به‌روزرسانی‌ها یا پیشنهادات شخصی‌شده استفاده شود.
            </li>
            <li>
              ما از اطلاعات شما برای بهبود کیفیت خدمات، پشتیبانی مشتری و توسعه
              محصولات استفاده می‌کنیم.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">
            ۳. اشتراک‌گذاری اطلاعات
          </h2>
          <ul className="list-disc pr-6 text-right">
            <li>
              ما اطلاعات شما را به هیچ شخص ثالثی بدون رضایت شما نخواهیم فروخت یا
              اجاره خواهیم داد.
            </li>
            <li>
              در برخی موارد ممکن است برای رعایت مقررات قانونی یا در صورت درخواست
              مراجع قانونی اطلاعات شما را به مقامات مربوطه ارسال کنیم.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">۴. امنیت اطلاعات</h2>
          <ul className="list-disc pr-6 text-right">
            <li>
              ما از تدابیر امنیتی استاندارد برای محافظت از اطلاعات شخصی شما
              استفاده می‌کنیم.
            </li>
            <li>
              هرچند که هیچ سیستم آنلاین به طور کامل امن نیست، اما ما تمام تلاش
              خود را برای حفظ اطلاعات شما انجام خواهیم داد.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">۵. دسترسی به اطلاعات</h2>
          <ul className="list-disc pr-6 text-right">
            <li>
              شما حق دارید که اطلاعات شخصی خود را مشاهده، اصلاح یا درخواست حذف
              آن را از پلتفرم داشته باشید.
            </li>
            <li>برای انجام این کار، لطفاً با تیم پشتیبانی ما تماس بگیرید.</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">
            ۶. تغییرات در سیاست حفظ حریم خصوصی
          </h2>
          <ul className="list-disc pr-6 text-right">
            <li>
              این سیاست ممکن است در آینده تغییر کند. هرگونه تغییر در سیاست حریم
              خصوصی به طور شفاف در این صفحه اعلام خواهد شد.
            </li>
            <li>
              استفاده ادامه‌دار شما از پلتفرم پس از اعمال تغییرات به معنی پذیرش
              آن‌هاست.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">۷. تماس با ما</h2>
          <p className="text-right pr-6">
            اگر سوالات یا نگرانی‌هایی در مورد سیاست حفظ حریم خصوصی دارید، لطفاً
            با تیم پشتیبانی ما از طریق ایمیل یا شماره تماس موجود در وب‌سایت تماس
            بگیرید.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
