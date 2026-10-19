# OAUMods feedback form setup

The student feedback page is available at `/feedback`. A floating **Feedback** shortcut links to it across the app.

## Formspree configuration

The form submits directly from the browser to Formspree. By default it uses the current endpoint ID in `src/app/feedback/page.tsx`. To configure a different Formspree form, set this **public form endpoint** before building/deploying:

```env
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

Set it in the `oaumods` app's local environment (for local testing) or the deployment project's environment settings, then rebuild/redeploy. The value is sent to the browser, so it must contain only the public Formspree form endpoint—not a password, private API key, or other secret. If unset, the existing endpoint is used.

1. Confirm the endpoint belongs to the OAUMods project in Formspree.
2. Confirm the Formspree form is active and its destination email is verified.
3. Submit a test from the deployed `/feedback` page.
4. Check Formspree's submissions dashboard and destination inbox, including spam.
5. Simulate a failed request and confirm the page shows an error instead of a success message.

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
5. Confirm a filled honeypot never displays the success message.
6. Confirm network failures show an error and allow retrying.
7. Confirm the floating shortcut opens the page and is hidden on the feedback page itself.
