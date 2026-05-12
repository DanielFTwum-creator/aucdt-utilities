# Security Specification - TUC Blueprint OS

## Data Invariants
1. A project must have a valid `ownerId` matching the authenticated user's UID.
2. A user profile's `isAdmin` field cannot be modified by the user themselves.
3. Audit logs are append-only for standard operations (no updates/deletes).
4. Project names and IDs must be strings of reasonable size.
5. `updatedAt` and `createdAt` must use server timestamps.

## The "Dirty Dozen" Payloads (Target: DENY)

### 1. Identity Spoofing (Project Creation)
Payload: `{ id: "p1", ownerId: "attacker_uid", name: "Stolen Project" }`
Auth: `uid: "victim_uid"`

### 2. Privilege Escalation (User Update)
Payload: `{ isAdmin: true }`
Operation: `update` on `/users/victim_uid`

### 3. Cross-User Data Access (Project Get)
Operation: `get` on `/projects/victim_a_project`
Auth: `uid: "attacker_uid"`

### 4. Shadow Field Injection (Project Update)
Payload: `{ name: "New Name", hiddenRole: "hacker" }`
Operation: `update` on owned project.

### 5. ID Poisoning (Project Creation)
Path: `/projects/VERY_LONG_ID_OR_MALICIOUS_CHARS_!!!"`
Operation: `create`

### 6. Relational Sync Bypass (Project Update)
Payload: `{ ownerId: "new_owner_uid" }`
Operation: `update`

### 7. Denial of Wallet - Resource Exhaustion (String Size)
Payload: `{ name: "A".repeat(1000000) }`

### 8. Denial of Wallet - List Exhaustion
Payload: `{ checkedItems: { ...10000 items } }`

### 9. Temporal Poisoning (Client Timestamp)
Payload: `{ updatedAt: 123456789 }` (client provided instead of serverTime)

### 10. Audit Log Manipulation (Malicious Actor)
Operation: `update` or `delete` on an existing log entry.

### 11. Unverified Access (Sensitive Data)
Auth: `email_verified: false`
Operation: `any write`

### 12. PII Blanket Read
Operation: `list` on `/users`
Auth: `uid: "regular_user_uid"`

## Test Runner
See `firestore.rules.test.ts`.
