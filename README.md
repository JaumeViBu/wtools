# wtools

A set of tools to help you with writing.

## Installation

Prerequisites: Node.js 18.x or higher

```bash
npm install wtools
```
or 

```bash
pnpm install wtools
```

## Usage

```bash
node wtools.js
```
or

```bash
node wtools.js --help
```
To show description of all options.

```bash
node wtools.js -V
```
To show version.

```bash
node wtools.js list
```
To show list of all available commands

```bash
node wtools.js extract [options] <paths...>
```
Extract tags from one or more files so they can be used later for easy hotswapping the contents of the tags.

Tags are text with the format @[cat_id:short:caseFlag] where:
- cat is the category of the tag
- id is the id of the tag
- short is the short description of the tag
- caseFlag is the case flag of the tag, which can be C (capital), U (uppercase) or L (lowercase), to indicate which case the tag should be replaced with

After extracting the tags, the output is saved to a file with the name given in -o option or output by default, with a .tag extension.

Each tag found is saved in the output file as an object with the following properties:
- id: the id of the tag
- cat: the category of the tag
- short: the short description of the tag
- long: the long description of the tag, which is the same as the short description. This is added for user convenience, to be able to expand the description in the output file keeping the text with tags lean and clean.

If a tag is found multiple times, it is deduplicated by id, and the first occurrence is kept and a conflict entry is added to the output file.

For example, if the input file is:
```txt
Lorem @[npc_001:pellentesque:C] ipsum
Dolor @[npc_002:amet] sit
```
the output file generated will be:

```json
{
  "results": [
    {
      "id": "npc_001",
      "cat": "npc",
      "short": "pellentesque",
      "long": "pellentesque"
    },
    {
      "id": "npc_002",
      "cat": "npc",
      "short": "amet",
      "long": "amet"
    }
  ],
  "conflicts": []
}
```
Conflicts are tags that have the same id but different descriptions. For example, if the input file is:
```txt
Lorem @[npc_001:pellentesque:C] ipsum
Dolor @[npc_001:amet] sit
```
the output file generated will be:

```json
{
  "results": [
    {
      "id": "npc_001",
      "cat": "npc",
      "short": "pellentesque",
      "long": "pellentesque"
    }
  ],
  "conflicts": [
    {
      "id": "npc_001",
      "existing": "pellentesque",
      "conflicting": "amet"
    }
  ]
}
```

Options:
  -o, --output <name>  output filename, without extension (default: "output") 
  -h, --help           display help for command

## Dependencies
- [commander](https://github.com/tj/commander.js)

### Development Dependencies
- [vitest](https://github.com/vitest-dev/vitest)

## License
[MIT](LICENSE)