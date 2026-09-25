import { usePageHeadingFocus } from '../hooks/usePageHeadingFocus';
import { useState } from "react";
import type { CSSProperties } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getInvitation, submitInvitationResponse } from "../api/invitations";
import ProgressTimeline from "../components/invitation/ProgressTimeline";
import type { DateType } from "../components/invitation/DateTypeCard";
import DateTypeCard from "../components/invitation/DateTypeCard";
import CuisineCard from "../components/invitation/CuisineCard";
import ScheduleCard from "../components/invitation/ScheduleCard";
import SummaryCard from "../components/invitation/SummaryCard";

type InvitationStep =
  | 'intro'
  | 'interest'
  | 'dateType'
  | 'cuisine'
  | 'schedule'
  | 'summary'
  | 'declined';

const MAX_NO_ATTEMPTS = 3;

const noButtonPositions = [
  "translate-x-24 -translate-y-6",
  "-translate-x-24 translate-y-5",
  "translate-x-20 translate-y-7",
];

export default function InvitationPage() {
  const { token } = useParams<{
    token: string;
  }>();

  const [step, setStep] = useState<InvitationStep>("intro");

  const [noAttempts, setNoAttempts] = useState(0);
  const [selectedDateType, setSelectedDateType] = useState<DateType | null>( null);

  const [ selectedCuisineIds, setSelectedCuisineIds] = useState<number[]>([]);
  const [ selectedDate, setSelectedDate ] = useState('');

const [ selectedTime, setSelectedTime ] = useState('');

  const invitationQuery = useQuery({
    queryKey: ["invitation", token],

    queryFn: () => getInvitation(token!),

    enabled: Boolean(token),

    retry: false,
  });

  const responseMutation =
  useMutation({
    mutationFn: (
      input:
        Parameters<
          typeof submitInvitationResponse
        >[1],
    ) =>
      submitInvitationResponse(
        token!,
        input,
      ),
  });

  usePageHeadingFocus(`${token}:${invitationQuery.status}:${step}:${responseMutation.isSuccess}`);

  if (invitationQuery.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 via-orange-50 to-white px-4">
        <div className="text-center">
          <div className="mb-4 text-5xl" aria-hidden="true">
            💌
          </div>

          <p role="status" className="font-medium text-slate-600">Opening your DateDrop...</p>
        </div>
      </main>
    );
  }

  if (invitationQuery.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 via-orange-50 to-white px-4">
        <section className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-xl">
          <div className="mb-4 text-5xl" aria-hidden="true">
            💔
          </div>

          <h1 tabIndex={-1} className="text-2xl font-bold text-slate-900">
            Cupid lost this one.
          </h1>

          <p role="alert" className="mt-3 text-slate-600">
            {invitationQuery.error instanceof Error
              ? invitationQuery.error.message
              : "This DateDrop could not be found."}
          </p>
        </section>
      </main>
    );
  }

  const invitation = invitationQuery.data.data;

  function handleNoHover(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches || event.currentTarget === document.activeElement) {
      return;
    }

    if (noAttempts >= MAX_NO_ATTEMPTS) {
      return;
    }

    setNoAttempts((current) => current + 1);
  }

  function handleCuisineContinue(
  cuisineIds: number[],
) {
  setSelectedCuisineIds(cuisineIds);
 setStep('schedule');
}

  function handleDateTypeSelect(dateType: DateType) {
    setSelectedDateType(dateType);

    const requiresCuisine = ["dinner", "lunch", "dessert"].includes(dateType);

    if (requiresCuisine) {
      setStep("cuisine");
      return;
    }

   setStep('schedule');
  }

