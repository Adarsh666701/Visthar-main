import twilio from 'twilio';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } from '../core/constants';

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/**
 * Generate a random 6-digit OTP
 */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP to phone number via Twilio
 */
export async function sendOTP(phoneNumber, otp) {
  try {
    const message = await client.messages.create({
      body: `Your Visthar verification code is: ${otp}. Valid for 10 minutes.`,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('Failed to send OTP:', error.message);
    throw new Error('Failed to send OTP. Please ensure your phone number is valid.');
  }
}

/**
 * Store OTP in database temporarily (expires in 10 minutes)
 */
export async function storeOTP(db, phoneNumber, otp) {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  
  await db.collection('otps').updateOne(
    { phoneNumber },
    {
      $set: {
        phoneNumber,
        otp,
        createdAt: new Date(),
        expiresAt,
        attempts: 0,
      },
    },
    { upsert: true }
  );
}

/**
 * Verify OTP
 */
export async function verifyOTP(db, phoneNumber, otp) {
  const otpRecord = await db.collection('otps').findOne({
    phoneNumber,
    otp,
  });

  if (!otpRecord) {
    return { success: false, message: 'Invalid OTP' };
  }

  if (new Date() > otpRecord.expiresAt) {
    return { success: false, message: 'OTP has expired' };
  }

  if (otpRecord.attempts >= 3) {
    return { success: false, message: 'Too many attempts. Please request a new OTP.' };
  }

  // OTP is valid, delete it from database
  await db.collection('otps').deleteOne({ phoneNumber });

  return { success: true, message: 'OTP verified successfully' };
}

/**
 * Increment failed OTP attempts
 */
export async function incrementOTPAttempts(db, phoneNumber) {
  await db.collection('otps').updateOne(
    { phoneNumber },
    { $inc: { attempts: 1 } }
  );
}

/**
 * Clean up expired OTPs (run periodically)
 */
export async function cleanupExpiredOTPs(db) {
  const result = await db.collection('otps').deleteMany({
    expiresAt: { $lt: new Date() },
  });
  return result.deletedCount;
}
