import { describe, it, expect } from 'vitest';
import version, { meta } from '#commands/version';
import { version as pkgVersion } from '#root/package' with { type: 'json' };

describe('version', () => {
    it('should match package.json version', () => {
        expect(version()).toBe(pkgVersion);
    });

    it('should return a string', () => {
        expect(typeof version()).toBe('string');
    });

    it('should be registered as a flag not a command', () => {
        expect(meta.type).toBe('flag');
        expect(meta.type).not.toBe('command');
        expect(meta.flag).toBe('-V, --version');
    });
});


