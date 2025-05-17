import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { keywordGroups } from "@/data/keywordToTypeMap";

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // async function sendUnknownQueryToServer(query: string) {
  //   await fetch("/api/analytics/unknown-query", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ query, timestamp: new Date().toISOString() }),
  //   });
  // }

  function detectTypeFromKeywords(query: string): string | null {
    const normalizedQuery = query.toLowerCase();

    for (const [type, keywords] of Object.entries(keywordGroups)) {
      if (
        keywords.some((keyword) =>
          normalizedQuery.includes(keyword.toLowerCase())
        )
      ) {
        return type;
      }
    }

    return null;
  }

  function handleSubmit() {
    const detectedType = detectTypeFromKeywords(query);

    if (!detectedType) {
      // logUnknownQuery(query);
      alert("نوع خدمات شناسایی نشد.");
      return;
    }

    const searchParams = new URLSearchParams();
    searchParams.set("type", detectedType);
    searchParams.set("query", query);

    navigate(`/terminal?${searchParams.toString()}`);
    // navigate(`/terminal/${detectedType}?query=${encodeURIComponent(query)}`);
  }

  //   function detectTypeFromQuery(query: string): string | null {
  //     for (const keyword in keywordToTypeMap) {
  //       if (query.toLowerCase().includes(keyword.toLowerCase())) {
  //         return keywordToTypeMap[keyword];
  //       }
  //     }
  //     return null;
  //   }

  // function handleSubmit() {
  //   const detectedType = detectTypeFromQuery(query);
  //   if (!detectedType) {
  //     alert("نوع خدمات شناسایی نشد.");
  //     return;
  //   }

  //   const results = searchableItems.filter((item) =>
  //     item.name.toLowerCase().includes(query.toLowerCase())
  //   );

  //   const searchParams = new URLSearchParams();
  //   searchParams.set("type", detectedType);
  //   searchParams.set("results", JSON.stringify(results));
  //   navigate(`/terminal?${searchParams.toString()}`);
  // }

  return (
    <div
      dir="rtl"
      className="flex flex-col items-center justify-start p-6 space-y-6 mt-4"
    >
      <div className="w-full md:w-[550px] relative">
        <button
          onClick={handleSubmit}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors z-10"
          aria-label="جستجو"
        >
          <SearchIcon size={22} className="cursor-pointer" />
        </button>
        <Input
          placeholder="جستجو"
          className="pl-12 text-right text-lg font-semibold border-2 border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 bg-white rounded-xl px-5 py-4 shadow-lg transition-all duration-300"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
      <div className="flex gap-4">
        <p>ایرانسل</p>
        <p>آرایشگاه</p>
        <p>مکانیکی</p>
        <p>گردشگری</p>
      </div>
    </div>
  );
}
//  <div
//       dir="rtl"
//       className="flex flex-col items-center justify-start p-6 space-y-6 mt-4"
//     >
//       <div className="w-[80%] flex items-center gap-2">
//         <Input
//           placeholder="جستجو..."
//           className="flex-1 text-right text-lg font-semibold border-2 border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 bg-white rounded-xl px-5 py-4 shadow-lg transition-all duration-300"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <Button
//           type="submit"
//           onClick={handleSubmit}
//           className="px-6 py-4 text-white text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg"
//         >
//           <SearchIcon className="ml-2" size={20} />
//           جستجو
//         </Button>
//       </div>

//       <div className="flex gap-4">
//         <p>ایرانسل</p>
//         <p>آرایشگاه</p>
//       </div>
//     </div>
