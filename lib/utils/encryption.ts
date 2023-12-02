import crypto from 'crypto';

// Your secret key can be any string, and should be kept safe
// It will be used to derive both the AES key and the IV

const ALGORITHM = 'aes-256-cbc';

export function encrypt(text: string) {
  const SECRET_KEY = process.env.ENCRYPTION_KEY as string;
  // Derive the key and initialization vector (IV) from the SECRET_KEY
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(SECRET_KEY, salt, 100000, 32, 'sha256');
  const iv = crypto.randomBytes(16);

  // Encrypt the text
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Return the encrypted text, IV, and salt as a colon-separated string
  return `${salt.toString('hex')}:${iv.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string) {
  if (!encryptedText) return encryptedText;
  const SECRET_KEY = process.env.ENCRYPTION_KEY as string;
  // Extract the salt, IV, and actual encrypted text from the string
  const [saltHex, ivHex, encrypted] = encryptedText.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');

  // Derive the key from the SECRET_KEY and the extracted salt
  const key = crypto.pbkdf2Sync(SECRET_KEY, salt, 100000, 32, 'sha256');

  // Decrypt the text
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
