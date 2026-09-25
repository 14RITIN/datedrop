import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getCreatorInvitation } from '../api/invitations';

function formatDate(
  value: string,
): string {
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
): string {
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
): string {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

export default function CreatorResultPage() {
  const { token } = useParams<{
    token: string;
  }>();

  const resultQuery =
    useQuery({
      queryKey: [
        'creator-invitation',
        token,
      ],

      queryFn: () =>
        getCreatorInvitation(
          token!,
        ),

      enabled:
        Boolean(token),

      retry: false,
    });

  if (resultQuery.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 via-orange-50 to-white px-4">
        <div className="text-center">
          <div className="text-5xl">
            💌
          </div>

          <p className="mt-4 text-slate-500">
            Checking your DateDrop...
          </p>
        </div>
      </main>
    );
  }

  if (resultQuery.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 via-orange-50 to-white px-4">
        <section className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-xl">
          <div className="text-5xl">
            💔
          </div>

          <h1 className="mt-4 text-2xl font-bold">
            DateDrop not found
          </h1>

          <p className="mt-3 text-slate-500">
            {resultQuery.error instanceof Error
              ? resultQuery.error.message
              : 'Unable to load this DateDrop.'}
          </p>
        </section>
      </main>
    );
  }

  const invitation =
    resultQuery.data.data;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 via-orange-50 to-white px-4 py-10">
      <section className="w-full max-w-lg rounded-[2rem] border border-rose-100 bg-white p-6 shadow-xl sm:p-8">

        {invitation.status ===
          'PENDING' && (
          <div className="text-center">
            <div className="text-6xl">
              👀
            </div>

            <h1 className="mt-4 text-3xl font-bold text-slate-900">
              Still waiting...
            </h1>

            <p className="mt-3 text-slate-600">
              {invitation.recipientName}{' '}
              hasn't answered your
              DateDrop yet.
            </p>

            <div className="mt-6 rounded-2xl bg-rose-50 p-4">
              <p className="text-sm text-rose-700">
                Don't refresh every
                10 seconds.
              </p>

              <p className="mt-1 text-xs text-slate-500">
                We know you're going to. 😂
              </p>
            </div>
          </div>
        )}

        {invitation.status ===
          'DECLINED' && (
          <div className="text-center">
            <div className="text-6xl">
              🫡
            </div>

            <h1 className="mt-4 text-3xl font-bold text-slate-900">
              Mission respectfully
              aborted.
            </h1>

            <p className="mt-3 text-slate-600">
              {invitation.recipientName}{' '}
              passed on this one.
            </p>

            <p className="mt-6 text-sm text-slate-400">
              Cupid has filed the
              paperwork. 😂
            </p>
          </div>
        )}

        {invitation.status ===
          'COMPLETED' &&
          invitation.response && (
            <div>
              <div className="text-center">
                <div className="text-6xl">
                  🎉
                </div>

                <p className="mt-3 text-sm font-semibold text-rose-500">
                  IT'S OFFICIAL
                </p>

                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                  {invitation.recipientName}{' '}
                  said yes! ❤️
                </h1>
              </div>

              <div className="mt-7 overflow-hidden rounded-2xl border border-slate-100">

                {invitation.response
                  .dateType && (
                  <div className="flex justify-between border-b border-slate-100 px-4 py-3">
                    <span className="text-sm text-slate-500">
                      Date
                    </span>

                    <strong className="text-sm">
                      {formatDateType(
                        invitation.response
                          .dateType,
                      )}
                    </strong>
                  </div>
                )}

                {invitation.response
                  .cuisines.length >
                  0 && (
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 py-3">
                    <span className="text-sm text-slate-500">
                      Food
                    </span>

                    <strong className="text-right text-sm">
                      {invitation.response.cuisines
                        .map(
                          cuisine =>
                            `${cuisine.emoji ?? ''} ${cuisine.name}`,
                        )
                        .join(', ')}
                    </strong>
                  </div>
                )}

                {invitation.response
                  .date && (
                  <div className="flex justify-between gap-4 border-b border-slate-100 px-4 py-3">
                    <span className="text-sm text-slate-500">
                      Day
                    </span>

                    <strong className="text-right text-sm">
                      {formatDate(
                        invitation.response
                          .date,
                      )}
                    </strong>
                  </div>
                )}

                {invitation.response
                  .time && (
                  <div className="flex justify-between px-4 py-3">
                    <span className="text-sm text-slate-500">
                      Time
                    </span>

                    <strong className="text-sm">
                      {formatTime(
                        invitation.response
                          .time,
                      )}
                    </strong>
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-2xl bg-rose-50 p-4 text-center">
                <p className="font-medium text-rose-700">
                  Calendar blocked.
                  Excuses disabled. 😎
                </p>
              </div>
            </div>
          )}

      </section>
    </main>
  );
}