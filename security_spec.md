# Security Specification: Parco degli Oleandri Leads

This specification outlines the data invariants, threat model, and security rules for the Parco degli Oleandri Firestore database.

## 1. Data Invariants

- **Lead Creation**: Anyone (including unauthenticated visitors) can submit a lead. This is an explicit requirement for an effective real estate landing page.
- **Lead Structure**: A lead must contain a unique ID and conform strictly to the specified schema format.
- **Identity Integrity**: Unauthenticated creators cannot read or modify any existing leads, to prevent PII leakage.
- **Admin Access**: Only the certified broker (authenticated user with email `cittaincantatafestival@gmail.com`) is allowed to view, update, list, or delete lead submissions.
- **Temporal Validity**: Any lead creation must have a `createdAt` timestamp matching the server's request time.
- **State Limits**: A lead can only have the statuses `new`, `contacted`, or `archived`. Any change of status must be performed only by the broker.

## 2. Threat Model & The "Dirty Dozen" Vulnerability Payloads

We define 12 attack vectors representing "Dirty Dozen" payloads designed to compromise the landing page.

1. **Unauthenticated Read Campaign**: An attacker attempts to execute a list query on `/leads` to scrape names, emails, and phone numbers of prospective buyers.
2. **Anonymous Lead Tampering**: An attacker attempts to update an existing lead's status to `archived` or modify its details.
3. **Ghost Fields Injection**: An attacker submits a lead containing an unauthorized field `isAdmin: true` or `discountCode: "FREE"`.
4. **Invalid Field Type Abuse**: An fields format collision where `phone` is submitted as an integer `3331234567` instead of a validated phone string.
5. **Denial of Wallet ID Exhaustion**: An attacker attempts to create a document with an extremely large (1MB) string as the ID to bloat the database index costs.
6. **Spoofed Creation Timestamp**: An attacker submits a lead with a hardcoded future `createdAt` date to disrupt chronological querying.
7. **Email Hijack Attack**: An attacker logs in with an arbitrary email address and tries to query the entire `/leads` collection.
8. **E-mail Domain Spoofing**: An attacker tries to authenticate with an unverified email claiming to be `cittaincantatafestival@gmail.com` to bypass broker authorization checks.
9. **Invalid Status Transition**: An attacker tries to set a lead's status to an unsupported value (e.g., `deleted` or `sold`).
10. **Shadow Payload Size Inflation**: An attacker submits a standard lead but with a massive 500KB text string in the `message` field.
11. **Malicious Regex Bypassing**: Submit an ID with malicious special characters (shell scripts/javascript payload syntax) attempting to trigger parsers.
12. **Premature Deletion Attempt**: An unauthenticated or malicious contributor attempts to run a batch delete or single document `delete` request on any existing lead.

## 3. Test Runner Invariant Mapping

All 12 threat vectors must return `PERMISSION_DENIED` at the Firestore rules level.
- Read operations are strictly blocked by checking `request.auth.token.email == "cittaincantatafestival@gmail.com" && request.auth.token.email_verified == true`.
- Create operations are strictly validated against field keys, types, sizes, and structure schemas.
