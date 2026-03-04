interface BadgeProps {
  label: string;
  color?: string;
}

export default function Badge({ label }: BadgeProps) {
  return <span>{label}</span>;
}
