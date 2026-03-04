interface SeverityDotProps {
  level: 'critical' | 'high' | 'moderate' | 'low';
}

export default function SeverityDot({ level }: SeverityDotProps) {
  return <span data-level={level} />;
}
