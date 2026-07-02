import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { errorResponse, jsonResponse } from '../core/response';
import { parseBody, schemas } from '../core/validation';
import { attachAuthCookie, clearAuthCookie, currentUser, signToken } from '../services/auth-service';
import { generateOTP, incrementOTPAttempts, sendOTP, storeOTP, verifyOTP } from '../services/otp-service';

export async function handleAuthRoute(req, db, ctx) {
  const { method, path } = ctx;

  // Send OTP to phone number
  if (path === 'auth/send-otp' && method === 'POST') {
    const body = await parseBody(req, schemas.sendOTP);
    if (!body) return errorResponse(ctx, 'invalid request payload', 400);

    const { email, phone, name, password } = body;
    
    // Check if email already exists
    const existing = await db.collection('users').findOne({ email });
    if (existing) return errorResponse(ctx, 'email already registered', 400);

    // Check if phone is already verified by another user
    const phoneExists = await db.collection('users').findOne({
      phone,
      isPhoneVerified: true,
    });
    if (phoneExists) return errorResponse(ctx, 'phone number already registered', 400);

    try {
      const otp = generateOTP();
      await sendOTP(phone, otp);
      await storeOTP(db, phone, otp);

      // Store signup data temporarily in a pending collection
      await db.collection('pending_signups').updateOne(
        { phone },
        {
          $set: {
            phone,
            email,
            name: name || '',
            password_hash: await bcrypt.hash(password, 10),
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
          },
        },
        { upsert: true }
      );

      return jsonResponse(ctx, {
        ok: true,
        message: 'OTP sent to your phone number',
        phone_masked: phone.slice(-4).padStart(phone.length, '*'),
      });
    } catch (error) {
      return errorResponse(ctx, error.message, 400);
    }
  }

  // Verify OTP and create user
  if (path === 'auth/verify-otp' && method === 'POST') {
    const body = await parseBody(req, schemas.verifyOTP);
    if (!body) return errorResponse(ctx, 'invalid request payload', 400);

    const { phone, otp } = body;

    // Get pending signup data
    const pending = await db.collection('pending_signups').findOne({ phone });
    if (!pending) return errorResponse(ctx, 'no signup in progress for this phone', 400);

    // Check if pending signup has expired
    if (new Date() > pending.expiresAt) {
      await db.collection('pending_signups').deleteOne({ phone });
      return errorResponse(ctx, 'signup session expired, please start over', 400);
    }

    try {
      const result = await verifyOTP(db, phone, otp);
      if (!result.success) {
        await incrementOTPAttempts(db, phone);
        return errorResponse(ctx, result.message, 401);
      }

      // Create user with verified phone
      const user = {
        id: uuidv4(),
        email: pending.email,
        password_hash: pending.password_hash,
        name: pending.name,
        phone,
        isPhoneVerified: true,
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      await db.collection('users').insertOne(user);

      // Clean up pending signup
      await db.collection('pending_signups').deleteOne({ phone });

      const safe = {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
      };
      const token = signToken(safe);
      return attachAuthCookie(jsonResponse(ctx, { ok: true, user: safe, token }), token);
    } catch (error) {
      return errorResponse(ctx, 'OTP verification failed', 500);
    }
  }

  // Legacy registration endpoint (for backwards compatibility, but now includes phone)
  if (path === 'auth/register' && method === 'POST') {
    const body = await parseBody(req, schemas.register);
    if (!body) return errorResponse(ctx, 'invalid request payload', 400);

    const { email, password, name, phone } = body;
    const existing = await db.collection('users').findOne({ email });
    if (existing) return errorResponse(ctx, 'email already registered', 400);

    if (!phone) {
      return errorResponse(ctx, 'phone number is required. Use /auth/send-otp endpoint', 400);
    }

    return errorResponse(ctx, 'please use /auth/send-otp endpoint to register', 400);
  }

  if (path === 'auth/login' && method === 'POST') {
    const body = await parseBody(req, schemas.login);
    if (!body) return errorResponse(ctx, 'invalid request payload', 400);

    const user = await db.collection('users').findOne({ email: body.email });
    if (!user || !(await bcrypt.compare(body.password, user.password_hash))) {
      return errorResponse(ctx, 'invalid credentials', 401);
    }

    // Check if phone is verified
    if (!user.isPhoneVerified) {
      return errorResponse(
        ctx,
        'phone verification required. Please complete OTP verification first.',
        403
      );
    }

    const safe = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isPhoneVerified: user.isPhoneVerified,
    };
    const token = signToken(safe);
    return attachAuthCookie(jsonResponse(ctx, { ok: true, user: safe, token }), token);
  }

  if (path === 'auth/me' && method === 'GET') {
    const user = await currentUser(req, db);
    return jsonResponse(ctx, { user: user || null });
  }

  if (path === 'auth/logout' && method === 'POST') {
    return clearAuthCookie(jsonResponse(ctx, { ok: true }));
  }

  return null;
}
