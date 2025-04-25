import React, { ReactNode } from "react";

export default function Section({ children }: { children: ReactNode }) {
  return <div className="mt-[9rem] md:mt-[8rem] sm:mt-[5rem]">{children}</div>;
}
