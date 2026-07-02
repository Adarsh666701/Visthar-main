import { z } from 'zod';

const emailSchema = z.string().trim().toLowerCase().email().max(254);
const phoneSchema = z.string().trim().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');
const requiredText = (max) => z.string().trim().min(1).max(max);
const optionalText = (max) => z.string().trim().max(max).optional();
const cartItemSchema = z.object({
  slug: requiredText(120),
  qty: z.number().int().positive().max(20),
});
const shippingSchema = z.object({
  name: requiredText(120),
  email: emailSchema,
  phone: optionalText(32),
  address: requiredText(300),
  city: requiredText(120),
  state: requiredText(120),
  pincode: requiredText(20),
});

export const schemas = {
  register: z.object({
    email: emailSchema,
    password: z.string().min(6).max(128),
    name: optionalText(80),
    phone: phoneSchema,
  }),
  sendOTP: z.object({
    phone: phoneSchema,
    email: emailSchema,
    name: optionalText(80),
    password: z.string().min(6).max(128),
  }),
  verifyOTP: z.object({
    phone: phoneSchema,
    otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
  }),
  login: z.object({
    email: emailSchema,
    password: z.string().min(1).max(128),
  }),
  siteSettings: z.object({
    email: optionalText(254),
    phone: optionalText(32),
    address: optionalText(160),
    hq: optionalText(160),
    instagram: optionalText(160),
    twitter: optionalText(160),
    youtube: optionalText(160),
    linkedin: optionalText(160),
    company: optionalText(160),
  }),
  prebook: z.object({
    email: emailSchema,
    productSlug: requiredText(120),
    name: optionalText(80),
    phone: optionalText(32),
  }),
  notify: z.object({
    email: emailSchema,
    productSlug: requiredText(120),
  }),
  newsletter: z.object({
    email: emailSchema,
  }),
  contact: z.object({
    email: emailSchema,
    message: requiredText(5000),
    name: optionalText(80),
    subject: optionalText(160),
  }),
  oem: z.object({
    email: emailSchema,
    company: requiredText(160),
    name: optionalText(80),
    phone: optionalText(32),
    volume: optionalText(64),
    message: optionalText(5000),
  }),
  cart: z.object({
    items: z.array(z.unknown()).max(200).optional(),
  }),
  order: z.object({
    paymentIntentId: z.string().trim().min(1).max(200),
    paymentProvider: z.enum(['stripe']),
    shipping: shippingSchema,
  }),
  paymentIntentCreate: z.object({
    items: z.array(cartItemSchema).min(1).max(200),
    shipping: shippingSchema.optional(),
  }),
};
  siteSettings: z.object({
    email: optionalText(254),
    phone: optionalText(32),
    address: optionalText(160),
    hq: optionalText(160),
    instagram: optionalText(160),
    twitter: optionalText(160),
    youtube: optionalText(160),
    linkedin: optionalText(160),
    company: optionalText(160),
  }),
  prebook: z.object({
    email: emailSchema,
    productSlug: requiredText(120),
    name: optionalText(80),
    phone: optionalText(32),
  }),
  notify: z.object({
    email: emailSchema,
    productSlug: requiredText(120),
  }),
  newsletter: z.object({
    email: emailSchema,
  }),
  contact: z.object({
    email: emailSchema,
    message: requiredText(5000),
    name: optionalText(80),
    subject: optionalText(160),
  }),
  oem: z.object({
    email: emailSchema,
    company: requiredText(160),
    name: optionalText(80),
    phone: optionalText(32),
    volume: optionalText(64),
    message: optionalText(5000),
  }),
  cart: z.object({
    items: z.array(z.unknown()).max(200).optional(),
  }),
  order: z.object({
    paymentIntentId: z.string().trim().min(1).max(200),
    paymentProvider: z.enum(['stripe']),
    shipping: shippingSchema,
  }),
  paymentIntentCreate: z.object({
    items: z.array(cartItemSchema).min(1).max(200),
    shipping: shippingSchema.optional(),
  }),
};

export async function parseBody(req, schema) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
