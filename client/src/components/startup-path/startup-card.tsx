import React from "react";
import Image from "next/image";

import { SatrtUpCardDataType } from "@/types";
import { CardFooter } from "../ui/card";

export default function StartUpCard({
  item,
  rightSide,
}: {
  item: SatrtUpCardDataType;
  rightSide?: boolean;
}) {
  return (
    <>
      {/* This is visible on medium screens (768px) and above.  */}
      <div className="hidden md:block">
        <div
          key={item.id}
          className={`w-[450px] grid  ${
            rightSide ? "grid-cols-[4fr_6fr]" : "grid-cols-[6fr_4fr]"
          } bg-gray-200 shadow-lg rounded-[1rem]`}
        >
          <div className={`h-[250px] ${rightSide ? "order-2" : "order-1"}`}>
            <Image
              src={item.imgSrc}
              alt="image"
              className={`h-full object-cover ${
                rightSide
                  ? "rounded-tl-[0] rounded-tr-[1rem] rounded-br-[1rem] rounded-bl-[0]"
                  : "rounded-tl-[1rem] rounded-tr-[0] rounded-br-[0] rounded-bl-[1rem]"
              }`}
            />
          </div>
          <div className={`p-4 h-[250px] ${rightSide ? "order-1" : "order-2"}`}>
            <h2 className="text-3xl">{item.title}</h2>
            <p className="mb-2 mt-2 text-[12px]">{item.description}</p>
            <CardFooter className="mt-4">
              {/* <Link
          
            href={item.link}
            className="text-blue-500 font-medium hover:underline"
          >
            بیشتر بخوانید
          </Link> */}
            </CardFooter>
          </div>
        </div>
      </div>
      {/* This is visible only on small screens (below 640px). */}
      <div className="block sm:hidden">
        <div key={item.id} className="bg-gray-200 shadow-lg rounded-[1rem]">
          <div className="h-[300px]">
            <Image
              src={item.imgSrc}
              alt="image"
              className="rounded-[1rem] rounded-br-[0] rounded-bl-[0rem] object-cover h-full w-full"
            />
          </div>
          <div className="p-4">
            <h2 className="text-3xl">{item.title}</h2>
            <p className="mb-2 mt-2 text-[12px]">{item.description}</p>
            <CardFooter className="mt-4">
              {/* <Link
          
            href={item.link}
            className="text-blue-500 font-medium hover:underline"
          >
            بیشتر بخوانید
          </Link> */}
            </CardFooter>
          </div>
        </div>
      </div>
    </>
  );
}
