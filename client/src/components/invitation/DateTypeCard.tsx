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
    <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-xl sm:p-8">
      <div className="text-center">
        <div
          className="mb-4 text-5xl"
          aria-hidden="true"
        >
          🎉
        </div>

        <p className="text-sm font-semibold text-rose-500">
          Excellent decision
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          What kind of date are we planning?
        </h1>

        <p className="mt-3 text-slate-500">
          Pick your adventure.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {dateTypes.map(dateType => (
          <button
            key={dateType.value}
            type="button"
            onClick={() =>
              onSelect(dateType.value)
            }
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
          >
            <span
              className="text-3xl"
              aria-hidden="true"
            >
              {dateType.emoji}
            </span>

            <h2 className="mt-3 font-bold text-slate-900">
              {dateType.title}
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              {dateType.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}