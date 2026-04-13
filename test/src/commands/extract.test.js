import { describe, it, expect } from 'vitest';
import { parseTag, extractTags, extract, resolveOutputPath } from '#commands/extract';
import { join, parse } from 'path';

describe('parseTag', () => {
    it('should parse a basic tag', () => {
        const result = parseTag('@[npc_001:pellentesque:C]');
        expect(result).toEqual({
            id: 'npc_001',
            cat: 'npc',
            short: 'pellentesque',
            long: 'pellentesque',
        });
    });

    it('should return null for invalid tag', () => {
        expect(parseTag('not a tag')).toBeNull();
        expect(parseTag(42)).toBeNull();
        expect(parseTag('@[npc_001:pellentesque:C')).toBeNull();
        expect(parseTag('')).toBeNull();
        expect(parseTag(null)).toBeNull();
        expect(parseTag(undefined)).toBeNull();
        expect(parseTag({})).toBeNull();
        expect(parseTag([])).toBeNull();
        expect(parseTag(() => { })).toBeNull();
        expect(parseTag(new Date())).toBeNull();
        expect(parseTag(new Error())).toBeNull();
        expect(parseTag(/regex/)).toBeNull();
        expect(parseTag(new RegExp('regex'))).toBeNull();
        expect(parseTag(true)).toBeNull();
        expect(parseTag(false)).toBeNull();
        expect(parseTag(NaN)).toBeNull();

    });
});

describe('extractTags', () => {
    it('should extract a tag from a line', () => {
        const line = 'Lorem ipsum @[npc_001:pellentesque:C] eget lectus';
        const results = extractTags(line);
        expect(results).toHaveLength(1);
        expect(results[0].id).toBe('npc_001');
    });

    it('should extract multiple tags from a line', () => {
        const line = '@[npc_001:pellentesque:C] lorem @[loc_001:somewhere:U]';
        const results = extractTags(line);
        expect(results).toHaveLength(2);
    });

    it('should return empty array if no tags found', () => {
        expect(extractTags('no tags here')).toEqual([]);
        expect(extractTags('')).toEqual([]);
        expect(extractTags(null)).toEqual([]);
        expect(extractTags(undefined)).toEqual([]);
        expect(extractTags({})).toEqual([]);
        expect(extractTags([])).toEqual([]);
        expect(extractTags(() => { })).toEqual([]);
        expect(extractTags(new Date())).toEqual([]);
        expect(extractTags(new Error())).toEqual([]);
        expect(extractTags(/regex/)).toEqual([]);
        expect(extractTags(new RegExp('regex'))).toEqual([]);
        expect(extractTags(true)).toEqual([]);
        expect(extractTags(false)).toEqual([]);
        expect(extractTags(NaN)).toEqual([]);
    });
});

describe('resolveOutputPath', () => {
    it('should default to output.tag in same folder as input', () => {
        const result = resolveOutputPath('src/files/myfile.txt');
        expect(result).toBe(join('src/files', 'output.tag'));
    });

    it('should use custom name when provided', () => {
        const result = resolveOutputPath('src/files/myfile.txt', 'custom');
        expect(result).toBe(join('src/files', 'custom.tag'));
    });

    it('should return null if input is wrong type', () => {
        expect(resolveOutputPath(42)).toBeNull();
        expect(resolveOutputPath(null)).toBeNull();
        expect(resolveOutputPath(undefined)).toBeNull();
        expect(resolveOutputPath({})).toBeNull();
        expect(resolveOutputPath([])).toBeNull();
        expect(resolveOutputPath(() => { })).toBeNull();
        expect(resolveOutputPath(new Date())).toBeNull();
        expect(resolveOutputPath(new Error())).toBeNull();
        expect(resolveOutputPath(/regex/)).toBeNull();
        expect(resolveOutputPath(new RegExp('regex'))).toBeNull();
        expect(resolveOutputPath(true)).toBeNull();
        expect(resolveOutputPath(false)).toBeNull();
        expect(resolveOutputPath(NaN)).toBeNull();
    });
});

describe('extract', () => {


    it('should deduplicate by id', async () => {
        const path = join('test', 'samples', 'duplicates_same.txt');
        const { results, conflicts } = await extract([path]);
        const ids = results.map(r => r.id);
        expect(ids.filter(id => id === 'npc_001')).toHaveLength(1);
        expect(conflicts).toHaveLength(0);
    });

    it('should report conflicts if id is duplicated and different descriptions', async () => {
        const path = join('test', 'samples', 'duplicates_conflict.txt');
        const { results, conflicts } = await extract([path]);
        expect(conflicts).toHaveLength(1);
        expect(conflicts[0]).toMatchObject({
            id: 'npc_001',
            existing: 'pellentesque',
            conflicting: 'other',
        });
    });

    it('should return null if paths is not an array', async () => {
        expect(await extract(42)).toBeNull();
        expect(await extract(null)).toBeNull();
        expect(await extract(undefined)).toBeNull();
        expect(await extract({})).toBeNull();
        expect(await extract(() => { })).toBeNull();
        expect(await extract(new Date())).toBeNull();
        expect(await extract(new Error())).toBeNull();
        expect(await extract(/regex/)).toBeNull();
        expect(await extract(new RegExp('regex'))).toBeNull();
        expect(await extract(true)).toBeNull();
        expect(await extract(false)).toBeNull();
        expect(await extract(NaN)).toBeNull();
    });

    it('should return null if paths is not an array of strings', async () => {
        expect(await extract([42])).toBeNull();
        expect(await extract(['./test/samples/extract_sample_xs.txt', 42])).toBeNull();
        expect(await extract([null])).toBeNull();
        expect(await extract([undefined])).toBeNull();
        expect(await extract([{}])).toBeNull();
        expect(await extract([[]])).toBeNull();
    });

    it('should return null if path is not a valid filepath', async () => {
        expect(await extract(['./test/samples/extract_sample_xs.txt', './test/samples/notfound.txt'])).toBeNull();
        expect(await extract(['./test/samples/notfound.txt'])).toBeNull();
        expect(await extract(['./test/samples/'])).toBeNull();
        expect(await extract(['./test/samples/extract_sample_xs.txt', join('test', 'samples', 'notfound.txt')])).toBeNull();

    });

    it('should return null if options is not an object', async () => {
        expect(await extract(['./test/samples/extract_sample_xs.txt'], 42)).toBeNull();
        expect(await extract(['./test/samples/extract_sample_xs.txt'], null)).toBeNull();
        expect(await extract(['./test/samples/extract_sample_xs.txt'], [])).toBeNull();
        expect(await extract(['./test/samples/extract_sample_xs.txt'], () => { })).toBeNull();
        expect(await extract(['./test/samples/extract_sample_xs.txt'], true)).toBeNull();
        expect(await extract(['./test/samples/extract_sample_xs.txt'], false)).toBeNull();
        expect(await extract(['./test/samples/extract_sample_xs.txt'], NaN)).toBeNull();
    });
});