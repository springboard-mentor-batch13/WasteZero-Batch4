import crypto from 'crypto';

const KEY_VERSION = 'v2';
const keySource = process.env.MESSAGE_ENCRYPTION_KEY;

if (!keySource) {
  throw new Error('MESSAGE_ENCRYPTION_KEY is required. Configure an exact 32-byte key before startup.');
}

const SECRET_KEY = Buffer.from(keySource, 'utf8');
if (SECRET_KEY.length !== 32) {
  throw new Error(
    `MESSAGE_ENCRYPTION_KEY must be exactly 32 bytes; received ${SECRET_KEY.length}.`,
  );
}

export class MessageDecryptionError extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = 'MessageDecryptionError';
  }
}

export const encryptMessage = (text) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', SECRET_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [KEY_VERSION, iv.toString('hex'), authTag.toString('hex'), encrypted.toString('hex')].join(':');
};

const decryptV2 = ([, ivHex, tagHex, encryptedHex]) => {
  if (!ivHex || !tagHex || !encryptedHex) throw new Error('Invalid v2 message envelope');
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    SECRET_KEY,
    Buffer.from(ivHex, 'hex'),
  );
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final(),
  ]).toString('utf8');
};

const decryptLegacyCbc = ([ivHex, encryptedHex]) => {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    SECRET_KEY,
    Buffer.from(ivHex, 'hex'),
  );
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export const decryptMessage = (storedContent) => {
  if (!storedContent || !storedContent.includes(':')) return storedContent;

  try {
    const parts = storedContent.split(':');
    if (parts[0] === KEY_VERSION) return decryptV2(parts);
    if (parts.length === 2) return decryptLegacyCbc(parts);
    throw new Error(`Unsupported encrypted message version: ${parts[0]}`);
  } catch (error) {
    throw new MessageDecryptionError('Encrypted message could not be authenticated or decrypted.', error);
  }
};
