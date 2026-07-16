import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, size = 18 }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="star-picker">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          className={`star-btn ${s <= value ? 'filled' : ''}`}
          onClick={() => onChange && onChange(s)}
          aria-label={`Rate ${s} star${s > 1 ? 's' : ''}`}
          disabled={!onChange}
        >
          <Star size={size} fill={s <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
}
