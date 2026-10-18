import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_MESSAGE_LENGTH = 2000;
const MAX_CONTEXT_LENGTH = 120;
const ALLOWED_CATEGORIES = new Set([
  'General feedback',
  'Report a problem',
  'Suggest a feature',
  'Incorrect campus information',
]);

function manualIssueUrl(title: string, body: string) {
  const repo = process.env.OAUMODS_FEEDBACK_REPO || 'Alqaasimee-jr2/OAUMods';
  return `https://github.com/${repo}/issues/new?${new URLSearchParams({
    title,
    body,
  }).toString()}`;
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Please submit a valid feedback form.' }, { status: 400 });
  }

  // Honeypot field: quietly accept bot submissions without creating issues.
  if (typeof payload.website === 'string' && payload.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const category = typeof payload.category === 'string' ? payload.category : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  const pageOrPlace = typeof payload.pageOrPlace === 'string' ? payload.pageOrPlace.trim() : '';
  const rating = payload.rating === null || payload.rating === undefined ? null : Number(payload.rating);

  if (!ALLOWED_CATEGORIES.has(category)) {
    return NextResponse.json({ ok: false, error: 'Choose a valid feedback category.' }, { status: 400 });
  }
  if (message.length < 12 || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ ok: false, error: 'Feedback must be between 12 and 2,000 characters.' }, { status: 400 });
  }
  if (pageOrPlace.length > MAX_CONTEXT_LENGTH) {
    return NextResponse.json({ ok: false, error: 'The page or place name is too long.' }, { status: 400 });
  }
  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    return NextResponse.json({ ok: false, error: 'Choose a rating from 1 to 5.' }, { status: 400 });
  }

  const title = `[Feedback] ${category}`;
  const body = [
    '## Student feedback',
    '',
    `**Category:** ${category}`,
    `**Page or campus place:** ${pageOrPlace || 'Not specified'}`,
    `**Rating:** ${rating === null ? 'Not provided' : `${rating}/5`}`,
    '',
    '## Message',
    message,
    '',
    '---',
    '_Submitted through the OAUMods feedback form. No name or email was requested._',
  ].join('\n');

  const token = process.env.OAUMODS_FEEDBACK_GITHUB_TOKEN;
  const repo = process.env.OAUMODS_FEEDBACK_REPO || 'Alqaasimee-jr2/OAUMods';

  // The token must stay server-side. If not configured, offer a prefilled GitHub form.
  if (!token) {
    return NextResponse.json({ mode: 'manual', url: manualIssueUrl(title, body) });
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      // Do not expose GitHub's raw response or any secret/configuration details.
      return NextResponse.json({ mode: 'manual', url: manualIssueUrl(title, body) });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ mode: 'manual', url: manualIssueUrl(title, body) });
  }
}
