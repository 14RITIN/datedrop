import { useMemo, useState } from 'react';

interface ScheduleCardProps {
  initialDate?: string;
  initialTime?: string;
  onContinue: (
    date: string,
    time: string,
  ) => void;
}

interface QuickDate {
  label: string;
  value: string;
}

const quickTimes = [
  {
    label: '6:00 PM',
    value: '18:00',
  },
  {
    label: '7:00 PM',
    value: '19:00',
  },
  {
    label: '8:00 PM',
    value: '20:00',
  },
  {
    label: '9:00 PM',
    value: '21:00',
  },
];

function toDateInputValue(
  date: Date,
): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0');

  const day = String(
    date.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function addDays(
  date: Date,
  days: number,
): Date {
  const result = new Date(date);

  result.setDate(
    result.getDate() + days,
  );

  return result;
}

function getNextDayOfWeek(
  targetDay: number,
): Date {
  const today = new Date();

  const daysUntil =
    (targetDay - today.getDay() + 7) %
      7 || 7;

  return addDays(
    today,
    daysUntil,
  );
}

function formatDate(
  value: string,
): string {
  if (!value) {
    return '';
  }

  const date = new Date(
    `${value}T00:00:00`,
  );

  return new Intl.DateTimeFormat(
    undefined,
    {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    },
  ).format(date);
}

function formatTime(
  value: string,
): string {
  if (!value) {
    return '';
  }

  const [hours, minutes] =
    value.split(':');

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
  );

  return new Intl.DateTimeFormat(
    undefined,
    {
      hour: 'numeric',
      minute: '2-digit',
    },
  ).format(date);
}

export default function ScheduleCard({
  initialDate = '',
  initialTime = '',
  onContinue,
}: ScheduleCardProps) {
  const [
    selectedDate,
    setSelectedDate,
  ] = useState(initialDate);

  const [
    selectedTime,
    setSelectedTime,
  ] = useState(initialTime);

  const minDate = useMemo(
    () =>
      toDateInputValue(new Date()),
    [],
  );

  const quickDates =
    useMemo<QuickDate[]>(() => {
      const tomorrow =
        addDays(new Date(), 1);

      const options = [
        {
          label: 'Tomorrow',
          value:
            toDateInputValue(
              tomorrow,
            ),
        },
        {
          label: 'Saturday',
          value:
            toDateInputValue(
              getNextDayOfWeek(6),
            ),
        },
        {
          label: 'Sunday',
          value:
            toDateInputValue(
              getNextDayOfWeek(0),
            ),
        },
      ];

      // Remove duplicate dates.
      return options.filter(
        (option, index) =>
          options.findIndex(
            item =>
              item.value ===
              option.value,
          ) === index,
      );
    }, []);

  const canContinue =
    Boolean(selectedDate) && selectedDate >= minDate &&
    Boolean(selectedTime);

  return (
    <section className="rounded-[2rem] border border-rose-100 bg-white p-5 shadow-xl sm:p-7">

      {/* HEADER */}

      <div className="text-center">
        <div
          className="text-4xl"
          aria-hidden="true"
        >
          📅
        </div>

        <h1 tabIndex={-1} className="mt-2 text-2xl font-bold text-slate-900">
          When should this happen?
        </h1>

        <p id="schedule-help" className="mt-1 text-sm text-slate-600">
          Choose today or a future date and a time to continue.
        </p>
      </div>

      {/* DATE */}

      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-slate-700">
          Pick a day
        </p>

        <div className="grid grid-cols-3 gap-2">
          {quickDates.map(option => {
            const selected =
              selectedDate ===
              option.value;

            return (
              <button
                key={option.value}
                aria-label={`${option.label}, ${formatDate(option.value)}`}
                type="button"
                aria-pressed={
                  selected
                }
                onClick={() =>
                  setSelectedDate(
                    option.value,
                  )
                }
                className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-700 ${
                  selected
                    ? 'border-rose-700 bg-rose-50 text-rose-700'
                    : 'border-slate-500 text-slate-600 hover:border-rose-300'
                }`}
              >
                {selected && <span aria-hidden="true">✓ </span>}{option.label}
              </button>
            );
          })}
        </div>

        <div className="my-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-xs text-slate-600">
            or choose
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <label
          htmlFor="schedule-date"
          className="sr-only"
        >
          Choose date
        </label>

        <input
          id="schedule-date"
          type="date"
          required
          aria-invalid={Boolean(selectedDate) && selectedDate < minDate}
          aria-describedby={selectedDate && selectedDate < minDate ? 'schedule-help schedule-error' : 'schedule-help'}
          min={minDate}
          value={selectedDate}
          onChange={event =>
            setSelectedDate(
              event.target.value,
            )
          }
          className="w-full rounded-xl border border-slate-500 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-rose-700 focus:ring-4 focus:ring-rose-100"
        />
      </div>

      {selectedDate && selectedDate < minDate && (
        <p id="schedule-error" role="alert" className="mt-3 text-sm text-red-700">
          Choose today or a future date.
        </p>
      )}

      {/* TIME */}

      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-slate-700">
          Pick a time
        </p>

        <div className="grid grid-cols-2 gap-2">
          {quickTimes.map(
            option => {
              const selected =
                selectedTime ===
                option.value;

              return (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  aria-pressed={
                    selected
                  }
                  onClick={() =>
                    setSelectedTime(
                      option.value,
                    )
                  }
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-700 ${
                    selected
                      ? 'border-rose-700 bg-rose-50 text-rose-700'
                      : 'border-slate-500 text-slate-600 hover:border-rose-300'
                  }`}
                >
                  {selected && <span aria-hidden="true">✓ </span>}
                  {option.label}
                </button>
              );
            },
          )}
        </div>

        <div className="my-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-xs text-slate-600">
            or choose
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <label
          htmlFor="schedule-time"
          className="sr-only"
        >
          Choose time
        </label>

        <input
          id="schedule-time"
          type="time"
          required
          aria-describedby="schedule-help"
          value={selectedTime}
          onChange={event =>
            setSelectedTime(
              event.target.value,
            )
          }
          className="w-full rounded-xl border border-slate-500 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-rose-700 focus:ring-4 focus:ring-rose-100"
        />
      </div>

      {/* SELECTION SUMMARY */}

      {canContinue && (
        <div
          className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-center"
        >
          <p className="text-xs text-slate-600">
            Looks like we have a plan <span aria-hidden="true">👀</span>
          </p>

          <p className="mt-1 font-semibold text-rose-700">
            {formatDate(
              selectedDate,
            )}{' '}
            at{' '}
            {formatTime(
              selectedTime,
            )}
          </p>
        </div>
      )}

      <button
        type="button"
        disabled={!canContinue}
        onClick={() =>
          onContinue(
            selectedDate,
            selectedTime,
          )
        }
        className="mt-5 w-full rounded-2xl bg-slate-900 px-5 py-4 font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Review the plan →
      </button>
    </section>
  );
}
