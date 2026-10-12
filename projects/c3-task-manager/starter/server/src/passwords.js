const crypto = require("node:crypto");

const KEY_LENGTH = 64;

// TODO: hashPassword(password)
//  1. Make a random salt: crypto.randomBytes(16).toString("hex")
//  2. Hash: crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex")
//  3. Return `${salt}:${hash}`
function hashPassword(password) {
  throw new Error("hashPassword is not implemented yet");
}

// TODO: verifyPassword(password, stored)
//  1. Split stored into salt and hash
//  2. Hash the given password with the same salt
//  3. Compare with crypto.timingSafeEqual (both must be Buffers of equal length)
function verifyPassword(password, stored) {
  throw new Error("verifyPassword is not implemented yet");
}

module.exports = { hashPassword, verifyPassword };
