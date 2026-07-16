import { Star } from 'lucide-react';

export default function RatingChip({ value }) {
  if (value === null || value === undefined) {
    return <span className="rating-chip empty">No ratings yet</span>;
  }
  return (
    <span className="rating-chip">
      <Star size={13} fill="currentColor" />
      {value}
    </span>
  );
}
