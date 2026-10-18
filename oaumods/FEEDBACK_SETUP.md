# OAUMods feedback form setup

The feedback page is available at `/feedback`. A floating **Feedback** shortcut links to it across the app.

## Direct, no-account submission

To let students submit feedback without signing into GitHub, configure these environment variables on the deployment hosting OAUMods:

- `OAUMODS_FEEDBACK_GITHUB_TOKEN`: a fine-grained GitHub token with **Issues: Read and write** permission for the destination repository. Keep it server-side; never prefix it with `NEXT_PUBLIC_`.
- `OAUMODS_FEEDBACK_REPO`: destination in `owner/repository` format. Defaults to `Alqaasimee-jr2/OAUMods`.

The destination repository must have Issues enabled. Prefer a dedicated fine-grained token scoped only to that repository, rotate it periodically, and never commit it to source control.

## If the token is not configured

The form does not pretend the feedback was submitted. It creates a prefilled GitHub issue draft and asks the student to open it and finish submission. GitHub may require sign-in for that fallback.

## What the form collects

- Feedback category
- Message (12–2,000 characters)
- Optional page or campus place
- Optional 1–5 rating

The form does not ask for a name or email. A hidden honeypot field discourages basic automated spam. Do not ask students to include passwords or sensitive personal information.

## Smoke-test checklist

1. Visit `/feedback` on a phone-sized viewport.
2. Confirm the category cards and star rating can be selected with touch and keyboard.
3. Submit a message shorter than 12 characters; it should be blocked.
4. With the token configured, submit a test message and confirm one issue is created in the chosen repository.
5. Without the token, confirm the prefilled issue fallback appears and no success message is shown.
6. Confirm the floating shortcut opens the page and is hidden on the feedback page itself.
