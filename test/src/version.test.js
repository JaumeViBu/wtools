import { describe, it, expect } from 'vitest';
import version from '../../src/commands/version.js';
import { version as pkgVersion } from '../../package.json' with { type: 'json' };

describe('version', () => {
    it('should match package.json version', () => {
        expect(version()).toBe(pkgVersion);
    });
});


