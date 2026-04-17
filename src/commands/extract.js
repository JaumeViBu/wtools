import { createReadStream, writeFileSync, statSync } from 'fs';
import { createInterface } from 'readline';
import { dirname, join } from 'path';

/**
 * Parse a tag string into an object
 * @param {string} raw 
 * @returns {{id:string,cat:string,short:string,long:string}|null}
 */
export function parseTag(raw) {
    if (typeof raw !== 'string') return null;
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

/**
 * Extract tags from a line
 * Returns an array of strings with the tag ids
 * If no tags are found, returns an empty array
 * @param {string} line 
 * @returns {string[]}
 */
export function extractTags(line) {
    if (typeof line !== 'string') return [];
    const regex = /@\[([^\]]+)\]/g;
    return [...line.matchAll(regex)]
        .map(m => parseTag(m[0]))
        .filter(Boolean);
}


/**
 * Resolve the output path for a given input file, using the given name
 * If no name is provided, defaults to 'output'
 * If the input path is not a string, returns null
 * If the name is not a string, returns null
 * @param {string} inputPath 
 * @param {string} name 
 * @returns {string|null}
 */
export function resolveOutputPath(inputPath, name = 'output') {
    if (typeof inputPath !== 'string') return null;
    if (typeof name !== 'string') return null;
    return join(dirname(inputPath), `${name}.tag`);
}

/**
 * Extract tags from one or more files
 * Returns an object with the extracted tags and conflicts
 * @param {string[]} paths 
 * @param {{output:string}} options
 * @returns {{results:string[],conflicts:{id:string,existing:string,conflicting:string}[]}|null}
 */
export async function extract(paths, options = {}) {
    if (!Array.isArray(paths)) return null;
    if (Array.isArray(options)) return null;
    if (typeof options !== 'object') return null;
    if (options === null || options === undefined) return null;
    if (Object.keys(options).includes('output') && typeof options.output !== 'string') return null;

    for (const path of paths) {
        if (typeof path !== 'string') {
            return null;
        }

        // check if path is not valid or is not a file
        const checkPath = statSync(path, { throwIfNoEntry: false });
        if (!checkPath || !checkPath.isFile()) {
            return null;
        }
    }

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

export const meta = {
    type: 'command',
    description: 'Extract tags from one or more files',
};

export default extract;