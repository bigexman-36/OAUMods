# OAUMods feedback form setup

The student feedback page is available at `/feedback`. A floating **Feedback** shortcut links to it across the app.

## Formspree configuration

The form submits directly from the browser to the Formspree endpoint configured in `src/app/feedback/page.tsx`.

1. Confirm that the endpoint belongs to the OAUMods project in Formspree.
2. Confirm the Formspree form is active and its destination email is verified.
3. Submit a test from the deployed `/feedback` page.
4. Check Formspree's submissions dashboard and destination inbox, including spam.
5. Test a failed request and confirm the page shows an error instead of a success message.

No GitHub token, GitHub issue integration, or server-side environment variable is used by this implementation. Do not add secrets to client-side code.

## What the form collects

- Feedback category
- Message (12–2,000 characters)
- Optional page or campus place
- Optional 1–5 rating

The form does not ask for a name or email. A hidden honeypot field discourages basic automated spam. Do not ask students to include passwords or sensitive personal information.

## Smoke-test checklist

1. Visit `/feedback` on a phone-sized viewport.
2. Confirm category cards and star rating work with touch and keyboard.
3. Submit a message shorter than 12 characters; it should be blocked.
4. Submit a valid test message and confirm it appears in Formspree.
5. Confirm network failures show an error and allow retrying.
6. Confirm the floating shortcut opens the page and is hidden on the feedback page itself.
