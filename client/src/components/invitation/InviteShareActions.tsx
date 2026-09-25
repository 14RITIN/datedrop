import { useEffect, useRef, useState } from 'react';

interface InviteShareActionsProps {
  inviteUrl: string;
  compact?: boolean;
}

export default function InviteShareActions({ inviteUrl, compact = false }: InviteShareActionsProps) {
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function handleAction(share: boolean) {
    clearTimeout(timer.current);
    setFeedback('');
    setError('');
    setPending(true);
    let nativeShare = false;

    try {
      const url = new URL(inviteUrl, window.location.origin);
      // Only public invitation paths may leave the app through these actions.
      if (url.origin !== window.location.origin || !/^\/invite\/[A-Za-z0-9_-]+$/.test(url.pathname) || url.search || url.hash) {
        throw new Error('Invalid public invitation URL');
      }

      nativeShare = share && typeof navigator.share === 'function';
      if (nativeShare) {
        await navigator.share({
          title: 'You got a DateDrop 💌',
          text: 'Someone has something to ask you 👀',
          url: url.toString(),
        });
      } else {
        await navigator.clipboard.writeText(url.toString());
        setFeedback('Copied! 💌');
        timer.current = setTimeout(() => setFeedback(''), 2000);
      }
    } catch (cause) {
      if (!(nativeShare && cause instanceof Error && cause.name === 'AbortError')) {
        setError(nativeShare
          ? 'Unable to share your DateDrop. Try Copy Invite Link instead.'
          : 'Unable to copy your invite link. Please try again.');
      }
    } finally {
      setPending(false);
    }
  }

  const focus = 'transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <div className={compact ? '' : 'mt-4'}>
      <div className={compact ? 'flex flex-wrap gap-2' : 'space-y-2'}>
        <button
          type="button"
          disabled={pending}
          onClick={() => void handleAction(true)}
          className={`${focus} ${compact
            ? 'rounded-xl bg-rose-50 px-3 py-2 font-semibold text-rose-600 hover:bg-rose-100'
            : 'w-full rounded-2xl bg-rose-500 px-5 py-3 font-semibold text-white hover:bg-rose-600'}`}
        >
          {compact ? 'Share 💌' : 'Share DateDrop 💌'}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => void handleAction(false)}
          className={`${focus} ${compact
            ? 'rounded-xl px-3 py-2 font-semibold text-rose-600 hover:bg-rose-50'
            : 'w-full rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50'}`}
        >
          {compact ? 'Copy Invite' : 'Copy Invite Link'}
        </button>
      </div>
      <p role="status" aria-live="polite" className="text-sm text-slate-500">{feedback}</p>
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