function handleDecline() {
  responseMutation.mutate(
    {
      interested: false,
    },
    {
      onSuccess: () => {
        setStep(
          'declined',
        );
      },
    },
  );
}
function handleConfirmDate() {
  if (
    !selectedDateType
  ) {
    return;
  }

  responseMutation.mutate(
    {
      interested: true,

      dateType:
        selectedDateType,

      cuisineIds:
        selectedCuisineIds,

      date:
        selectedDate,

      time:
        selectedTime,
    },
  );
}
  function handleScheduleContinue(
  date: string,
  time: string,
) {
  setSelectedDate(date);
  setSelectedTime(time);

  setStep('summary');
}

  const yesScale = 1 + noAttempts * 0.12;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 via-orange-50 to-white px-4 py-10">
      <div className="w-full max-w-lg">
        <ProgressTimeline
          currentStep={step}
          includeCuisine={!selectedDateType || ['dinner', 'lunch', 'dessert'].includes(selectedDateType)}
          isComplete={step === 'summary' && responseMutation.isSuccess}
        />
        {step === "intro" && (
          <section className="rounded-[2rem] border border-rose-100 bg-white p-6 text-center shadow-xl sm:p-10">
            <div className="mb-6 text-6xl" aria-hidden="true">
              💌
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-700">
              You got a DateDrop
            </p>

            <h1 tabIndex={-1} className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Hey {invitation.recipientName} <span aria-hidden="true">👀</span>
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              {invitation.creatorName} has something important to ask you.
            </p>

            {invitation.personalMessage && (
              <blockquote className="mt-6 rounded-2xl bg-rose-50 p-5 text-left text-slate-700">
                &ldquo;
                {invitation.personalMessage}
                &rdquo;
              </blockquote>
            )}

            <button
              type="button"
              onClick={() => setStep("interest")}
              className="mt-8 w-full rounded-2xl bg-slate-900 px-5 py-4 font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-700"
            >
              Okay... show me <span aria-hidden="true">👀</span>
            </button>

            <p className="mt-5 text-xs text-slate-600">
              No pressure. Probably.
            </p>
          </section>
        )}

        {step === "interest" && (
          <section className="rounded-[2rem] border border-rose-100 bg-white p-6 text-center shadow-xl sm:p-10">
            <div className="mb-6 text-6xl" aria-hidden="true">
              ❤️
            </div>

            <p className="text-sm font-semibold text-rose-700">
              Important question
            </p>

            <h1 tabIndex={-1} className="mt-3 text-3xl font-bold leading-tight text-slate-900">
              Would you like to go on a date with {invitation.creatorName}?
            </h1>

            <p className="mt-3 text-slate-600">
              Choose wisely. The database is watching. <span aria-hidden="true">👀</span>
            </p>

            <div className="mt-8 space-y-4">
              <button
                type="button"
                disabled={responseMutation.isPending}
                onClick={() => setStep("dateType")}
                style={{
                  '--yes-scale': yesScale,
                } as CSSProperties}
                className="motion-safe:scale-[var(--yes-scale)] w-full rounded-2xl bg-rose-700 px-5 py-4 text-lg font-bold text-white transition-transform duration-300 hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-700"
              >
                Yes <span aria-hidden="true">😍</span>
              </button>
              <div className="relative flex min-h-20 items-center justify-center">
                <div className="relative flex min-h-28 items-center justify-center">
                  <button
                    type="button"
                    onPointerEnter={handleNoHover}
                    onClick={handleDecline}
                    disabled={responseMutation.isPending}
                    className={`motion-reduce:transform-none motion-reduce:translate-none rounded-2xl border border-slate-500 bg-white px-8 py-3 font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-700 ${
                      noAttempts > 0 && noAttempts <= MAX_NO_ATTEMPTS
                        ? noButtonPositions[noAttempts - 1]
                        : ""
                    }`}
                  >
                    No <span aria-hidden="true">🙈</span>
                  </button>
                </div>
              </div>

              {noAttempts > 0 && (
                <p aria-live="polite" className="text-sm text-slate-600">
                  {noAttempts === 1 && "Nice try 😏"}

                  {noAttempts === 2 && "Why does that button keep running? 😂"}

                  {noAttempts === 3 &&
                    "Okay okay... you win. It will behave now 😇"}
                </p>
              )}
              <button
                type="button"
                onClick={handleDecline}
                disabled={responseMutation.isPending}
                className="text-sm text-slate-600 underline-offset-4 hover:text-slate-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700"
              >
                No thanks, seriously
              </button>
            </div>
            <p role="status" className="mt-3 text-sm text-slate-600">
              {responseMutation.isPending ? 'Saving your response...' : ''}
            </p>
            {responseMutation.isError && (
              <p role="alert" className="mt-3 text-sm text-red-700">
                {responseMutation.error instanceof Error ? responseMutation.error.message : 'Unable to save your response. Please try again.'}
              </p>
            )}
          </section>
        )}

        {step === "declined" && (
          <section className="rounded-[2rem] border border-rose-100 bg-white p-6 text-center shadow-xl sm:p-10">
            <div className="mb-6 text-6xl" aria-hidden="true">
              🫡
            </div>

            <h1 tabIndex={-1} className="text-3xl font-bold text-slate-900">
              Mission respectfully aborted.
            </h1>

            <p className="mt-4 text-lg text-slate-600">
              No worries — maybe another adventure another day.
            </p>

            <p className="mt-6 text-sm text-slate-600">
              Cupid has been informed. He'll recover. Probably. <span aria-hidden="true">😂</span>
            </p>
          </section>
        )}
        {step === "dateType" && (
          <DateTypeCard onSelect={handleDateTypeSelect} />
        )}

{step === 'cuisine' && (
  <CuisineCard
    initialSelection={selectedCuisineIds}
    onContinue={handleCuisineContinue}
  />
)}

{step === 'schedule' && (
  <ScheduleCard
    initialDate={selectedDate}
    initialTime={selectedTime}
    onContinue={
      handleScheduleContinue
    }
  />
)}
{step === 'summary' &&
  selectedDateType && (
    <>
      {!responseMutation.isSuccess ? (
        <SummaryCard
          creatorName={
            invitation.creatorName
          }
          dateType={
            selectedDateType
          }
          cuisineIds={
            selectedCuisineIds
          }
          date={
            selectedDate
          }
          time={
            selectedTime
          }
          isSubmitting={
            responseMutation.isPending
          }
          error={
            responseMutation.isError
              ? responseMutation.error instanceof
                Error
                ? responseMutation.error.message
                : 'Something went wrong'
              : undefined
          }
          onConfirm={
            handleConfirmDate
          }
        />
      ) : (
        <section className="rounded-[2rem] border border-rose-100 bg-white p-7 text-center shadow-xl">
          <div
            className="text-6xl"
            aria-hidden="true"
          >
            🎉
          </div>

          <h1 tabIndex={-1} className="mt-4 text-3xl font-bold text-slate-900">
            It's a date!
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Congratulations. You have successfully scheduled awkward eye contact. <span aria-hidden="true">😂</span>
          </p>

          <div className="mt-6 rounded-2xl bg-rose-50 p-4">
            <p className="font-semibold text-rose-700">
              {selectedDate}
            </p>

            <p className="mt-1 text-sm text-slate-600">
              {selectedTime}
            </p>
          </div>

          <p className="mt-6 text-xs text-slate-600">
            Cupid's work here is done. <span aria-hidden="true">🫡</span>
          </p>
        </section>
      )}
    </>
  )}
      </div>
    </main>
  );
}
