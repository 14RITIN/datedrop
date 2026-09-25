import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getInvitation } from "../api/invitations";
import ProgressTimeline from "../components/invitation/ProgressTimeline";
import type { DateType } from "../components/invitation/DateTypeCard";
import DateTypeCard from "../components/invitation/DateTypeCard";
import CuisineCard from "../components/invitation/CuisineCard";
import ScheduleCard from "../components/invitation/ScheduleCard";

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
  const [selectedDateType, setSelectedDateType] = useState<DateType | null>(
    null,
  );

  const [ selectedCuisineIds, setSelectedCuisineIds] = useState<number[]>([]);
  const [
  selectedDate,
  setSelectedDate,
] = useState('');

const [
  selectedTime,
  setSelectedTime,
] = useState('');

  const invitationQuery = useQuery({
    queryKey: ["invitation", token],

    queryFn: () => getInvitation(token!),

    enabled: Boolean(token),

    retry: false,
  });

  if (invitationQuery.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 via-orange-50 to-white px-4">
        <div className="text-center">
          <div className="mb-4 text-5xl" aria-hidden="true">
            💌
          </div>

          <p className="font-medium text-slate-600">Opening your DateDrop...</p>
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

          <h1 className="text-2xl font-bold text-slate-900">
            Cupid lost this one.
          </h1>

          <p className="mt-3 text-slate-600">
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
    if (event.pointerType !== "mouse") {
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
    setStep("declined");
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
        <ProgressTimeline currentStep={step} />
        {step === "intro" && (
          <section className="rounded-[2rem] border border-rose-100 bg-white p-6 text-center shadow-xl sm:p-10">
            <div className="mb-6 text-6xl" aria-hidden="true">
              💌
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
              You got a DateDrop
            </p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Hey {invitation.recipientName} 👀
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
              className="mt-8 w-full rounded-2xl bg-slate-900 px-5 py-4 font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
            >
              Okay... show me 👀
            </button>

            <p className="mt-5 text-xs text-slate-400">
              No pressure. Probably.
            </p>
          </section>
        )}

        {step === "interest" && (
          <section className="rounded-[2rem] border border-rose-100 bg-white p-6 text-center shadow-xl sm:p-10">
            <div className="mb-6 text-6xl" aria-hidden="true">
              ❤️
            </div>

            <p className="text-sm font-semibold text-rose-500">
              Important question
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900">
              Would you like to go on a date with {invitation.creatorName}?
            </h1>

            <p className="mt-3 text-slate-500">
              Choose wisely. The database is watching. 👀
            </p>

            <div className="mt-8 space-y-4">
              <button
                type="button"
                onClick={() => setStep("dateType")}
                style={{
                  transform: `scale(${yesScale})`,
                }}
                className="w-full rounded-2xl bg-rose-500 px-5 py-4 text-lg font-bold text-white transition-transform duration-300 hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
              >
                Yes 😍
              </button>
              <div className="relative flex min-h-20 items-center justify-center">
                <div className="relative flex min-h-28 items-center justify-center">
                  <button
                    type="button"
                    onPointerEnter={handleNoHover}
                    onClick={() => {
                      if (noAttempts >= MAX_NO_ATTEMPTS) {
                        handleDecline();
                      }
                    }}
                    className={`rounded-2xl border border-slate-200 bg-white px-8 py-3 font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 ${
                      noAttempts > 0 && noAttempts <= MAX_NO_ATTEMPTS
                        ? noButtonPositions[noAttempts - 1]
                        : ""
                    }`}
                  >
                    No 🙈
                  </button>
                </div>
              </div>

              {noAttempts > 0 && (
                <p aria-live="polite" className="text-sm text-slate-500">
                  {noAttempts === 1 && "Nice try 😏"}

                  {noAttempts === 2 && "Why does that button keep running? 😂"}

                  {noAttempts === 3 &&
                    "Okay okay... you win. It will behave now 😇"}
                </p>
              )}
              <button
                type="button"
                onClick={handleDecline}
                className="text-sm text-slate-400 underline-offset-4 hover:text-slate-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                No thanks, seriously
              </button>
            </div>
          </section>
        )}

        {step === "declined" && (
          <section className="rounded-[2rem] border border-rose-100 bg-white p-6 text-center shadow-xl sm:p-10">
            <div className="mb-6 text-6xl" aria-hidden="true">
              🫡
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Mission respectfully aborted.
            </h1>

            <p className="mt-4 text-lg text-slate-600">
              No worries — maybe another adventure another day.
            </p>

            <p className="mt-6 text-sm text-slate-400">
              Cupid has been informed. He'll recover. Probably. 😂
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
{step === 'summary' && (
  <section className="rounded-[2rem] border border-rose-100 bg-white p-6 text-center shadow-xl">

    <div
      className="text-5xl"
      aria-hidden="true"
    >
      🎉
    </div>

    <h1 className="mt-3 text-3xl font-bold text-slate-900">
      Almost a DateDrop!
    </h1>

    <div className="mt-6 space-y-2 rounded-2xl bg-slate-50 p-5 text-left text-sm">

      <p>
        <strong>
          Date type:
        </strong>{' '}
        {selectedDateType}
      </p>

      {selectedCuisineIds.length >
        0 && (
        <p>
          <strong>
            Cuisine IDs:
          </strong>{' '}
          {selectedCuisineIds.join(
            ', ',
          )}
        </p>
      )}

      <p>
        <strong>Date:</strong>{' '}
        {selectedDate}
      </p>

      <p>
        <strong>Time:</strong>{' '}
        {selectedTime}
      </p>

    </div>

    <p className="mt-5 text-sm text-slate-400">
      Proper summary is next.
    </p>

  </section>
)}
      </div>
    </main>
  );
}
