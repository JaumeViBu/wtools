# wtools

> A CLI toolkit for writers — extract, organize, and manage inline tags in your text files.

## Installation

```bash
pnpm install writing_tools
```

**Prerequisites:**

- Node.js 18+
- pnpm 10+

## Usage

```
pnpm start [command] [options]
```

Or directly:

```
node bin/wtools.js [command] [options]
```

### Commands

| Command     | Description                                         |
|-------------|-----------------------------------------------------|
| `list`      | List all available commands                          |
| `extract`   | Extract tags from files into a reusable JSON output  |
| `version`   | Show the version (`-V`)                              |
| `help`      | Show help for any command (`--help`)                 |

#### `extract`

Extracts tags with the format `@[cat_id:short:caseFlag]` from one or more files and saves them as structured JSON.

**Tag format:**

- `cat` — category (e.g. `npc`)
- `id` — unique identifier (e.g. `001`)
- `short` — short description
- `caseFlag` — optional case: `C` (capitalize), `U` (uppercase), `L` (lowercase)

**Options:**

| Flag                 | Description                         |
|----------------------|-------------------------------------|
| `-o, --output <name>`| Output filename (without extension) |
| `-h, --help`         | Display help                        |

**Example:**

Input:
```
Lorem @[npc_001:pellentesque:C] ipsum
Dolor @[npc_002:amet] sit
```

Output (`output.tag`):
```json
{
  "results": [
    { "id": "npc_001", "cat": "npc", "short": "pellentesque", "long": "pellentesque" },
    { "id": "npc_002", "cat": "npc", "short": "amet", "long": "amet" }
  ],
  "conflicts": []
}
```

If a tag `id` appears with conflicting descriptions, it is deduplicated (first occurrence wins) and logged in `conflicts`.

## Scripts

| Command                | Action                      |
|------------------------|-----------------------------|
| `pnpm start`           | Run the CLI                 |
| `pnpm test`            | Run tests (vitest)          |
| `pnpm biome`           | Lint & format check         |
| `pnpm biome-w`         | Lint & format auto-fix      |
| `pnpm biome-format`    | Format check                |
| `pnpm biome-format-w`  | Format auto-fix             |
| `pnpm biome-lint`      | Lint check                  |
| `pnpm biome-lint-w`    | Lint auto-fix               |

## Dependencies

- [commander](https://github.com/tj/commander.js) — CLI framework

### Dev Dependencies

- [vitest](https://github.com/vitest-dev/vitest) — test runner
- [@biomejs/biome](https://biomejs.dev) — linter & formatter
- [only-allow](https://github.com/pnpm/only-allow) — enforce pnpm

## Project Structure

```
bin/wtools.js          # CLI entry point
src/commands/          # Command implementations
  extract.js
  list.js
  version.js
src/utils/             # Utility functions
test/                  # Test files
```

## License

[MIT](LICENSE)
