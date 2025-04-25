import React, { useState } from "react";
import { FiCopy } from "react-icons/fi";
import { Tooltip } from "react-tooltip";

interface ShortenAndCopyProps {
  id: string | undefined;
  length?: number;
}

export default function ShortenAndCopy({
  id,
  length = 6,
}: ShortenAndCopyProps) {
  const [tooltipText, setTooltipText] = useState("برای کپی کلیک کنید");

  async function handleCopy() {
    try {
      if (id) {
        await navigator.clipboard.writeText(id);
        setTooltipText("کپی شد!");
        setTimeout(() => setTooltipText("برای کپی کلیک کنید"), 2000);
      }
    } catch (error) {
      console.error("Failed to copy ID:", error);
    }
  }

  let shortenedId = "";
  if (id) {
    shortenedId =
      id.length <= length * 2
        ? id
        : `${id.slice(0, length)}...${id.slice(-length)}`;
  }

  return (
    <div className="relative inline-block cursor-pointer" onClick={handleCopy}>
      <div
        className="flex items-center gap-2 border border-gray-300 rounded px-1 py-[0.5px] w-fit"
        data-tooltip-id="copy-tooltip"
        data-tooltip-content={tooltipText}
      >
        <FiCopy className="text-gray-500 hover:text-blue-600 transition duration-200" />
        <span className="text-blue-600" dir="ltr">
          {shortenedId}
        </span>
      </div>
      <Tooltip id="copy-tooltip" />
    </div>
  );
}
