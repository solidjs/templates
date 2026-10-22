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

export async function login(username: string, password: string) {
  const user = await db.user.findUnique({ where: { username } });
  if (!user || password !== user.password) throw new Error("Invalid login");
  return user;
}

export async function logout() {
  const session = await getSession();
  await session.update(d => {
    d.userId = undefined;
  });
}

export async function register(username: string, password: string) {
  const existingUser = await db.user.findUnique({ where: { username } });
  if (existingUser) throw new Error("User already exists");
  return db.user.create({
    data: { username: username, password }
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
