import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";
import config from "../../prisma.config";

export const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: config.datasource!.url! }) });
