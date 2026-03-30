import { execSync } from 'child_process';
import { describe, it, expect } from 'vitest';

describe('wtools', () => {
    it('should run without crashing', () => {
        expect(() => execSync('node bin/wtools.js -V')).not.toThrow();
    });
    it('should run without crashing', () => {
        expect(() => execSync('node bin/wtools.js --version')).not.toThrow();
    });
});