type InvitationStep =
  | 'intro'
  | 'interest'
  | 'dateType'
  | 'cuisine'
  | 'schedule'
  | 'summary'
  | 'declined';
interface ProgressTimelineProps {
  currentStep: InvitationStep;
}

const steps = [
  {
    key: 'intro',
    label: 'Intro',
    emoji: '💌',
  },
  {
    key: 'interest',
    label: 'Interested?',
    emoji: '❤️',
  },
  {
    key: 'dateType',
    label: 'Date',
    emoji: '🍽',
  },
  {
    key: 'cuisine',
    label: 'Food',
    emoji: '🍜',
  },
  {
    key: 'schedule',
    label: 'Schedule',
    emoji: '📅',
  },
  {
    key: 'summary',
    label: 'Done',
    emoji: '🎉',
  },
] as const;

export default function ProgressTimeline({
  currentStep,
}: ProgressTimelineProps) {
  const currentIndex = steps.findIndex(
    step => step.key === currentStep,
  );

  // Declined is an exit state, so keep the user
  // visually at the interest step.
  const activeIndex =
    currentStep === 'declined'
      ? 1
      : currentIndex;

  return (
    <nav
      aria-label="DateDrop progress"
      className="mb-8"
    >
      <ol className="flex items-start justify-between gap-1">
        {steps.map((step, index) => {
          const completed = index < activeIndex;
          const active = index === activeIndex;

          return (
            <li
              key={step.key}
              className="relative flex flex-1 flex-col items-center text-center"
            >
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className={`absolute left-1/2 top-4 h-0.5 w-full ${
                    index < activeIndex
                      ? 'bg-rose-400'
                      : 'bg-slate-200'
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
                  completed
                    ? 'bg-rose-500 text-white'
                    : active
                      ? 'bg-rose-100 ring-2 ring-rose-400'
                      : 'bg-slate-100'
                }`}
              >
                {completed ? '✓' : step.emoji}
              </div>

              <span
                className={`mt-2 hidden text-[10px] font-medium sm:block ${
                  active
                    ? 'text-rose-600'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}