import { usePageHeadingFocus } from '../../hooks/usePageHeadingFocus';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getDateOptions } from '../../api/date-options';

interface CuisineCardProps {
  initialSelection?: number[];
  onContinue: (cuisineIds: number[]) => void;
}

const MAX_CUISINES = 3;

export default function CuisineCard({
  initialSelection = [],
  onContinue,
}: CuisineCardProps) {
  const [selectedCuisineIds, setSelectedCuisineIds] =
    useState<number[]>(initialSelection);

  const optionsQuery = useQuery({
    queryKey: ['date-options'],
    queryFn: getDateOptions,

    // Reference data doesn't need constant refetching.
    staleTime: Infinity,
  });

  usePageHeadingFocus(optionsQuery.status);

  function toggleCuisine(cuisineId: number) {
    setSelectedCuisineIds(current => {
      if (current.includes(cuisineId)) {
        return current.filter(id => id !== cuisineId);
      }

      if (current.length >= MAX_CUISINES) {
        return current;
      }

      return [...current, cuisineId];
    });
  }

  if (optionsQuery.isPending) {
    return (
      <section className="rounded-[2rem] bg-white p-8 text-center shadow-xl">
        <div
          className="text-5xl"
          aria-hidden="true"
        >
          🍜
        </div>

        <p role="status" className="mt-4 text-slate-600">
          Checking what's on the menu...
        </p>
      </section>
    );
  }

  if (optionsQuery.isError) {
    return (
      <section className="rounded-[2rem] bg-white p-8 text-center shadow-xl">
        <div
          className="text-5xl"
          aria-hidden="true"
        >
          😵‍💫
        </div>

        <h1 tabIndex={-1} className="mt-4 text-2xl font-bold text-slate-900">
          The menu disappeared.
        </h1>

        <p role="alert" className="mt-3 text-slate-600">
          {optionsQuery.error instanceof Error
            ? optionsQuery.error.message
            : 'Unable to load cuisines.'}
        </p>
      </section>
    );
  }

  const cuisines =
    optionsQuery.data.data.cuisines;

  return (
    <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-xl sm:p-8">
      <div className="text-center">
        <div
          className="text-5xl"
          aria-hidden="true"
        >
          🍜
        </div>

        <p className="mt-4 text-sm font-semibold text-rose-700">
          Very important question
        </p>

        <h1 tabIndex={-1} className="mt-2 text-3xl font-bold text-slate-900">
          What are we eating?
        </h1>

        <p className="mt-3 text-slate-600">
          Pick 1–{MAX_CUISINES} cuisines. Deselect one to change your choices when the limit is reached.
        </p>
      </div>

  <div className="mt-6 grid grid-cols-2 gap-2">
  {cuisines.map(cuisine => {
    const selected =
      selectedCuisineIds.includes(cuisine.id);

    const disabled =
      !selected &&
      selectedCuisineIds.length >= MAX_CUISINES;

    return (
      <button
        key={cuisine.id}
        type="button"
        aria-pressed={selected}
        disabled={disabled}
        onClick={() => toggleCuisine(cuisine.id)}
        className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-700 disabled:cursor-not-allowed disabled:opacity-60 ${
          selected
            ? 'border-rose-700 bg-rose-50'
            : 'border-slate-500 bg-white hover:border-rose-300'
        }`}
      >
        <span
          className="text-xl"
          aria-hidden="true"
        >
          {cuisine.emoji ?? '🍴'}
        </span>

        <span className="flex-1 text-sm font-semibold text-slate-800">
          {cuisine.name}
        </span>

        {selected && (
          <span
            className="text-rose-700"
            aria-hidden="true"
          >
            ✓
          </span>
        )}
      </button>
    );
  })}
</div>

      <div role="status" className="mt-6 flex items-center justify-between text-sm">
        <span className="text-slate-600">
          {selectedCuisineIds.length}/{MAX_CUISINES}{' '}
          selected
        </span>

        {selectedCuisineIds.length === MAX_CUISINES && (
          <span className="text-rose-700">
            That's enough food <span aria-hidden="true">😂</span>
          </span>
        )}
      </div>

      <button
        type="button"
        disabled={selectedCuisineIds.length === 0}
        onClick={() =>
          onContinue(selectedCuisineIds)
        }
        className="mt-6 w-full rounded-2xl bg-slate-900 px-5 py-4 font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Looks delicious <span aria-hidden="true">😋</span>
      </button>
    </section>
  );
}