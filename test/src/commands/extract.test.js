import { describe, it, expect } from 'vitest';
import { parseTag, extractTags, extract, resolveOutputPath } from '#commands/extract';
import { join } from 'path';

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
});

describe('extract', () => {


    it('should deduplicate by id', async () => {
        const fixture = join('test', 'samples', 'duplicates_same.txt');
        const { results, conflicts } = await extract([fixture]);
        const ids = results.map(r => r.id);
        expect(ids.filter(id => id === 'npc_001')).toHaveLength(1);
        expect(conflicts).toHaveLength(0);
    });

    it('should report conflicts if id is duplicated and different descriptions', async () => {
        const fixture = join('test', 'samples', 'duplicates_conflict.txt');
        const { results, conflicts } = await extract([fixture]);
        expect(conflicts).toHaveLength(1);
        expect(conflicts[0]).toMatchObject({
            id: 'npc_001',
            existing: 'pellentesque',
            conflicting: 'other',
        });
    });
});