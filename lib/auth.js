import { SignJWT, jwtVerify } from 'jose';

const developmentSecret = 'local-development-secret-change-before-deploy-123456';

function getSecret() {
  const configured = process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === 'production' && (!configured || configured.length < 32)) {
    throw new Error('AUTH_SECRET must be configured with at least 32 characters in production.');
  }
  return new TextEncoder().encode(configured || developmentSecret);
}

export async function createToken(email) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getSecret());
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

export async function requireAdmin(request) {
  const token = request.cookies.get('fatima_admin')?.value;
  return token ? await verifyToken(token) : null;
}
