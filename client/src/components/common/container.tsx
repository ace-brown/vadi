import React, { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mt-bt-sect-lg md:mt-bt-sect-md sm:mt-bt-sect-sm ">
      {children}
    </div>
  );
}
