export type DateType =
  | 'dinner'
  | 'lunch'
  | 'coffee'
  | 'dessert'
  | 'movie'
  | 'picnic'
  | 'surprise';

interface DateTypeCardProps {
  onSelect: (dateType: DateType) => void;
}

const dateTypes: {
  value: DateType;
  title: string;
  description: string;
  emoji: string;
}[] = [
  {
    value: 'dinner',
    title: 'Dinner',
    description:
      'Because important decisions should involve food.',
    emoji: '🍽️',
  },
  {
    value: 'lunch',
    title: 'Lunch',
    description:
      'Low pressure. High snack potential.',
    emoji: '🥗',
  },
  {
    value: 'coffee',
    title: 'Coffee',
    description:
      'Just coffee. Unless it becomes three hours.',
    emoji: '☕',
  },
  {
    value: 'dessert',
    title: 'Dessert',
    description:
      'Skip the serious stuff. Go straight to sugar.',
    emoji: '🍰',
  },
  {
    value: 'movie',
    title: 'Movie',
    description:
      'Minimal talking. Maximum popcorn.',
    emoji: '🎬',
  },
  {
    value: 'picnic',
    title: 'Picnic',
    description:
      'Cute in theory. Weather permitting.',
    emoji: '🧺',
  },
  {
    value: 'surprise',
    title: 'Surprise Me',
    description:
      'Dangerous confidence. We respect it.',
    emoji: '🎲',
  },
];

export default function DateTypeCard({
  onSelect,
}: DateTypeCardProps) {
  return (
<div className="mt-6 grid gap-2">
  {dateTypes.map(dateType => (
    <button
      key={dateType.value}
      type="button"
      onClick={() => onSelect(dateType.value)}
      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-left transition hover:border-rose-300 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
    >
      <span
        className="text-2xl"
        aria-hidden="true"
      >
        {dateType.emoji}
      </span>

      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-900">
          {dateType.title}
        </span>

        <span className="block truncate text-xs text-slate-400">
          {dateType.description}
        </span>
      </span>
    </button>
  ))}
</div>
  );
}