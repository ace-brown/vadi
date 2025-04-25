import React, { ReactNode } from "react";

export default function Text({ children }: { children: ReactNode }) {
  return <div className="mt-h-txt-lg md:h-txt-md sm:h-txt-sm ">{children}</div>;
}
