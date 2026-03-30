import { describe, it, expect } from 'vitest';
import version from '#commands/version';
import { version as pkgVersion } from '#root/package' with { type: 'json' };

describe('version', () => {
    it('should match package.json version', () => {
        expect(version()).toBe(pkgVersion);
    });
});


