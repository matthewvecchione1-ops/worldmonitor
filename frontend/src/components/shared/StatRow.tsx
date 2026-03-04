interface StatRowProps {
  label: string;
  value: string;
  change?: string | null;
}

export default function StatRow({ label, value }: StatRowProps) {
  return <div>{label}: {value}</div>;
}
