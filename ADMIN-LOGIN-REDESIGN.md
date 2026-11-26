# Fatima Academy Admin Login Redesign

The `/admin/login` page now matches the Maxton-style dark admin dashboard: charcoal background, dark card, blue accent controls, matching branding, and responsive layout.

## Preserved behavior

- Authenticates with POST `/api/auth/login` using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from the server environment.
- Successful sign-in redirects to `/admin/dashboard`.
- Keeps error messages, loading state, and show/hide password functionality.
- Does not embed or expose credentials in client code.

## Testing

Open `http://localhost:3000/admin/login`, confirm desktop/mobile layout, and sign in using configured server credentials. Database-backed dashboard features need a valid `MONGODB_URI`.
