const crypto = require("node:crypto");

// Passwords are NEVER stored as plain text. We store "salt:hash", where the hash
// comes from scrypt, a deliberately slow algorithm that makes guessing expensive.
const KEY_LENGTH = 64;

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex"); // unique per user
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const expected = Buffer.from(hash, "hex");
  const actual = crypto.scryptSync(password, salt, KEY_LENGTH);
  // timingSafeEqual takes the same time whether the first or last byte differs,
  // so attackers can't learn anything from how long the check takes.
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

module.exports = { hashPassword, verifyPassword };
