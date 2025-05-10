import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

export function hashPassword(suppliedPW: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = scryptSync(suppliedPW, salt, 64) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export function comparePassword(storedPW: string, suppliedPW: string) {
  const [hashedPW, salt] = storedPW.split(".");
  const hashedPWBuf = Buffer.from(hashedPW, "hex");
  const suppliedPWBuf = scryptSync(suppliedPW, salt, 64) as Buffer;
  return timingSafeEqual(hashedPWBuf, suppliedPWBuf);
}
