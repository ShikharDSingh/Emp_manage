# Secure Employee Management System (LAB 5)

Beginner-friendly, class-based REST API built with Express 5, TypeScript, PostgreSQL, TypeORM, Zod, Argon2id and JWT. No frontend is required.

## Requirements and setup
- Node.js 20+ (prefer a currently supported LTS), npm, PostgreSQL.
- Create a database: `CREATE DATABASE employee_management;`
- Copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_ACCESS_SECRET` (32+ random characters), and other local values. Never commit `.env`.
- Install: `npm install`
- Apply schema: `npm run migration:run`
- Seed development roles, permissions, Engineering department and a demo admin: PowerShell `$env:SEED_PASSWORD='Use-A-Long-Dev-Password-123'; npm run seed`; macOS/Linux `SEED_PASSWORD='Use-A-Long-Dev-Password-123' npm run seed`. Seed refuses production mode.
- Start: `npm run dev`; health check: `GET http://localhost:3000/health`.
- Compile: `npm run build`; production: `npm start`; tests: `npm test`.

## Architecture
`Route -> Middleware -> Controller -> Service -> Repository -> PostgreSQL`.
Controllers and services are classes. `ApiResponse` standardises success responses; `AppError` and the final error middleware standardise failures. `env.ts` validates configuration at startup. `synchronize` is disabled; all schema changes belong in migrations.

## Modules / endpoints
### Auth
- `POST /api/v1/auth/login` `{ "email": "admin@example.test", "password": "..." }`
- `POST /api/v1/auth/refresh` `{ "refreshToken": "..." }`
- `POST /api/v1/auth/logout` (Bearer access token + refreshToken body)
- `POST /api/v1/auth/logout-all` (Bearer token)
- `GET /api/v1/auth/sessions` (Bearer token)
- `DELETE /api/v1/auth/sessions/:id` (Bearer token)
- `POST /api/v1/auth/change-password` `{ "currentPassword": "...", "newPassword": "..." }`

### Employees (Bearer access token required)
- `POST /api/v1/employees` — admin/HR create employee. Required fields: firstName, lastName, workEmail, departmentId, jobTitle, joiningDate. Optional phone, managerId, employmentStatus, salary.
- `GET /api/v1/employees?page=1&limit=20&departmentId=<uuid>&employmentStatus=active&search=ann&sortBy=createdAt&sortOrder=DESC` — paginated directory. Limit max 100, sort fields are allowlisted.
- `GET /api/v1/employees/:id` — resource-level access checks.
- `PATCH /api/v1/employees/:id` — admin/HR or direct manager; writable fields are validated.
- `DELETE /api/v1/employees/:id` — soft deactivation and linked account/session revocation.
- `GET /api/v1/employees/me`, `PATCH /api/v1/employees/me` — own profile; only firstName, lastName, phone, jobTitle are writable.
- `GET /api/v1/employees/me/export` — own profile as structured JSON.

### Departments (Bearer token required)
- `GET /api/v1/departments`
- `POST /api/v1/departments` — admin/HR
- `PATCH /api/v1/departments/:id` — admin/HR

Every JSON response includes `success`, `message`, `data` (or error fields), and `requestId`; request IDs are also returned in `X-Request-Id`.

## Roles and access matrix
| Capability | Admin | HR | Manager | Employee |
|---|---:|---:|---:|---:|
| List directory | All | All | Direct reports | Own record |
| Create/update employee | Yes | Yes | Direct-report limited update | Own permitted profile fields |
| Change department/job/manager/status | Yes | Approved fields | No department or manager reassignment should be granted in production policy | No |
| Deactivate account | Yes | Yes (assignment permits employee record deactivation) | No | No |
| Manage departments | Yes | Yes | No | No |
| Assign roles | Intended admin-only | No | No | No |
| Revoke sessions | Own sessions; admin operations should be restricted to admin | Own sessions | Own sessions | Own sessions |

## Token transport and session security
Access token: JWT signed HS256, 15-minute default, validates signature, issuer, audience, expiration and `type=access`; send `Authorization: Bearer <accessToken>`. Refresh tokens are high-entropy opaque bearer secrets returned in JSON for this educational API; the database stores only SHA-256 hashes, rotates on use, and attempts to revoke a token family on replay. **Client storage warning:** do not store refresh tokens in localStorage in a production browser application. Prefer HttpOnly, Secure, SameSite cookies plus CSRF protection when using cookies. Logout requires a server request; removing a token client-side is not revocation.

## Security / privacy notes
- Helmet, explicit CORS origin allowlist, JSON size cap, content-type check, API/auth rate limits, Zod strict allowlists, parameterised TypeORM queries, DB constraints, safe error responses, no secrets in logs.
- Passwords use Argon2id; password hashes are excluded by default and never mapped into response DTOs.
- Employee records are personal data. Minimise collected fields, restrict salary and profile visibility, and avoid putting PII or tokens in logs. Audit significant actions. `AUDIT_RETENTION_DAYS` is a documented policy setting; implement a scheduled deletion job only after legal/organisational retention review.
- Deactivation disables the linked user and revokes refresh sessions. Existing access JWTs are short-lived; if immediate access-token revocation is required, add a token-version or denylist check on every request.
- GDPR compliance is not guaranteed by code alone. Document lawful basis, notices, data-subject requests, retention, erasure exceptions, and obtain privacy/legal review. Correction is via authorised PATCH; erasure requests must be reviewed against legal retention duties.

## Migrations and development data
`src/migrations/1730000000000-InitialSchema.ts` creates all required tables, FKs, unique constraints, checks, and indexes. Use migrations for future schema changes; never turn on TypeORM synchronize in production. Seed data is fictitious and refuses `NODE_ENV=production`.

## Tests and assignment attack demonstrations
Run `npm test`. Tests cover strict Zod field allowlists, pagination/sort allowlists, and authorization middleware. Postman collection is `employee-management.postman_collection.json`. Demonstrate privilege escalation by PATCHing `/employees/me` with `{ "role": "admin" }` (400); BOLA by requesting another employee's ID (404); refresh replay by using the same refresh token twice (second request rejected and family revoked).

## Known extension points before production
This is an educational implementation and should be reviewed before deployment. Add a dedicated admin-only user/role assignment API, recursive manager reporting scope if required, stronger concurrency-safe refresh rotation using row locks/conditional updates, audit retention worker, complete integration tests with disposable PostgreSQL, and an admin-only sensitive-field endpoint. The current API does not expose salary in ordinary DTOs. Do not claim legal compliance or deploy with demo accounts.
