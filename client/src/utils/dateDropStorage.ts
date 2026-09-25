export interface SavedDateDrop {
  id: number;
  recipientName: string;
  inviteUrl: string;
  manageUrl: string;
}

const STORAGE_KEY = 'datedrop:created-invitations:v1';

function isSavedDateDrop(value: unknown): value is SavedDateDrop {
  if (!value || typeof value !== 'object') return false;

  const entry = value as Record<string, unknown>;
  return (
    Number.isInteger(entry.id) &&
    typeof entry.recipientName === 'string' &&
    typeof entry.inviteUrl === 'string' &&
    /^\/invite\/[A-Za-z0-9_-]+$/.test(entry.inviteUrl) &&
    typeof entry.manageUrl === 'string' &&
    /^\/manage\/[A-Za-z0-9_-]+$/.test(entry.manageUrl)
  );
}

export function loadDateDrops(): SavedDateDrop[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(value) ? value.filter(isSavedDateDrop) : [];
  } catch {
    return [];
  }
}

export function saveDateDrop(invitation: SavedDateDrop): boolean {
  try {
    const invitations = loadDateDrops().filter(
      saved => saved.manageUrl !== invitation.manageUrl,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify([invitation, ...invitations]));
    return true;
  } catch {
    return false;
  }
}
