import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { useSession } from "@solidjs/start/http";
import { db } from "./db";

const SESSION_COOKIE_NAME = "solid_start_prisma_session";

export function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

export function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

const SCRYPT_KEY_LENGTH = 64;
// OWASP's minimum cost for scrypt; maxmem must exceed the 128 MiB that N and r need.
const SCRYPT_OPTIONS = { N: 2 ** 17, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };

function deriveKey(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, SCRYPT_KEY_LENGTH, SCRYPT_OPTIONS, (err, key) =>
      err ? reject(err) : resolve(key)
    );
  });
}

async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string) {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const expected = Buffer.from(key, "hex");
  const actual = await deriveKey(password, Buffer.from(salt, "hex"));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function login(username: string, password: string) {
  const user = await db.user.findUnique({ where: { username } });
  if (!user || !(await verifyPassword(password, user.password))) throw new Error("Invalid login");
  return user;
}

export async function logout() {
  const session = await getSession();
  await session.update(d => {
    d.userId = undefined;
  });
}

export async function register(username: string, password: string) {
  const hash = await hashPassword(password);
  const existingUser = await db.user.findUnique({ where: { username } });
  if (existingUser) throw new Error("User already exists");
  return db.user.create({
    data: { username, password: hash }
  });
}

export function getSession() {
  return useSession({
    name: SESSION_COOKIE_NAME,
    password: process.env.SESSION_SECRET ?? "areallylongsecretthatyoushouldreplace",
    cookie: {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    }
  });
}
