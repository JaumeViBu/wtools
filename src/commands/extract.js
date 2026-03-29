import { createReadStream, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import { dirname, join } from 'path';

export function parseTag(raw) {
    const match = raw.match(/^@\[([^:\]]+):([^:\]]+)(?::([A-Za-z]))?\]$/);
    if (!match) return null;

    const [, id, short] = match; // drop caseFlag
    const cat = id.split('_')[0];

    return {
        id,
        cat,
        short: short.toLowerCase(),
        long: short.toLowerCase(),
    };
}

export function extractTags(line) {
    const regex = /@\[([^\]]+)\]/g;
    return [...line.matchAll(regex)]
        .map(m => parseTag(m[0]))
        .filter(Boolean);
}



export function resolveOutputPath(inputPath, name = 'output') {
    return join(dirname(inputPath), `${name}.tag`);
}

export async function extract(paths, options = {}) {
    const seen = new Map();
    const conflicts = [];

    for (const filePath of paths) {
        const rl = createInterface({
            input: createReadStream(filePath),
            crlfDelay: Infinity,
        });

        for await (const line of rl) {
            for (const tag of extractTags(line)) {
                if (!seen.has(tag.id)) {
                    seen.set(tag.id, tag);
                } else if (seen.get(tag.id).short !== tag.short) {
                    // tag is duplicated but with different descriptions => conflict
                    conflicts.push({
                        id: tag.id,
                        existing: seen.get(tag.id).short,
                        conflicting: tag.short,
                    });
                }
            }
        }
    }

    const results = [...seen.values()];
    const outputPath = resolveOutputPath(paths[0], options.output);
    const output = { results, conflicts };
    writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

    return { results, conflicts };
}

export default extract;
export const meta = {
    type: 'command',
    description: 'Extract tags from one or more files',
};