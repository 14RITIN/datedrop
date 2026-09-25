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
  includeCuisine?: boolean;
  isComplete?: boolean;
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
    label: 'Review',
    emoji: '🎉',
  },
] as const;

export default function ProgressTimeline({
  currentStep,
  includeCuisine = true,
  isComplete = false,
}: ProgressTimelineProps) {
  const visibleSteps = steps.filter(step => includeCuisine || step.key !== 'cuisine');
  const currentIndex = visibleSteps.findIndex(
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
        {visibleSteps.map((step, index) => {
          const completed = isComplete || index < activeIndex;
          const active = !isComplete && index === activeIndex;

          return (
            <li
              key={step.key}
              aria-current={active ? "step" : undefined}
              className="relative flex flex-1 flex-col items-center text-center"
            >
              {index < visibleSteps.length - 1 && (
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
                aria-hidden="true"
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
                  completed
                    ? 'bg-rose-700 text-white'
                    : active
                      ? 'bg-rose-100 ring-2 ring-rose-400'
                      : 'bg-slate-100'
                }`}
              >
                {completed ? '✓' : step.emoji}
              </div>

              <span
                className={`sr-only sm:not-sr-only sm:mt-2 sm:text-[10px] sm:font-medium ${
                  active
                    ? 'text-rose-700'
                    : 'text-slate-600'
                }`}
              >
                {isComplete && step.key === 'summary' ? 'Done' : step.label}
                <span className="sr-only">{completed ? ", completed" : active ? ", current step" : ", upcoming"}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
