import { readFileSync } from "fs"
import { parseEnv, styleText } from "node:util"
import { defineConfig } from "prisma/config"

let { DATABASE_URL } = process.env
let readDotEnvError: unknown

if (!DATABASE_URL) {
	try {
		({ DATABASE_URL } = parseEnv(readFileSync(`.env`, { encoding: `utf8` })))
	} catch (error) {
		readDotEnvError = error
	}
}

export default defineConfig({
	datasource: {
		// We do this in a getter because this field is not always read
		get url() {
			if (DATABASE_URL)
				return DATABASE_URL

			console.error(styleText(`red`, `Environment variable DATABASE_URL must be set`))

			if (readDotEnvError) {
				console.error(`Got error reading .env:`)
				console.error(readDotEnvError)
			}

			process.exit(1)
		}
	}
})

