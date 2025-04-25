import React, { ReactNode } from "react";

export default function SubSection({ children }: { children: ReactNode }) {
  return <div className="mt-[7rem] md:mt-[5rem] sm:mt-[3rem]">{children}</div>;
}
