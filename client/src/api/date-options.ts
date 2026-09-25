import type { DateOptionsResponse } from '../types/invitation';

export async function getDateOptions(): Promise<DateOptionsResponse> {
  const response = await fetch('/api/date-options');

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      body?.error?.message ??
        'Unable to load date options',
    );
  }

  return body;
}