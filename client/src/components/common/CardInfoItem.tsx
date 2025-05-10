type CardInfoItemProps = {
  label: string;
  value: string;
  className?: string;
};

export default function CardInfoItem({
  label,
  value,
  className = "",
}: CardInfoItemProps) {
  return (
    <div className={className}>
      <p className="text-gray-500">{label}</p>
      <p className="font-semibold mt-1">{value}</p>
    </div>
  );
}
