import { env } from "@/configs/env";
import CryptoJS from "crypto-js";

async function hashPassword(password: string) {
  const hash = CryptoJS.AES.encrypt(password, env.HASH_SECRET).toString();
  return hash;
}

async function comparePassword(password: string, hash: string) {
  const bytes = CryptoJS.AES.decrypt(hash, env.HASH_SECRET);
  const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
  return password === originalPassword;
}

export { hashPassword, comparePassword };
