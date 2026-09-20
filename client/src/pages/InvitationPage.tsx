import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getInvitation } from '../api/invitations';

export default function InvitationPage() {
  const { token } = useParams<{
    token: string;
  }>();

  const invitationQuery = useQuery({
    queryKey: ['invitation', token],

    queryFn: () => getInvitation(token!),

    enabled: Boolean(token),

    retry: false,
  });

  if (invitationQuery.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 via-orange-50 to-white px-4">
        <div className="text-center">
          <div
            className="mb-4 text-5xl"
            aria-hidden="true"
          >
            💌
          </div>

          <p className="font-medium text-slate-600">
            Opening your DateDrop...
          </p>
        </div>
      </main>
    );
  }

  if (invitationQuery.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 via-orange-50 to-white px-4">
        <section className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-xl">
          <div
            className="mb-4 text-5xl"
            aria-hidden="true"
          >
            💔
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Cupid lost this one.
          </h1>

          <p className="mt-3 text-slate-600">
            {invitationQuery.error instanceof Error
              ? invitationQuery.error.message
              : 'This DateDrop could not be found.'}
          </p>
        </section>
      </main>
    );
  }

  const invitation =
    invitationQuery.data.data;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 via-orange-50 to-white px-4 py-10">
      <section className="w-full max-w-lg rounded-[2rem] border border-rose-100 bg-white p-6 text-center shadow-xl sm:p-10">
        <div
          className="mb-6 text-6xl"
          aria-hidden="true"
        >
          💌
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
          You got a DateDrop
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Hey {invitation.recipientName} 👀
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          {invitation.creatorName} has something
          important to ask you.
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
          className="mt-8 w-full rounded-2xl bg-slate-900 px-5 py-4 font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
        >
          Okay... show me 👀
        </button>

        <p className="mt-5 text-xs text-slate-400">
          No pressure. Probably.
        </p>
      </section>
    </main>
  );
}