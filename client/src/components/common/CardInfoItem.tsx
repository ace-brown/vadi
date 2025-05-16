import { ReactNode } from "react";

type CardInfoItemProps = {
  label?: string;
  value?: ReactNode;
  className?: string;
};

export default function CardInfoItem({
  label,
  value,
  className = "",
}: CardInfoItemProps) {
  return (
    <div className={className}>
      {label && <p className="text-gray-500">{label}</p>}
      <div className="font-semibold mt-1">{value}</div>
    </div>
  );
}
