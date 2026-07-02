import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../core/constants';

export function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function getToken(req) {
  const cookie = req.headers.get('cookie') || '';
  const cookieMatch = cookie.match(/access_token=([^;]+)/);
  if (cookieMatch) return decodeURIComponent(cookieMatch[1]);

  const auth = req.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export async function currentUser(req, db) {
  const token = getToken(req);
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await db.collection('users').findOne({ id: payload.sub });
    if (!user) return null;
    const { password_hash, _id, ...safe } = user;
    return safe;
  } catch {
    return null;
  }
}

export async function requireAdmin(req, db) {
  const user = await currentUser(req, db);
  if (!user || user.role !== 'admin') return null;
  return user;
}

export function attachAuthCookie(response, token) {
  response.headers.set(
    'Set-Cookie',
    `access_token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`
  );
  return response;
}

export function clearAuthCookie(response) {
  response.headers.set('Set-Cookie', 'access_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
  return response;
}
