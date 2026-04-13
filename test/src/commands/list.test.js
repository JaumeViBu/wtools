import { describe, it, expect } from 'vitest';
import list, { meta } from '#commands/list';

describe('list', () => {
    it('should return an array', async () => {
        const commands = await list();
        expect(Array.isArray(commands)).toBe(true);
    });

    it('should include commands but not flags', async () => {
        const commands = await list();
        expect(commands).toContain('list');
        expect(commands).toContain('extract');
        expect(commands).toContain('help');
        expect(commands).not.toContain('version'); // version is a flag
    });

    it('should not include file extensions', async () => {
        const commands = await list();
        expect(commands.every(cmd => !cmd.includes('.js'))).toBe(true);
    });

    it('should be registered as a command not a flag', () => {
        expect(meta.type).toBe('command');
    });
});