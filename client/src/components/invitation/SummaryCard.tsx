import { useQuery } from '@tanstack/react-query';

import { getDateOptions } from '../../api/date-options';

interface SummaryCardProps {
  creatorName: string;

  dateType: string;

  cuisineIds: number[];

  date: string;

  time: string;

  isSubmitting: boolean;

  error?: string;

  onConfirm: () => void;
}

function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  ).format(
    new Date(
      `${value}T00:00:00`,
    ),
  );
}

function formatTime(
  value: string,
) {
  const [hours, minutes] =
    value.split(':');

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
  );

  return new Intl.DateTimeFormat(
    undefined,
    {
      hour: 'numeric',
      minute: '2-digit',
    },
  ).format(date);
}

function formatDateType(
  value: string,
) {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

export default function SummaryCard({
  creatorName,
  dateType,
  cuisineIds,
  date,
  time,
  isSubmitting,
  error,
  onConfirm,
}: SummaryCardProps) {
  const optionsQuery =
    useQuery({
      queryKey: [
        'date-options',
      ],

      queryFn:
        getDateOptions,

      staleTime: Infinity,
    });

  const cuisines =
    optionsQuery.data?.data.cuisines.filter(
      cuisine =>
        cuisineIds.includes(
          cuisine.id,
        ),
    ) ?? [];

  return (
    <section className="rounded-[2rem] border border-rose-100 bg-white p-5 shadow-xl sm:p-7">
      <div className="text-center">
        <div
          className="text-5xl"
          aria-hidden="true"
        >
          👀
        </div>

        <p className="mt-3 text-sm font-semibold text-rose-500">
          One last check
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Does this look right?
        </h1>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3">
          <span className="text-sm text-slate-500">
            With
          </span>

          <strong className="text-sm text-slate-900">
            {creatorName} ❤️
          </strong>
        </div>

        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3">
          <span className="text-sm text-slate-500">
            Date
          </span>

          <strong className="text-sm text-slate-900">
            {formatDateType(
              dateType,
            )}
          </strong>
        </div>

        {cuisines.length >
          0 && (
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 py-3">
            <span className="text-sm text-slate-500">
              Food
            </span>

            <strong className="text-right text-sm text-slate-900">
              {cuisines
                .map(
                  cuisine =>
                    `${cuisine.emoji ?? ''} ${cuisine.name}`,
                )
                .join(', ')}
            </strong>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3">
          <span className="text-sm text-slate-500">
            Day
          </span>

          <strong className="text-right text-sm text-slate-900">
            {formatDate(date)}
          </strong>
        </div>

        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <span className="text-sm text-slate-500">
            Time
          </span>

          <strong className="text-sm text-slate-900">
            {formatTime(time)}
          </strong>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-center">
        <p className="text-sm text-rose-700">
          Once you confirm, we're calling this officially a date. No pressure. 😌
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <button
        type="button"
        disabled={
          isSubmitting
        }
        onClick={onConfirm}
        className="mt-5 w-full rounded-2xl bg-rose-500 px-5 py-4 font-bold text-white transition hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting
          ? 'Making it official...'
          : "It's a date 💘"}
      </button>
    </section>
  );
}