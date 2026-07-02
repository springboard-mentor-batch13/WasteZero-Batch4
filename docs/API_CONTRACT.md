# WasteZero API Contract — Milestone 1

Base URL (dev): `http://localhost:5000/api`
Auth: send `Authorization: Bearer <token>` on protected routes.
All responses are JSON with a `success` boolean.

## Roles
`volunteer` · `ngo` · `admin` (default: `volunteer`).

---

## Auth

### POST /api/auth/register
Body:
```json
{ "name": "Asha", "email": "asha@wz.com", "password": "secret123", "role": "volunteer", "location": "Pune" }
```
`role` and `location` optional. Success `201`:
```json
{ "success": true, "token": "<jwt>", "user": { "id", "name", "email", "role", "skills", "location", "bio", "createdAt" } }
```
Errors: `400` validation, `409` email exists.

### POST /api/auth/login
Body: `{ "email": "asha@wz.com", "password": "secret123" }`
Success `200`: same shape as register (`token` + `user`).
Errors: `400` validation, `401` invalid credentials.

### GET /api/auth/me  🔒
Returns `{ "success": true, "user": {...} }` for the current token.

---

## Users

### GET /api/users/profile  🔒
Current user's profile → `{ "success": true, "user": {...} }`.

### PUT /api/users/profile  🔒
Body (any subset): `{ "name", "skills": ["plastic"], "location", "bio", "address", "coordinates" }`
Returns the updated `user`.

### GET /api/users  🔒 admin
List all users → `{ "success": true, "count": n, "users": [...] }`.

### GET /api/users/:id  🔒 admin
Single user by id.

---

## Error shape
```json
{ "success": false, "message": "human readable", "errors": [{ "field": "email", "message": "..." }] }
```
(`errors[]` present only on `400` validation failures.)

## Frontend notes
- Login/Register use **email** (not username).
- Store the `token` (e.g. localStorage) and attach it via an HTTP interceptor.
- On `401`, clear the token and redirect to `/login`.
