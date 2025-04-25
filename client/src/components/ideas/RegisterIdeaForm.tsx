import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RegisterIdeaType } from "@/types";
import { RenderError } from "@/lib/FormUtils";

type RegisterIdeaFormProps = {
  onSubmit: (data: RegisterIdeaType) => void;
  defaultValues?: RegisterIdeaType;
};

export default function RegisterIdeaForm({
  onSubmit,
  defaultValues,
}: RegisterIdeaFormProps) {
  const [subOptions, setSubOptions] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RegisterIdeaType>({ defaultValues });
  const [maritalStatus, gender, branchDetail, branchOfStudy] = watch([
    "maritalStatus",
    "gender",
    "branchDetail",
    "branchOfStudy",
  ]);

  // Reset form with the default values
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const branchesOptions = {
    "علوم انسانی": [
      "ادبیات",
      "زبان‌شناسی",
      "فلسفه",
      "جغرافیا",
      "تاریخ",
      "دین",
      "روان‌شناسی",
      "جامعه‌شناسی",
      "بازاریابی",
      "امور مالی",
      "اقتصاد",
      "مدیریت بازرگانی",
      "گردشگری",
      "حسابداری",
      "حقوق",
    ],
    هنر: [
      "نقاشی",
      "مجسمه‌سازی",
      "عکاسی",
      "هنرهای نمایشی",
      "طراحی لباس",
      "طراحی مد",
      "طراحی دوخت",
      "طراحی پارچه",
      "کتابت و نگارگری",
      "موسیقی",
      "طراحی صنعتی",
      "فرش",
      "طلا و جواهر",
      "گرافیک",
    ],
    "علوم تجربی": ["زیست‌ فناوری", "پزشکی", "مهندسی پزشکی", "زمین‌ شناسی"],
    مهندسی: [
      "مهندسی برق",
      "مهندسی مکانیک",
      "علوم کامپیوتر",
      "معماری",
      "مهندسی محاسباتی",
      "مهندسی زیست‌ محیطی",
    ],
    "تربیت بدنی": [],
    سایر: [],
  };

  type BranchKey = keyof typeof branchesOptions;

  function handleBranchChange(value: BranchKey) {
    setValue("branchOfStudy", value, { shouldValidate: true });
    setSubOptions(branchesOptions[value]);
    // setValue("branchDetail", ""); // Reset the sub-category field
  }

  function handleFormSubmit(data: RegisterIdeaType) {
    onSubmit(data);
  }

  return (
    <div>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="grid grid-cols-2 gap-8">
          {/* First Column */}
          <div className="space-y-2">
            {/* Father's and accociate Name Field */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  نام پدر
                  <span className="text-red-500"> *</span>
                </label>
                <Input
                  type="text"
                  {...register("fatherName", {
                    required: "نام پدر الزامی است",
                  })}
                />
                {RenderError(errors, "fatherName")}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  نام شرکا
                </label>
                <Input type="text" {...register("associate")} />
              </div>
            </div>
            {/* Country Field */}
            <div>
              <label className="block text-sm font-medium mb-2">کشور</label>
              <Input type="text" {...register("country")} />
            </div>

            {/* State and City Fields */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">استان</label>
                <Input type="text" {...register("state")} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  شهر
                  <span className="text-red-500"> *</span>
                </label>
                <Input
                  type="text"
                  {...register("city", { required: "شهر الزامی است" })}
                />
                {RenderError(errors, "city")}
              </div>
            </div>

            {/* Career Fields */}
            <div>
              <label className="block text-sm font-medium mb-2">
                شغل
                <span className="text-red-500"> *</span>
              </label>
              <Input
                type="text"
                {...register("career", { required: "شغل الزامی است" })}
              />
              {RenderError(errors, "career")}
            </div>

            {/* Marital Status and Gender Field */}
            <div className="flex gap-4">
              {/* Marital Status Select */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  وضعیت تاهل
                </label>
                <Select
                  onValueChange={(value) => setValue("maritalStatus", value)}
                  value={maritalStatus}
                >
                  <SelectTrigger style={{ direction: "rtl" }}>
                    <SelectValue placeholder="انتخاب وضعیت تاهل" />
                  </SelectTrigger>
                  <SelectContent style={{ direction: "rtl" }}>
                    <SelectItem value="single">مجرد</SelectItem>
                    <SelectItem value="married">متاهل</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("maritalStatus")} />
              </div>
              {/* Gender Select */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  جنسیت
                  <span className="text-red-500"> *</span>
                </label>
                <Select
                  onValueChange={(value) => {
                    setValue("gender", value, { shouldValidate: true });
                  }}
                  value={gender}
                >
                  <SelectTrigger style={{ direction: "rtl" }}>
                    <SelectValue placeholder="انتخاب جنسیت" />
                  </SelectTrigger>
                  <SelectContent style={{ direction: "rtl" }}>
                    <SelectItem value="male">مرد</SelectItem>
                    <SelectItem value="female">زن</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("gender", { required: "جنسیت الزامی است" })}
                />
                {RenderError(errors, "gender")}
              </div>
            </div>

            {/* Mobile Number and age Field */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  شماره تماس (موبایل)
                  <span className="text-red-500"> *</span>
                </label>
                <Input
                  type="text"
                  {...register("mobileNumber", {
                    required: "شماره موبایل الزامی است",
                  })}
                />
                {RenderError(errors, "mobileNumber")}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  سن
                  <span className="text-red-500"> *</span>
                </label>
                <Input
                  type="number"
                  {...register("age", { required: "سن الزامی است" })}
                />
                {RenderError(errors, "age")}
              </div>
            </div>
          </div>

          {/* Second Column */}
          <div className="space-y-2">
            {/* Branch of Study */}
            <div>
              <label className="block text-sm font-medium mb-2">
                رشته ی تحصیلی
                <span className="text-red-500"> *</span>
              </label>
              <Select
                onValueChange={(value) =>
                  handleBranchChange(value as BranchKey)
                }
              >
                <SelectTrigger style={{ direction: "rtl" }}>
                  <SelectValue placeholder="رشته تحصیلی را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent style={{ direction: "rtl" }}>
                  {Object.keys(branchesOptions).map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register("branchOfStudy", {
                  required: "رشته تحصیلی الزامی است",
                })}
              />
              {RenderError(errors, "branchOfStudy")}
            </div>

            {/* Sub-options based on branch */}
            {branchOfStudy && subOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  زمینه تخصصی
                </label>
                <Select
                  onValueChange={(value) =>
                    setValue("branchDetail", value, { shouldValidate: true })
                  }
                  value={branchDetail}
                >
                  <SelectTrigger style={{ direction: "rtl" }}>
                    <SelectValue placeholder="زمینه تخصصی را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent style={{ direction: "rtl" }}>
                    {subOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("branchDetail")} />
              </div>
            )}

            {/* Idea Title Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                عنوان ایده
                <span className="text-red-500"> *</span>
              </label>
              <Input
                type="text"
                {...register("ideaTitle", {
                  required: "عنوان ایده الزامی است",
                })}
              />
              {RenderError(errors, "ideaTitle")}
            </div>

            {/* Idea Details Field*/}
            <div>
              <label className="block text-sm font-medium mb-2">
                ایده خود را توصیف کنید
                <span className="text-red-500"> *</span>
              </label>
              <Textarea
                className="min-h-[10rem]"
                {...register("ideaDescription", {
                  required: "توصیف ایده الزامی است",
                })}
              />
              {RenderError(errors, "ideaDescription")}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              ارسال
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
