import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * List all available commands
 * @returns {Promise<string[]>}
 */
async function list() {
	const __dirname = dirname(fileURLToPath(import.meta.url));
	const files = readdirSync(__dirname).filter((f) => f.endsWith(".js"));

	const commands = await Promise.all(
		files.map(async (file) => {
			const mod = await import(pathToFileURL(join(__dirname, file)).href);
			return { name: file.replace(".js", ""), meta: mod.meta };
		}),
	);

	return commands
		.filter((cmd) => cmd.meta?.type === "command")
		.map((cmd) => cmd.name)
		.concat("help")
		.sort();
}

export const meta = {
	type: "command",
	description: "List all available commands",
};

export default list;
