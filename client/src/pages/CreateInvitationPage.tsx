import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { createInvitation } from '../api/invitations';

export default function CreateInvitationPage() {
  const [creatorName, setCreatorName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const createMutation = useMutation({
    mutationFn: createInvitation,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    createMutation.mutate({
      creatorName: creatorName.trim(),
      recipientName: recipientName.trim(),
      message: message.trim() || undefined,
    });
  }

  async function handleCopyInvite() {
    if (!createMutation.data) {
      return;
    }

    const inviteUrl = new URL(
      createMutation.data.data.inviteUrl,
      window.location.origin,
    ).toString();

    await navigator.clipboard.writeText(inviteUrl);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  if (createMutation.isSuccess) {
    const inviteUrl = new URL(
      createMutation.data.data.inviteUrl,
      window.location.origin,
    ).toString();

    const manageUrl = new URL(
      createMutation.data.data.manageUrl,
      window.location.origin,
    ).toString();

    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 via-orange-50 to-white px-4 py-10">
        <section className="w-full max-w-lg rounded-[2rem] border border-rose-100 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 text-center">
            <div
              className="mb-4 text-5xl"
              aria-hidden="true"
            >
              💌
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Your DateDrop is ready!
            </h1>

            <p className="mt-2 text-slate-600">
              Now comes the brave part.
            </p>
          </div>

          <div className="rounded-2xl bg-rose-50 p-4">
            <p className="mb-2 text-sm font-semibold text-slate-700">
              Send this link
            </p>

            <p className="break-all text-sm text-slate-700">
              {inviteUrl}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyInvite}
            className="mt-4 w-full rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
          >
            {copied ? 'Copied! 💌' : 'Copy DateDrop Link'}
          </button>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <p className="text-sm font-semibold text-slate-900">
              Keep this link private
            </p>

            <p className="mt-1 text-sm text-slate-600">
              You'll use it later to see their response.
            </p>

            <p className="mt-3 break-all rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              {manageUrl}
            </p>
          </div>

          <button
            type="button"
            onClick={() => createMutation.reset()}
            className="mt-6 w-full rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
          >
            Create another DateDrop
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-orange-50 to-white px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-lg">
        <header className="mb-8 text-center">
          <div
            className="mb-4 text-5xl"
            aria-hidden="true"
          >
            💌
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            DateDrop
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Asking someone out shouldn't feel like filling out a form.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Create something a little more fun instead.
          </p>
        </header>

        <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-7">
            <p className="text-sm font-semibold text-rose-600">
              Step 1
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Who's the lucky person? 👀
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="creatorName"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Your name
              </label>

              <input
                id="creatorName"
                name="creatorName"
                type="text"
                required
                minLength={2}
                maxLength={50}
                autoComplete="name"
                value={creatorName}
                onChange={event =>
                  setCreatorName(event.target.value)
                }
                placeholder="Your name"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </div>

            <div>
              <label
                htmlFor="recipientName"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Their name
              </label>

              <input
                id="recipientName"
                name="recipientName"
                type="text"
                required
                minLength={2}
                maxLength={50}
                value={recipientName}
                onChange={event =>
                  setRecipientName(event.target.value)
                }
                placeholder="Who are we asking? 👀"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label
                  htmlFor="message"
                  className="text-sm font-semibold text-slate-700"
                >
                  Add a little message
                </label>

                <span className="text-xs text-slate-400">
                  {message.length}/300
                </span>
              </div>

              <textarea
                id="message"
                name="message"
                maxLength={300}
                rows={4}
                value={message}
                onChange={event =>
                  setMessage(event.target.value)
                }
                placeholder="I have a very important question for you..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </div>

            {createMutation.isError && (
              <div
                role="alert"
                className="rounded-2xl bg-red-50 p-4 text-sm text-red-700"
              >
                {createMutation.error instanceof Error
                  ? createMutation.error.message
                  : 'Something went wrong.'}
              </div>
            )}

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full rounded-2xl bg-slate-900 px-5 py-4 font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createMutation.isPending
                ? 'Preparing your DateDrop...'
                : 'Create DateDrop 💌'}
            </button>
          </form>
        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          No awkward conversations were harmed in the making of this invite.
        </p>
      </div>
    </main>
  );
}