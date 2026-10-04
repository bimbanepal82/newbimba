export const INQUIRY_TYPES = [
  'General',
  'Partnership',
  'Volunteering',
  'Donation',
  'Media',
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const DEFAULT_INQUIRY_TYPE: InquiryType = 'General';

export const LIMITS = {
  name: 100,
  email: 254,
  subject: 150,
  message: 3000,
} as const;