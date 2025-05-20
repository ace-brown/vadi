import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold text-center mb-4 text-[#023e8a]">
        تماس با ما
      </h1>
      <div className="flex items-center justify-center gap-2 text-gray-700">
        <Mail className="text-[#023e8a]" />
        <span className="text-md break-all">kazem_abdi@yahoo.com</span>
      </div>
    </div>
  );
}
